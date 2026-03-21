import type {RouteConfigs} from '../../types/routeconfig';
import definitions from '../schemas/definitions';
import authController from './auth';
import challengeController from './challenge';
import userController from './user';
import groupController from './group';
import sprintController from './sprint';
import communityController from './community';
import communityInvitationController from './community-invitation';
import postController from './post';
import momentController from './moment';
import commentController from './comment';
import reactionController from './reaction';
import proxyPostsController from './proxy-posts';
import articleController from './article';
import articleCategoryController from './article-category';
import strengthPeriodController from './strength-period';
import analyticController from './analytics';
import emailController from './email';
import memoryGameController from './memory-game';

const routes: RouteConfigs = {
  ...authController,
  ...challengeController,
  ...userController,
  ...groupController,
  ...sprintController,
  ...communityController,
  ...communityInvitationController,
  ...postController,
  ...momentController,
  ...commentController,
  ...reactionController,
  ...proxyPostsController,
  ...articleController,
  ...articleCategoryController,
  ...strengthPeriodController,
  ...analyticController,
  ...emailController,
  ...memoryGameController,
};

for (const path of Object.keys(routes)) {
  const config = routes[path];
  for (const method of Object.keys(config)) {
    const routeConfig = config[method as keyof typeof config];

    if (!routeConfig) {
      continue;
    }

    const controller = routeConfig.controller;
    const controllerName = controller.name;

    routeConfig.controller = async (request, response, next) => {
      try {
        await controller(request, response, next);
      } catch (error) {
        request.logger.log(error);
        response.status(500).json({error: 'Internal server error'});
      }
    };

    Object.defineProperty(routeConfig.controller, 'name', {
      value: controllerName,
      writable: false,
    });

    // The allOf is needed because of bug in using $ref at top level
    // See: https://github.com/bcherny/json-schema-to-typescript/issues/132
    if (routeConfig?.response) {
      if (routeConfig.response.$ref) {
        routeConfig.response = {allOf: [{$ref: routeConfig.response.$ref}]};
      }

      routeConfig.response.definitions = definitions;
    }

    if (routeConfig?.request) {
      if (routeConfig.request.$ref) {
        routeConfig.response = {allOf: [{$ref: routeConfig.request.$ref}]};
      }

      routeConfig.request.definitions = definitions;
    }

    if (routeConfig?.query) {
      routeConfig.query.definitions = definitions;
    }
  }
}

export default routes;
