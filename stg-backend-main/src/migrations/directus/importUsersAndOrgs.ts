/* eslint-disable no-await-in-loop */
import process from 'node:process';
import {Readable} from 'node:stream';
import {Buffer} from 'node:buffer';
import {Sequelize} from 'sequelize';
import {S3Client, GetObjectCommand} from '@aws-sdk/client-s3';
import {Community, Group, User, Post, UserImage} from '../../models';
import {uploadImageVersions} from '../../api/controllers/community/uploadImageVersions';
import {type Logger} from '../../types/logger';
import {initModels} from './models/init-models';

const sequelize = new Sequelize(
  'postgres://lasselukkari@localhost:5432/stg-dump',
  {
    logging: false,
  },
);

const {
  DIRECTUS_READ_ONLY_AWS_BUCKET_NAME,
  DIRECTUS_READ_ONLY_AWS_ACCESS_KEY_ID,
  DIRECTUS_READ_ONLY_AWS_SECRET_ACCESS_KEY,
  DIRECTUS_READ_ONLY_AWS_ENDPOINT_URL,
  DIRECTUS_READ_ONLY_AWS_REGION,
} = process.env;

const config = {
  credentials: {
    accessKeyId: DIRECTUS_READ_ONLY_AWS_ACCESS_KEY_ID,
    secretAccessKey: DIRECTUS_READ_ONLY_AWS_SECRET_ACCESS_KEY,
  },
  endpoint: DIRECTUS_READ_ONLY_AWS_ENDPOINT_URL,
  region: DIRECTUS_READ_ONLY_AWS_REGION,
  forcePathStyle: true,
};

const s3client = new S3Client(config);
const models = initModels(sequelize);

const migrateOrganizations = async function (
  organizationNames: string[],
  logger: Logger,
) {
  try {
    await sequelize.authenticate();
    logger.log('Connection has been established successfully.');
  } catch (error) {
    logger.log('Unable to connect to the database:', error);
  }

  const organizations = await models.organization.findAll();

  for (const organization of organizations) {
    const organizationTranslation = await organization.getOrganization_t9ns();
    let organizationName = '';

    // Blindly just choose the last translation that is not empty regardles of language
    for (const translation of organizationTranslation) {
      if (translation.dataValues.name) {
        organizationName = translation.dataValues.name;
      }
    }

    if (!organizationNames.includes(organizationName)) {
      continue;
    }

    logger.log('Migrating organization', organizationName);

    const community = new Community({
      name: organizationName,
      description: '',
    });

    const groups = await Group.create({
      name: organizationName,
      description: '',
      community: community._id,
    });

    community.groups.push(groups._id);
    await community.save();

    const organizationUsers = await organization.getDirectus_users();

    for (const directusUser of organizationUsers) {
      let isSuperAdmin = false;
      const {email, first_name, last_name, password, avatar_slug} =
        directusUser.dataValues;
      logger.log('Migrating user', first_name, last_name, email);
      const roleData = await directusUser.getRole_directus_role();

      if (roleData) {
        const role = roleData.dataValues.name;
        if (role === 'Positive Administrator') {
          logger.log('Positive Administrator found', email);
          isSuperAdmin = true;
        }
      }

      const roles = [];

      if (isSuperAdmin) {
        roles.push('super-admin');
      }

      const user = await User.create({
        firstName: first_name,
        lastName: last_name,
        avatar: avatar_slug,
        email,
        roles,
        directusPassword: password,
        selectedCommunity: community._id,
        communities: [community._id],
      });

      const role = isSuperAdmin ? 'admin' : 'member';
      await community.upsertMemberAndSave(user._id, role);

      const moments = await directusUser.getSwl_moments();

      for (const moment of moments) {
        const files = await moment.getSwl_moment_to_files();
        const content =
          moment.dataValues.markdown_content === null
            ? undefined
            : moment.dataValues.markdown_content;
        const createdAt = moment.dataValues.date_created;
        const updatedAt = moment.dataValues.date_updated;
        const momentStrengths = await moment.getSwl_moment_to_strengths();
        const strengths = [];

        for (const momentStrength of momentStrengths) {
          const strength = await momentStrength.getStrength_strength();
          strengths.push(strength.dataValues.slug);
        }

        for (const file of files) {
          const directusFile = await file.getDirectus_files_directus_file();
          const fileName = directusFile.dataValues.filename_disk;

          const getObjectCommand = new GetObjectCommand({
            Bucket: DIRECTUS_READ_ONLY_AWS_BUCKET_NAME,
            Key: fileName,
          });

          const {Body} = await s3client.send(getObjectCommand);

          if (!Body || !(Body instanceof Readable)) {
            throw new Error('Body is not a readable stream');
          }

          const constByteAray = await Body.transformToByteArray();
          const buffer = Buffer.from(constByteAray);

          const userImage = await UserImage.create({
            community,
            ...(await uploadImageVersions(buffer)),
          });

          await Post.create({
            community,
            content,
            createdBy: user._id,
            images: [userImage._id],
            strengths,
            createdAt,
            updatedAt,
          });
        }
      }
    }
  }

  logger.log('Done mirgating organizations');
};

export default migrateOrganizations;
