import process from 'node:process';
import type {RouteConfigs} from '../../types/routeconfig.js';
import definitions from '../schemas/definitions/index.js';
import authController from './auth/index.js';
import challengeController from './challenge/index.js';
import userController from './user/index.js';
import groupController from './group/index.js';
import groupGameController from './group-game/index.js';
import sprintController from './sprint/index.js';
import communityController from './community/index.js';
import communityInvitationController from './community-invitation/index.js';
import postController from './post/index.js';
import momentController from './moment/index.js';
import commentController from './comment/index.js';
import reactionController from './reaction/index.js';
import proxyPostsController from './proxy-posts/index.js';
import articleController from './article/index.js';
import articleCategoryController from './article-category/index.js';
import emailController from './email/index.js';
import memoryGameController from './memory-game/index.js';
import communityMemberInvitationController from './community-member-invitation/index.js';
import uiVersionController from './ui-version/index.js';
import strenthGoalController from './strenth-goal/index.js';
import retentionController from './retention/index.js';
import errorReportController from './error-report/index.js';
import animationAssetController from './animations/index.js';
import quizController from './quiz/index.js';
import videoProcessingJobController from './video-processing-job/index.js';
import stripeWebHookController from './stripe-webhook/index.js';
import billingContactController from './billing-contact/index.js';
import billingGroupController from './billing-group/index.js';
import strengthDiplomaController from './strength-diploma/index.js';
import aiGuidanceLogController from './ai-guidance-log/index.js';

const routes: RouteConfigs = {
  ...authController,
  ...challengeController,
  ...userController,
  ...groupController,
  ...groupGameController,
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
  ...emailController,
  ...memoryGameController,
  ...communityMemberInvitationController,
  ...uiVersionController,
  ...strenthGoalController,
  ...retentionController,
  ...errorReportController,
  ...animationAssetController,
  ...quizController,
  ...videoProcessingJobController,
  ...stripeWebHookController,
  ...billingContactController,
  ...billingGroupController,
  ...strengthDiplomaController,
  ...aiGuidanceLogController,
};

for (const path of Object.keys(routes)) {
  const config = routes[path];
  for (const method of Object.keys(config)) {
    const routeConfig = config[method as keyof typeof config];

    if (!routeConfig) {
      continue;
    }

    const {controller} = routeConfig;
    const controllerName = controller.name;

    routeConfig.controller = async (request, response, next) => {
      try {
        await controller(request, response, next);
      } catch (error) {
        if (process.env.NODE_ENV === 'test') {
          throw error;
        }

        // eslint-disable-next-line no-console
        console.error(`Error in controller ${controllerName}:`, error);
        // Attach the error to the request object for potential further handling

        request.error = error;
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
