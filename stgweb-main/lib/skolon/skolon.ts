import {createServerSideAdminDirectusClient} from '../directus';
import {SkolonConnection} from './connection';
import type {ISkolonConnection, ISkolonService, School} from './types';
import {isObject} from '@/types/runtime';

/* eslint no-await-in-loop: 0 */

export class SkolonService implements ISkolonService {
  private readonly skolonConnection: ISkolonConnection;

  constructor(skolonConnection?: ISkolonConnection) {
    this.skolonConnection = skolonConnection ?? new SkolonConnection();
  }

  public async syncBasicUserData(
    userUuid: string,
    accessToken: string,
  ): Promise<void> {
    if (!userUuid) {
      throw new Error('User uuid is required');
    }

    if (!accessToken) {
      throw new Error('Access token is required');
    }

    const userResponse = await this.skolonConnection.getUsers(
      {
        uuid: userUuid,
      },
      accessToken,
    );

    if (!userResponse?.users?.length) {
      throw new Error('Skolon user not found');
    }

    const {users} = userResponse;

    if (users.length !== 1) {
      throw new Error(`Expected 1 Skolon user, got ${users.length}`);
    }

    const skolonUser = userResponse.users[0];

    if (!skolonUser) {
      throw new Error('Skolon user not found');
    }

    const directus = await createServerSideAdminDirectusClient();

    const {data: directusUsers} = await directus.users.readByQuery({
      filter: {
        provider: {
          _eq: 'skolon',
        },
        external_identifier: {
          _eq: skolonUser.uuid,
        },
      },
      fields: ['id'],
      limit: 1,
    });

    if (!directusUsers?.length) {
      throw new Error('Directus user not found');
    }

    const directusUser = directusUsers[0];

    if (!isObject(directusUser)) {
      throw new Error('Directus user not found');
    }

    const {id} = directusUser;

    if (typeof id !== 'string') {
      throw new TypeError('Directus user id not found');
    }

    await directus.users.updateOne(id, {
      first_name: skolonUser.firstName,
      last_name: skolonUser.lastName,
      email: skolonUser.email,
      language: skolonUser.language,
    });
  }

  public async syncSchoolsForUser(userUuid: string): Promise<void> {
    if (!userUuid) {
      return;
    }

    const schoolResponse = await this.skolonConnection.getSchools({userUuid});

    // @TODO: check if the response hasMore and use the cursor to get more schools
    // as long as hasMore is true.
    for (const school of schoolResponse.schools) {
      let orgId: string | undefined;

      let schoolHasActiveLicense = await this.checkSchoolHasActiveLicense(
        school.uuid,
      );

      if (!schoolHasActiveLicense) {
        continue;
      }

      try {
        const {hasActiveLicense, id} = await this.maybeCreateSchool(school);

        schoolHasActiveLicense = hasActiveLicense;
        orgId = id;
      } catch (error) {
        console.error(error);
      }

      if (!schoolHasActiveLicense || !orgId) {
        continue;
      }

      try {
        await this.maybeAddSchoolUsersToOrganization(orgId, school.uuid);
      } catch (error) {
        console.error(error);
      }
    }
  }

  public async checkUserHasValidLicense(
    userUuid?: string,
    accessToken?: string,
  ): Promise<boolean> {
    if (!userUuid) {
      return false;
    }

    const licenses = await this.skolonConnection.getLicenses(
      {
        userUuid,
      },
      accessToken,
    );

    for (const license of licenses.licenses) {
      if (license.isDeleted) {
        continue;
      }

      let userLicense = false;

      // @TODO: After the Skolon API bug of returning only the user's licenses by userUuid has been fixed,
      // this check can probably be removed.
      for (const user of license.users) {
        if (user.uuid === userUuid) {
          userLicense = true;

          break;
        }
      }

      if (!userLicense) {
        continue;
      }

      if (new Date(license.expirationDate).getTime() > Date.now()) {
        return true;
      }
    }

    return false;
  }

  private async checkSchoolHasActiveLicense(
    schoolUuid: string,
  ): Promise<boolean> {
    if (!schoolUuid) {
      return false;
    }

    const licenses = await this.skolonConnection.getLicenses({
      ownerSchoolUuid: schoolUuid,
    });

    for (const license of licenses.licenses) {
      if (license.isDeleted) {
        continue;
      }

      if (new Date(license.expirationDate).getTime() > Date.now()) {
        return true;
      }
    }

    return false;
  }

  private async maybeCreateSchool(
    school: School,
  ): Promise<{hasActiveLicense: boolean; id?: string}> {
    const directus = await createServerSideAdminDirectusClient();

    // Check if the school already exists in the database
    const {data: orgData} = (await directus.items('organization').readByQuery({
      filter: {
        skolon_uuid: {
          _eq: school.uuid,
        },
      },
      limit: 1,
      fields: ['id'],
    })) as {data: Array<{id: string}> | undefined};

    if (orgData?.length) {
      const org = orgData[0];

      if (!org?.id) {
        throw new Error('Organization id not found');
      }

      return {hasActiveLicense: true, id: org.id};
    }

    const {data: languages} = (await directus.items('language').readByQuery({
      limit: -1,
      fields: ['code'],
    })) as {data: Array<{code: string}> | undefined};

    if (!languages?.length) {
      throw new Error('Languages not found');
    }

    const creationData = (await directus.items('organization').createOne(
      {
        skolon_uuid: school.uuid,
        slug: school.name.replaceAll(/\s+/g, '-').toLowerCase(),
        type: 'school',
      },
      {
        fields: ['id'],
      },
    )) as {id: string} | undefined;

    if (!creationData) {
      throw new Error('Organization creation failed');
    }

    const org = creationData;

    if (!org?.id) {
      throw new Error('Organization id not found');
    }

    await directus.items('organization_t9n').createMany(
      languages.map((language) => ({
        organization: org.id,
        language_code: language.code,
        name: school.name,
      })),
    );

    return {hasActiveLicense: true, id: org.id};
  }

  private async maybeAddSchoolUsersToOrganization(
    orgId: string,
    schoolUuid: string,
  ): Promise<void> {
    const directus = await createServerSideAdminDirectusClient();

    const userResponse = await this.skolonConnection.getUsers({
      schoolUuid,
    });

    const {data: userRoleData} = (await directus
      .items('directus_roles')
      .readByQuery({
        filter: {
          name: {
            _eq: 'User',
          },
        },
        limit: 1,
        fields: ['id'],
      })) as {data: Array<{id: string}> | undefined};

    if (!userRoleData?.length) {
      throw new Error('User role not found');
    }

    const userRole = userRoleData[0];

    if (!userRole?.id) {
      throw new Error('User role id not found');
    }

    // @TODO: fetch multiple times if the response's hasMore is true and cursor is set.
    for (const user of userResponse.users) {
      const {data: userData} = (await directus
        .items('directus_users')
        .readByQuery({
          filter: {
            skolon_uuid: {
              _eq: user.uuid,
            },
          },
          limit: 1,
          fields: ['id'],
        })) as {data: Array<{id: string}> | undefined};

      if (userData?.length) {
        const user = userData[0];

        if (user?.id) {
          await this.maybeAddUserToOrganization(orgId, user.id);
        }

        continue;
      }

      if (
        user.userType === 'TEACHER' &&
        (await this.checkUserHasValidLicense(user.uuid))
      ) {
        const creationData = (await directus.items('directus_users').createOne(
          {
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            skolon_uuid: user.uuid,
            role: userRole.id,
          },
          {
            fields: ['id'],
          },
        )) as {id: string} | undefined;

        if (!creationData) {
          throw new Error('User creation failed');
        }

        const createdUser = creationData;

        if (!createdUser?.id) {
          throw new Error('User id not found');
        }

        await directus.items('user_to_organization').createOne({
          user: createdUser.id,
          organization: orgId,
          role: 'member',
        });
      }
    }
  }

  private async maybeAddUserToOrganization(
    orgId: string,
    userId: string,
  ): Promise<void> {
    const directus = await createServerSideAdminDirectusClient();

    const {data: userToOrgData} = (await directus
      .items('user_to_organization')
      .readByQuery({
        filter: {
          organization: {
            _eq: orgId,
          },
          user: {
            _eq: userId,
          },
        },
        limit: 1,
        fields: ['id'],
      })) as {data: Array<{id: string}> | undefined};

    if (userToOrgData?.length) {
      return;
    }

    await directus.items('user_to_organization').createOne({
      user: userId,
      organization: orgId,
      role: 'member',
    });
  }
}
