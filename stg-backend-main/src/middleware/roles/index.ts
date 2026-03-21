import type {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import type {Logger} from '../../types/logger';

type UserRole = {
  userId: string;
  role: string;
  _id: string;
};

type ResourceRoles = {
  roles: UserRole[];
  subRoles: ResourceRoles[];
};

class RolesResolver {
  constructor(private readonly logger: Logger) {}

  getRolesMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      request.roles = await this.getRoles(request.user, request.params.id);
      next();
    } catch (error) {
      this.logger.log(error);
      response.status(500).json({error: 'Failed to get roles'});
    }
  };

  async getRoles(user?: {id: string; roles: string[]}, resourceId?: string) {
    const roles = ['public'];

    if (!user) {
      return roles;
    }

    roles.push('authenticated', ...user.roles);

    if (!resourceId) {
      return roles;
    }

    const resourceRoles = await this.#getDBRoles(user.id, resourceId);
    roles.push(...resourceRoles);

    return roles;
  }

  async #getDBRoles(userId: string, resourceId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const query = mongoose.connection.db.collection('aclitems').aggregate([
      {
        $match: {
          resourceId,
        },
      },
      {
        $graphLookup: {
          from: 'aclitems',
          startWith: '$parent',
          connectFromField: 'parent',
          connectToField: 'resourceId',
          as: 'subRoles',
        },
      },
      {
        $project: {
          _id: 0,
          roles: {
            $filter: {
              input: '$roles',
              as: 'role',
              cond: {
                $eq: ['$$role.user', userObjectId],
              },
            },
          },
          subRoles: {
            $map: {
              input: '$subRoles',
              as: 'subRole',
              in: {
                _id: '$$subRole._id',
                resourceId: '$$subRole.resourceId',
                roles: {
                  $filter: {
                    input: '$$subRole.roles',
                    as: 'role',
                    cond: {
                      $eq: ['$$role.user', userObjectId],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    const resourceRoles = (await query.toArray()) as ResourceRoles[];
    return this.#combineRoles(resourceRoles);
  }

  #combineRoles(input: ResourceRoles[]): string[] {
    const uniqueRoles = new Set<string>();

    for (const item of input) {
      for (const role of item.roles) {
        uniqueRoles.add(role.role);
      }

      for (const subRole of item.subRoles) {
        for (const role of subRole.roles) {
          uniqueRoles.add(role.role);
        }
      }
    }

    return Array.from(uniqueRoles);
  }
}

export default RolesResolver;
