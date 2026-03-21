// This file is auto-generated

import {
  type RegisterRequest,
  type LoginRequest,
  type MagicLoginRequest,
  type MagicLoginResponse,
  type EmailAuthRequest,
  type CodeAuthRequest,
  type CheckEmailExistsRequest,
  type CheckEmailExistsResponse,
  type ConfirmEmailRequest,
  type CreateChallengeParticipationParameters,
  type CreateChallengeParticipationResponse,
  type GetUsersResponse,
  type GetUsersQuery,
  type GetMeResponse,
  type UpdateMeRequest,
  type UpdateMeResponse,
  type UpdateMyEmailRequest,
  type UpdateMyEmailResponse,
  type GetUserParameters,
  type GetUserResponse,
  type UpdateUserParameters,
  type UpdateUserRequest,
  type UpdateUserResponse,
  type GetUserCommunitiesParameters,
  type GetUserCommunitiesResponse,
  type UpdateMeAvatarResponse,
  type GetMyNotificationsResponse,
  type UpdateMyNotificationsReadRequest,
  type CreateMyCommunityJoinRequest,
  type GetMyCommunityInvitationsResponse,
  type UpdateMyCommunityInvitationParameters,
  type UpdateMyCommunityInvitationRequest,
  type GetMyLastActiveGroupsResponse,
  type UpdateMyLastActiveGroupsParameters,
  type UpdateMyLastActiveGroupsRequest,
  type UpdateMyLastActiveGroupsResponse,
  type GetCommunityGroupsParameters,
  type GetCommunityGroupsResponse,
  type CreateCommunityGroupParameters,
  type CreateCommunityGroupRequest,
  type CreateCommunityGroupResponse,
  type GetGroupParameters,
  type GetGroupResponse,
  type UpdateGroupParameters,
  type UpdateGroupRequest,
  type UpdateGroupResponse,
  type CreateGroupArticleProgressParameters,
  type CreateGroupArticleProgressRequest,
  type CreateGroupArticleProgressResponse,
  type RemoveGroupArticleProgressParameters,
  type GetAiGuidanceParameters,
  type GetAiGuidanceResponse,
  type GetAiGuidanceQuery,
  type GetGroupStatsParameters,
  type GetGroupStatsResponse,
  type UpdateGuidanceLogParameters,
  type UpdateGuidanceLogRequest,
  type GetGroupGameWithCodeParameters,
  type GetGroupGameWithCodeResponse,
  type GetGroupGameWithIdParameters,
  type GetGroupGameWithIdResponse,
  type UpdateGroupGameParameters,
  type UpdateGroupGameRequest,
  type UpdateGroupGameResponse,
  type CreateGroupGamePlayerParameters,
  type CreateGroupGamePlayerRequest,
  type CreateGroupGamePlayerResponse,
  type RemoveGroupGamePlayerParameters,
  type CreateSprintParameters,
  type CreateSprintResponse,
  type GetHostSprintParameters,
  type GetHostSprintResponse,
  type UpdateSprintParameters,
  type UpdateSprintRequest,
  type UpdateSprintResponse,
  type GetPlayerSprintParameters,
  type GetPlayerSprintResponse,
  type CreateSprintStrengthParameters,
  type CreateSprintStrengthRequest,
  type CreateSprintStrengthResponse,
  type GetCommunitiesResponse,
  type GetCommunitiesQuery,
  type CreateCommunityRequest,
  type CreateCommunityResponse,
  type CreateCommunityInvitationParameters,
  type CreateCommunityInvitationResponse,
  type GetCommunityParameters,
  type GetCommunityResponse,
  type UpdateCommunityParameters,
  type UpdateCommunityRequest,
  type UpdateCommunityResponse,
  type UpdateCommunityBillingGroupParameters,
  type UpdateCommunityBillingGroupRequest,
  type UpdateCommunityBillingGroupResponse,
  type UpdateCommunityAvatarParameters,
  type UpdateCommunityAvatarResponse,
  type CreateCommunityUserImageParameters,
  type CreateCommunityUserImageResponse,
  type UpsertCommunityMemberParameters,
  type UpsertCommunityMemberRequest,
  type RemoveCommunityMemberParameters,
  type GetCommunityMembersParameters,
  type GetCommunityMembersResponse,
  type CreateUserToCommunityParameters,
  type CreateUserToCommunityRequest,
  type CreateUserToCommunityResponse,
  type GetCommunityStatsParameters,
  type GetCommunityStatsResponse,
  type GetCommunityProxyPostParameters,
  type GetCommunityProxyPostResponse,
  type CreateCommunityMemberInvitationParameters,
  type CreateCommunityMemberInvitationRequest,
  type CreateCommunityMemberInvitationResponse,
  type GetCommunityMemberInvitationsParameters,
  type GetCommunityMemberInvitationsResponse,
  type GetCommunitySubscriptionParameters,
  type GetCommunitySubscriptionResponse,
  type UpdateCommunitySubscriptionParameters,
  type UpdateCommunitySubscriptionRequest,
  type UpdateCommunitySubscriptionResponse,
  type GetCommunityInvitationWithCodeParameters,
  type GetCommunityInvitationWithCodeResponse,
  type CreateCommunityMomentParameters,
  type CreateCommunityMomentRequest,
  type CreateCommunityMomentResponse,
  type GetCommunityPostsParameters,
  type GetCommunityPostsResponse,
  type GetCommunityPostsQuery,
  type CreatePostCommentParameters,
  type CreatePostCommentRequest,
  type CreatePostCommentResponse,
  type CreatePostReactionParameters,
  type CreatePostReactionRequest,
  type CreatePostReactionResponse,
  type GetPostParameters,
  type GetPostResponse,
  type RemovePostParameters,
  type UpdateMomentParameters,
  type UpdateMomentRequest,
  type UpdateMomentResponse,
  type UpdateCommentParameters,
  type UpdateCommentRequest,
  type UpdateCommentResponse,
  type RemoveCommentParameters,
  type CreateCommentReactionParameters,
  type CreateCommentReactionRequest,
  type CreateCommentReactionResponse,
  type CreateCommentCommentParameters,
  type CreateCommentCommentRequest,
  type CreateCommentCommentResponse,
  type RemoveReactionParameters,
  type UpdateReactionParameters,
  type UpdateReactionRequest,
  type UpdateReactionResponse,
  type GetProxyPostsResponse,
  type CreateProxyPostImageResponse,
  type RemoveProxyPostParameters,
  type CreateChallengeRequest,
  type CreateChallengeResponse,
  type GetChallengeParameters,
  type GetChallengeResponse,
  type UpdateChallengeParameters,
  type UpdateChallengeRequest,
  type ExportCoachPostsResponse,
  type CreateCoachPostRequest,
  type CreateCoachPostResponse,
  type GetCoachPostParameters,
  type GetCoachPostResponse,
  type UpdateCoachPostParameters,
  type UpdateCoachPostRequest,
  type CreateTranlationJobRequest,
  type CreateTranlationJobResponse,
  type GetTranslationJobParameters,
  type GetTranslationJobResponse,
  type CreateArticleRequest,
  type CreateArticleResponse,
  type UpdateArticlesOrderRequest,
  type CreateArticleImageResponse,
  type CreateArticleThumbnailResponse,
  type CreateArticleAttachmentParameters,
  type CreateArticleAttachmentResponse,
  type GetArticleParameters,
  type GetArticleResponse,
  type UpdateArticleParameters,
  type UpdateArticleRequest,
  type UpdateArticleResponse,
  type RemoveArticleParameters,
  type GetArticleHistoriesParameters,
  type GetArticleHistoriesResponse,
  type GetArticleHistoryParameters,
  type GetArticleHistoryResponse,
  type GetTimelineArticlesResponse,
  type GetArticleCategoriesResponse,
  type CreateArticleCategoryRequest,
  type CreateArticleCategoryResponse,
  type UpdateArticleCategoriesOrderRequest,
  type GetArticleCategoryParameters,
  type GetArticleCategoryResponse,
  type UpdateArticleCategoryParameters,
  type UpdateArticleCategoryRequest,
  type UpdateArticleCategoryResponse,
  type RemoveArticleCategoryParameters,
  type GetEmailsResponse,
  type CreateMemoryGameParameters,
  type CreateMemoryGameRequest,
  type CreateMemoryGameResponse,
  type GetHostMemoryGameParameters,
  type GetHostMemoryGameResponse,
  type UpdateMemoryGameParameters,
  type UpdateMemoryGameRequest,
  type UpdateMemoryGameResponse,
  type GetPlayerMemoryGameParameters,
  type GetPlayerMemoryGameResponse,
  type CreateMemoryGamePickParameters,
  type CreateMemoryGamePickRequest,
  type SkipPlayerParameters,
  type RemoveCommunityMemberInvitationParameters,
  type GetUiVersionResponse,
  type GetStrengthGoalsParameters,
  type GetStrengthGoalsResponse,
  type CreateStrengthGoalParameters,
  type CreateStrengthGoalRequest,
  type CreateStrengthGoalResponse,
  type RemoveStrengthGoalsByStrengthParameters,
  type RemoveStrengthGoalsByStrengthQuery,
  type GetStrengthGoalParameters,
  type GetStrengthGoalResponse,
  type UpdateStrengthGoalParameters,
  type UpdateStrengthGoalRequest,
  type UpdateStrengthGoalResponse,
  type RemoveStrengthGoalParameters,
  type CreateStrengthGoalEventParameters,
  type CreateStrengthGoalEventResponse,
  type GetGroupStrengthCompletedCountParameters,
  type GetGroupStrengthCompletedCountResponse,
  type GetUserRetentionResponse,
  type CreateClientErrorRequest,
  type CreateVoiceoverRequest,
  type GetAnimationsResponse,
  type CreateAnimationRequest,
  type CreateAnimationResponse,
  type GetAnimationParameters,
  type GetAnimationResponse,
  type UpdateAnimationParameters,
  type UpdateAnimationRequest,
  type UpdateAnimationResponse,
  type RemoveAnimationParameters,
  type GetQuestionSetsResponse,
  type CreateQuestionSetRequest,
  type CreateQuestionSetResponse,
  type GetQuestionSetParameters,
  type GetQuestionSetResponse,
  type UpdateQuestionSetParameters,
  type UpdateQuestionSetRequest,
  type UpdateQuestionSetResponse,
  type RemoveQuestionSetParameters,
  type CreateQuizParameters,
  type CreateQuizRequest,
  type CreateQuizResponse,
  type CreateQuizPlayerParameters,
  type CreateQuizPlayerRequest,
  type CreateQuizPlayerResponse,
  type GetHostQuizParameters,
  type GetHostQuizResponse,
  type UpdateQuizParameters,
  type UpdateQuizRequest,
  type UpdateQuizResponse,
  type GetQuizWithCodeParameters,
  type GetQuizWithCodeResponse,
  type GetPlayerQuizParameters,
  type GetPlayerQuizResponse,
  type CreateQuizAnswerParameters,
  type CreateQuizAnswerRequest,
  type CreateQuizAnswerResponse,
  type RemoveQuizPlayerParameters,
  type RemoveQuizAnswerParameters,
  type GetVideoProcessingJobsResponse,
  type CreateVideoProcessingJobRequest,
  type CreateVideoProcessingJobResponse,
  type UpdateVideoProcessingJobParameters,
  type UpdateVideoProcessingJobRequest,
  type UpdateVideoProcessingJobResponse,
  type RemoveVideoProcessingJobParameters,
  type VideoProcessingJobCallbackParameters,
  type GetBillingContactsResponse,
  type GetBillingContactsQuery,
  type CreateBillingContactRequest,
  type CreateBillingContactResponse,
  type UpdateBillingContactParameters,
  type UpdateBillingContactRequest,
  type UpdateBillingContactResponse,
  type RemoveBillingContactParameters,
  type GetBillingGroupsResponse,
  type GetBillingGroupsQuery,
  type CreateBillingGroupRequest,
  type CreateBillingGroupResponse,
  type GetBillingGroupParameters,
  type GetBillingGroupResponse,
  type RemoveBillingGroupParameters,
  type UpdateBillingGroupParameters,
  type UpdateBillingGroupRequest,
  type UpdateBillingGroupResponse,
  type UpdateBillingGroupSubscriptionParameters,
  type UpdateBillingGroupSubscriptionRequest,
  type UpdateBillingGroupSubscriptionResponse,
  type GenerateStrengthDiplomaRequest,
  type GenerateGroupStrengthDiplomaParameters,
  type GenerateGroupStrengthDiplomaRequest,
  type GetAiGuidanceLogsResponse,
  type GetAiGuidanceLogsQuery,
  type GetAiGuidanceLogByIdParameters,
  type GetAiGuidanceLogByIdResponse,
  type GetCoachingPlansResponse,
  type CreateCoachingPlanRequest,
  type CreateCoachingPlanResponse,
  type GetCoachingPlanParameters,
  type GetCoachingPlanResponse,
  type UpdateCoachingPlanParameters,
  type UpdateCoachingPlanRequest,
  type UpdateCoachingPlanResponse,
  type RemoveCoachingPlanParameters,
  type GetCoachingSessionsResponse,
  type CreateCoachingSessionRequest,
  type CreateCoachingSessionResponse,
  type GetCoachingSessionParameters,
  type GetCoachingSessionResponse,
  type UpdateCoachingSessionParameters,
  type UpdateCoachingSessionRequest,
  type UpdateCoachingSessionResponse,
  type RemoveCoachingSessionParameters,
  type SendCoachingMessageParameters,
  type SendCoachingMessageRequest,
  type SendCoachingMessageResponse,
  type GetAvailableCoachingPlansResponse,
  type GetAllCoachingSessionsResponse,
  type GetCoachingBasePromptsResponse,
  type CreateCoachingBasePromptRequest,
  type CreateCoachingBasePromptResponse,
  type GetCoachingBasePromptParameters,
  type GetCoachingBasePromptResponse,
  type UpdateCoachingBasePromptParameters,
  type UpdateCoachingBasePromptRequest,
  type UpdateCoachingBasePromptResponse,
  type RemoveCoachingBasePromptParameters,
} from './ApiTypes.js';

function toQueryString(parameters: Record<string, string | undefined>): string {
  const filtered = Object.entries(parameters).filter(
    ([, v]) => v !== undefined,
  );
  return new URLSearchParams(filtered as Array<[string, string]>).toString();
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const api = {
  redirectIfNotLoggedIn(response: Response) {
    if (response.status === 401) {
      globalThis.location.href = '/start';
    }
  },

  async throwErrorIfNotOk(response: Response) {
    if (response.ok) {
      return;
    }

    const {error} = (await response.json()) as {error: string};
    if (!error) {
      throw new Error(response.statusText);
    }

    throw new ApiError(error, response.status);
  },

  async register(body: RegisterRequest): Promise<void> {
    const response = await fetch(`/api/v1/register`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async login(body: LoginRequest): Promise<void> {
    const response = await fetch(`/api/v1/login`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await this.throwErrorIfNotOk(response);
  },

  async logout(): Promise<void> {
    const response = await fetch(`/api/v1/login`, {
      method: 'DELETE',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async magicLogin(body: MagicLoginRequest): Promise<MagicLoginResponse> {
    const response = await fetch(`/api/v1/magiclogin`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<MagicLoginResponse>;
  },

  async emailAuth(body: EmailAuthRequest): Promise<void> {
    const response = await fetch(`/api/v1/emailauth`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await this.throwErrorIfNotOk(response);
  },

  async codeAuth(body: CodeAuthRequest): Promise<void> {
    const response = await fetch(`/api/v1/codeauth`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await this.throwErrorIfNotOk(response);
  },

  async checkEmailExists(
    body: CheckEmailExistsRequest,
  ): Promise<CheckEmailExistsResponse> {
    const response = await fetch(`/api/v1/check-email`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CheckEmailExistsResponse>;
  },

  async confirmEmail(body: ConfirmEmailRequest): Promise<void> {
    const response = await fetch(`/api/v1/confirm-email`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async createChallengeParticipation(
    pathParameters: CreateChallengeParticipationParameters,
  ): Promise<CreateChallengeParticipationResponse> {
    const response = await fetch(
      `/api/v1/challenges/${pathParameters.id}/participations`,
      {
        method: 'POST',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateChallengeParticipationResponse>;
  },

  async getUsers(queryParameters: GetUsersQuery): Promise<GetUsersResponse> {
    const response = await fetch(
      `/api/v1/users?${toQueryString(queryParameters)}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetUsersResponse>;
  },

  async getMe(): Promise<GetMeResponse> {
    const response = await fetch(`/api/v1/users/me`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetMeResponse>;
  },

  async updateMe(body: UpdateMeRequest): Promise<UpdateMeResponse> {
    const response = await fetch(`/api/v1/users/me`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateMeResponse>;
  },

  async updateMyEmail(
    body: UpdateMyEmailRequest,
  ): Promise<UpdateMyEmailResponse> {
    const response = await fetch(`/api/v1/users/me/email`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateMyEmailResponse>;
  },

  async getUser(pathParameters: GetUserParameters): Promise<GetUserResponse> {
    const response = await fetch(`/api/v1/users/${pathParameters.id}`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetUserResponse>;
  },

  async updateUser(
    pathParameters: UpdateUserParameters,
    body: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    const response = await fetch(`/api/v1/users/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateUserResponse>;
  },

  async getUserCommunities(
    pathParameters: GetUserCommunitiesParameters,
  ): Promise<GetUserCommunitiesResponse> {
    const response = await fetch(
      `/api/v1/users/${pathParameters.id}/communities`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetUserCommunitiesResponse>;
  },

  async updateMeAvatar(): Promise<UpdateMeAvatarResponse> {
    const response = await fetch(`/api/v1/users/me/avatar`, {
      method: 'POST',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateMeAvatarResponse>;
  },

  async getMyNotifications(): Promise<GetMyNotificationsResponse> {
    const response = await fetch(`/api/v1/users/me/notifications`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetMyNotificationsResponse>;
  },

  async updateMyNotificationsRead(
    body: UpdateMyNotificationsReadRequest,
  ): Promise<void> {
    const response = await fetch(`/api/v1/users/me/notifications/read`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async createMyCommunityJoin(
    body: CreateMyCommunityJoinRequest,
  ): Promise<void> {
    const response = await fetch(`/api/v1/users/me/community-join`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getMyCommunityInvitations(): Promise<GetMyCommunityInvitationsResponse> {
    const response = await fetch(`/api/v1/users/me/community-invitations`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetMyCommunityInvitationsResponse>;
  },

  async updateMyCommunityInvitation(
    pathParameters: UpdateMyCommunityInvitationParameters,
    body: UpdateMyCommunityInvitationRequest,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/users/me/community-invitations/${pathParameters.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getMyLastActiveGroups(): Promise<GetMyLastActiveGroupsResponse> {
    const response = await fetch(`/api/v1/users/me/last-active-groups`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetMyLastActiveGroupsResponse>;
  },

  async updateMyLastActiveGroups(
    pathParameters: UpdateMyLastActiveGroupsParameters,
    body: UpdateMyLastActiveGroupsRequest,
  ): Promise<UpdateMyLastActiveGroupsResponse> {
    const response = await fetch(
      `/api/v1/users/me/last-active-groups/${pathParameters.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateMyLastActiveGroupsResponse>;
  },

  async getUsersListCsv(): Promise<void> {
    const response = await fetch(`/api/v1/users-csv`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getCommunityGroups(
    pathParameters: GetCommunityGroupsParameters,
  ): Promise<GetCommunityGroupsResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/groups`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCommunityGroupsResponse>;
  },

  async createCommunityGroup(
    pathParameters: CreateCommunityGroupParameters,
    body: CreateCommunityGroupRequest,
  ): Promise<CreateCommunityGroupResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/groups`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCommunityGroupResponse>;
  },

  async getGroup(
    pathParameters: GetGroupParameters,
  ): Promise<GetGroupResponse> {
    const response = await fetch(`/api/v1/groups/${pathParameters.id}`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetGroupResponse>;
  },

  async updateGroup(
    pathParameters: UpdateGroupParameters,
    body: UpdateGroupRequest,
  ): Promise<UpdateGroupResponse> {
    const response = await fetch(`/api/v1/groups/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateGroupResponse>;
  },

  async createGroupArticleProgress(
    pathParameters: CreateGroupArticleProgressParameters,
    body: CreateGroupArticleProgressRequest,
  ): Promise<CreateGroupArticleProgressResponse> {
    const response = await fetch(
      `/api/v1/groups/${pathParameters.id}/article-progress`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateGroupArticleProgressResponse>;
  },

  async removeGroupArticleProgress(
    pathParameters: RemoveGroupArticleProgressParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/groups/${pathParameters.id}/article-progress/${pathParameters.article}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getAiGuidance(
    pathParameters: GetAiGuidanceParameters,
    queryParameters: GetAiGuidanceQuery,
  ): Promise<GetAiGuidanceResponse> {
    const response = await fetch(
      `/api/v1/groups/${pathParameters.id}/guidance?${toQueryString(queryParameters)}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetAiGuidanceResponse>;
  },

  async getGroupStats(
    pathParameters: GetGroupStatsParameters,
  ): Promise<GetGroupStatsResponse> {
    const response = await fetch(`/api/v1/groups/${pathParameters.id}/stats`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetGroupStatsResponse>;
  },

  async updateGuidanceLog(
    pathParameters: UpdateGuidanceLogParameters,
    body: UpdateGuidanceLogRequest,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/groups/${pathParameters.id}/guidance-logs/${pathParameters.logId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getGroupGameWithCode(
    pathParameters: GetGroupGameWithCodeParameters,
  ): Promise<GetGroupGameWithCodeResponse> {
    const response = await fetch(
      `/api/v1/group-games/player/${pathParameters.code}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetGroupGameWithCodeResponse>;
  },

  async getGroupGameWithId(
    pathParameters: GetGroupGameWithIdParameters,
  ): Promise<GetGroupGameWithIdResponse> {
    const response = await fetch(
      `/api/v1/group-games/host/${pathParameters.id}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetGroupGameWithIdResponse>;
  },

  async updateGroupGame(
    pathParameters: UpdateGroupGameParameters,
    body: UpdateGroupGameRequest,
  ): Promise<UpdateGroupGameResponse> {
    const response = await fetch(
      `/api/v1/group-games/host/${pathParameters.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateGroupGameResponse>;
  },

  async createGroupGamePlayer(
    pathParameters: CreateGroupGamePlayerParameters,
    body: CreateGroupGamePlayerRequest,
  ): Promise<CreateGroupGamePlayerResponse> {
    const response = await fetch(
      `/api/v1/group-games/${pathParameters.id}/players`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateGroupGamePlayerResponse>;
  },

  async removeGroupGamePlayer(
    pathParameters: RemoveGroupGamePlayerParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/group-games/${pathParameters.id}/players/${pathParameters.playerId}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async createSprint(
    pathParameters: CreateSprintParameters,
  ): Promise<CreateSprintResponse> {
    const response = await fetch(
      `/api/v1/groups/${pathParameters.id}/sprints`,
      {
        method: 'POST',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateSprintResponse>;
  },

  async getHostSprint(
    pathParameters: GetHostSprintParameters,
  ): Promise<GetHostSprintResponse> {
    const response = await fetch(`/api/v1/sprints/${pathParameters.id}/host`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetHostSprintResponse>;
  },

  async updateSprint(
    pathParameters: UpdateSprintParameters,
    body: UpdateSprintRequest,
  ): Promise<UpdateSprintResponse> {
    const response = await fetch(`/api/v1/sprints/${pathParameters.id}/host`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateSprintResponse>;
  },

  async getPlayerSprint(
    pathParameters: GetPlayerSprintParameters,
  ): Promise<GetPlayerSprintResponse> {
    const response = await fetch(
      `/api/v1/sprints/${pathParameters.id}/player`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetPlayerSprintResponse>;
  },

  async createSprintStrength(
    pathParameters: CreateSprintStrengthParameters,
    body: CreateSprintStrengthRequest,
  ): Promise<CreateSprintStrengthResponse> {
    const response = await fetch(
      `/api/v1/sprints/${pathParameters.id}/strengths`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateSprintStrengthResponse>;
  },

  async getCommunities(
    queryParameters: GetCommunitiesQuery,
  ): Promise<GetCommunitiesResponse> {
    const response = await fetch(
      `/api/v1/communities?${toQueryString(queryParameters)}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCommunitiesResponse>;
  },

  async createCommunity(
    body: CreateCommunityRequest,
  ): Promise<CreateCommunityResponse> {
    const response = await fetch(`/api/v1/communities`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCommunityResponse>;
  },

  async createCommunityInvitation(
    pathParameters: CreateCommunityInvitationParameters,
  ): Promise<CreateCommunityInvitationResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/invitations`,
      {
        method: 'POST',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCommunityInvitationResponse>;
  },

  async getCommunity(
    pathParameters: GetCommunityParameters,
  ): Promise<GetCommunityResponse> {
    const response = await fetch(`/api/v1/communities/${pathParameters.id}`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCommunityResponse>;
  },

  async updateCommunity(
    pathParameters: UpdateCommunityParameters,
    body: UpdateCommunityRequest,
  ): Promise<UpdateCommunityResponse> {
    const response = await fetch(`/api/v1/communities/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateCommunityResponse>;
  },

  async updateCommunityBillingGroup(
    pathParameters: UpdateCommunityBillingGroupParameters,
    body: UpdateCommunityBillingGroupRequest,
  ): Promise<UpdateCommunityBillingGroupResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/billing-group`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateCommunityBillingGroupResponse>;
  },

  async updateCommunityAvatar(
    pathParameters: UpdateCommunityAvatarParameters,
  ): Promise<UpdateCommunityAvatarResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/avatar`,
      {
        method: 'POST',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateCommunityAvatarResponse>;
  },

  async createCommunityUserImage(
    pathParameters: CreateCommunityUserImageParameters,
  ): Promise<CreateCommunityUserImageResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/userimages`,
      {
        method: 'POST',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCommunityUserImageResponse>;
  },

  async upsertCommunityMember(
    pathParameters: UpsertCommunityMemberParameters,
    body: UpsertCommunityMemberRequest,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/members/${pathParameters.userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async removeCommunityMember(
    pathParameters: RemoveCommunityMemberParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/members/${pathParameters.userId}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getCommunityMembers(
    pathParameters: GetCommunityMembersParameters,
  ): Promise<GetCommunityMembersResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/members`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCommunityMembersResponse>;
  },

  async createUserToCommunity(
    pathParameters: CreateUserToCommunityParameters,
    body: CreateUserToCommunityRequest,
  ): Promise<CreateUserToCommunityResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/users`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateUserToCommunityResponse>;
  },

  async getCommunityStats(
    pathParameters: GetCommunityStatsParameters,
  ): Promise<GetCommunityStatsResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/stats`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCommunityStatsResponse>;
  },

  async getCommunityProxyPost(
    pathParameters: GetCommunityProxyPostParameters,
  ): Promise<GetCommunityProxyPostResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/proxy-posts/${pathParameters.postId}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCommunityProxyPostResponse>;
  },

  async createCommunityMemberInvitation(
    pathParameters: CreateCommunityMemberInvitationParameters,
    body: CreateCommunityMemberInvitationRequest,
  ): Promise<CreateCommunityMemberInvitationResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/user-invitations`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCommunityMemberInvitationResponse>;
  },

  async getCommunityMemberInvitations(
    pathParameters: GetCommunityMemberInvitationsParameters,
  ): Promise<GetCommunityMemberInvitationsResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/user-invitations`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCommunityMemberInvitationsResponse>;
  },

  async getCommunitySubscription(
    pathParameters: GetCommunitySubscriptionParameters,
  ): Promise<GetCommunitySubscriptionResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/subscription`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCommunitySubscriptionResponse>;
  },

  async updateCommunitySubscription(
    pathParameters: UpdateCommunitySubscriptionParameters,
    body: UpdateCommunitySubscriptionRequest,
  ): Promise<UpdateCommunitySubscriptionResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/subscription`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateCommunitySubscriptionResponse>;
  },

  async getCommunityInvitationWithCode(
    pathParameters: GetCommunityInvitationWithCodeParameters,
  ): Promise<GetCommunityInvitationWithCodeResponse> {
    const response = await fetch(
      `/api/v1/community-invitations/${pathParameters.code}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCommunityInvitationWithCodeResponse>;
  },

  async createCommunityMoment(
    pathParameters: CreateCommunityMomentParameters,
    body: CreateCommunityMomentRequest,
  ): Promise<CreateCommunityMomentResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/moments`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCommunityMomentResponse>;
  },

  async getCommunityPosts(
    pathParameters: GetCommunityPostsParameters,
    queryParameters: GetCommunityPostsQuery,
  ): Promise<GetCommunityPostsResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/posts?${toQueryString(queryParameters)}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCommunityPostsResponse>;
  },

  async createPostComment(
    pathParameters: CreatePostCommentParameters,
    body: CreatePostCommentRequest,
  ): Promise<CreatePostCommentResponse> {
    const response = await fetch(
      `/api/v1/posts/${pathParameters.id}/comments`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreatePostCommentResponse>;
  },

  async createPostReaction(
    pathParameters: CreatePostReactionParameters,
    body: CreatePostReactionRequest,
  ): Promise<CreatePostReactionResponse> {
    const response = await fetch(
      `/api/v1/posts/${pathParameters.id}/reactions`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreatePostReactionResponse>;
  },

  async getPost(pathParameters: GetPostParameters): Promise<GetPostResponse> {
    const response = await fetch(`/api/v1/posts/${pathParameters.id}`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetPostResponse>;
  },

  async removePost(pathParameters: RemovePostParameters): Promise<void> {
    const response = await fetch(`/api/v1/posts/${pathParameters.id}`, {
      method: 'DELETE',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async updateMoment(
    pathParameters: UpdateMomentParameters,
    body: UpdateMomentRequest,
  ): Promise<UpdateMomentResponse> {
    const response = await fetch(`/api/v1/moments/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateMomentResponse>;
  },

  async updateComment(
    pathParameters: UpdateCommentParameters,
    body: UpdateCommentRequest,
  ): Promise<UpdateCommentResponse> {
    const response = await fetch(`/api/v1/comments/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateCommentResponse>;
  },

  async removeComment(pathParameters: RemoveCommentParameters): Promise<void> {
    const response = await fetch(`/api/v1/comments/${pathParameters.id}`, {
      method: 'DELETE',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async createCommentReaction(
    pathParameters: CreateCommentReactionParameters,
    body: CreateCommentReactionRequest,
  ): Promise<CreateCommentReactionResponse> {
    const response = await fetch(
      `/api/v1/comments/${pathParameters.id}/reactions`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCommentReactionResponse>;
  },

  async createCommentComment(
    pathParameters: CreateCommentCommentParameters,
    body: CreateCommentCommentRequest,
  ): Promise<CreateCommentCommentResponse> {
    const response = await fetch(
      `/api/v1/comments/${pathParameters.id}/comments`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCommentCommentResponse>;
  },

  async removeReaction(
    pathParameters: RemoveReactionParameters,
  ): Promise<void> {
    const response = await fetch(`/api/v1/reactions/${pathParameters.id}`, {
      method: 'DELETE',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async updateReaction(
    pathParameters: UpdateReactionParameters,
    body: UpdateReactionRequest,
  ): Promise<UpdateReactionResponse> {
    const response = await fetch(`/api/v1/reactions/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateReactionResponse>;
  },

  async getProxyPosts(): Promise<GetProxyPostsResponse> {
    const response = await fetch(`/api/v1/proxy-posts`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetProxyPostsResponse>;
  },

  async createProxyPostImage(): Promise<CreateProxyPostImageResponse> {
    const response = await fetch(`/api/v1/proxy-posts/images`, {
      method: 'POST',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateProxyPostImageResponse>;
  },

  async removeProxyPost(
    pathParameters: RemoveProxyPostParameters,
  ): Promise<void> {
    const response = await fetch(`/api/v1/proxy-posts/${pathParameters.id}`, {
      method: 'DELETE',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async createChallenge(
    body: CreateChallengeRequest,
  ): Promise<CreateChallengeResponse> {
    const response = await fetch(`/api/v1/challenges`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateChallengeResponse>;
  },

  async getChallenge(
    pathParameters: GetChallengeParameters,
  ): Promise<GetChallengeResponse> {
    const response = await fetch(`/api/v1/challenges/${pathParameters.id}`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetChallengeResponse>;
  },

  async updateChallenge(
    pathParameters: UpdateChallengeParameters,
    body: UpdateChallengeRequest,
  ): Promise<void> {
    const response = await fetch(`/api/v1/challenges/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async exportCoachPosts(): Promise<ExportCoachPostsResponse> {
    const response = await fetch(`/api/v1/coach-posts/export`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<ExportCoachPostsResponse>;
  },

  async createCoachPost(
    body: CreateCoachPostRequest,
  ): Promise<CreateCoachPostResponse> {
    const response = await fetch(`/api/v1/coach-posts`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCoachPostResponse>;
  },

  async getCoachPost(
    pathParameters: GetCoachPostParameters,
  ): Promise<GetCoachPostResponse> {
    const response = await fetch(`/api/v1/coach-posts/${pathParameters.id}`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCoachPostResponse>;
  },

  async updateCoachPost(
    pathParameters: UpdateCoachPostParameters,
    body: UpdateCoachPostRequest,
  ): Promise<void> {
    const response = await fetch(`/api/v1/coach-posts/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async createTranlationJob(
    body: CreateTranlationJobRequest,
  ): Promise<CreateTranlationJobResponse> {
    const response = await fetch(`/api/v1/articles/translations-job/`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateTranlationJobResponse>;
  },

  async getTranslationJob(
    pathParameters: GetTranslationJobParameters,
  ): Promise<GetTranslationJobResponse> {
    const response = await fetch(
      `/api/v1/articles/translations-job/${pathParameters.id}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetTranslationJobResponse>;
  },

  async createArticle(
    body: CreateArticleRequest,
  ): Promise<CreateArticleResponse> {
    const response = await fetch(`/api/v1/articles`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateArticleResponse>;
  },

  async updateArticlesOrder(body: UpdateArticlesOrderRequest): Promise<void> {
    const response = await fetch(`/api/v1/articles/order`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async createArticleImage(): Promise<CreateArticleImageResponse> {
    const response = await fetch(`/api/v1/articles/images`, {
      method: 'POST',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateArticleImageResponse>;
  },

  async createArticleThumbnail(): Promise<CreateArticleThumbnailResponse> {
    const response = await fetch(`/api/v1/articles/thumbnails`, {
      method: 'POST',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateArticleThumbnailResponse>;
  },

  async createArticleAttachment(
    pathParameters: CreateArticleAttachmentParameters,
  ): Promise<CreateArticleAttachmentResponse> {
    const response = await fetch(
      `/api/v1/articles/attachments/${pathParameters.fileName}`,
      {
        method: 'POST',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateArticleAttachmentResponse>;
  },

  async getArticle(
    pathParameters: GetArticleParameters,
  ): Promise<GetArticleResponse> {
    const response = await fetch(`/api/v1/articles/${pathParameters.id}`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetArticleResponse>;
  },

  async updateArticle(
    pathParameters: UpdateArticleParameters,
    body: UpdateArticleRequest,
  ): Promise<UpdateArticleResponse> {
    const response = await fetch(`/api/v1/articles/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateArticleResponse>;
  },

  async removeArticle(pathParameters: RemoveArticleParameters): Promise<void> {
    const response = await fetch(`/api/v1/articles/${pathParameters.id}`, {
      method: 'DELETE',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getArticleHistories(
    pathParameters: GetArticleHistoriesParameters,
  ): Promise<GetArticleHistoriesResponse> {
    const response = await fetch(
      `/api/v1/articles/${pathParameters.id}/history`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetArticleHistoriesResponse>;
  },

  async getArticleHistory(
    pathParameters: GetArticleHistoryParameters,
  ): Promise<GetArticleHistoryResponse> {
    const response = await fetch(
      `/api/v1/articles-history/${pathParameters.id}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetArticleHistoryResponse>;
  },

  async getTimelineArticles(): Promise<GetTimelineArticlesResponse> {
    const response = await fetch(`/api/v1/timeline-articles`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetTimelineArticlesResponse>;
  },

  async getArticleCategories(): Promise<GetArticleCategoriesResponse> {
    const response = await fetch(`/api/v1/article-categories`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetArticleCategoriesResponse>;
  },

  async createArticleCategory(
    body: CreateArticleCategoryRequest,
  ): Promise<CreateArticleCategoryResponse> {
    const response = await fetch(`/api/v1/article-categories`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateArticleCategoryResponse>;
  },

  async updateArticleCategoriesOrder(
    body: UpdateArticleCategoriesOrderRequest,
  ): Promise<void> {
    const response = await fetch(`/api/v1/article-categories/order`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getArticleCategory(
    pathParameters: GetArticleCategoryParameters,
  ): Promise<GetArticleCategoryResponse> {
    const response = await fetch(
      `/api/v1/article-categories/${pathParameters.id}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetArticleCategoryResponse>;
  },

  async updateArticleCategory(
    pathParameters: UpdateArticleCategoryParameters,
    body: UpdateArticleCategoryRequest,
  ): Promise<UpdateArticleCategoryResponse> {
    const response = await fetch(
      `/api/v1/article-categories/${pathParameters.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateArticleCategoryResponse>;
  },

  async removeArticleCategory(
    pathParameters: RemoveArticleCategoryParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/article-categories/${pathParameters.id}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getEmails(): Promise<GetEmailsResponse> {
    const response = await fetch(`/api/v1/emails`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetEmailsResponse>;
  },

  async createMemoryGame(
    pathParameters: CreateMemoryGameParameters,
    body: CreateMemoryGameRequest,
  ): Promise<CreateMemoryGameResponse> {
    const response = await fetch(
      `/api/v1/groups/${pathParameters.id}/memory-games`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateMemoryGameResponse>;
  },

  async getHostMemoryGame(
    pathParameters: GetHostMemoryGameParameters,
  ): Promise<GetHostMemoryGameResponse> {
    const response = await fetch(
      `/api/v1/memory-games/${pathParameters.id}/host`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetHostMemoryGameResponse>;
  },

  async updateMemoryGame(
    pathParameters: UpdateMemoryGameParameters,
    body: UpdateMemoryGameRequest,
  ): Promise<UpdateMemoryGameResponse> {
    const response = await fetch(
      `/api/v1/memory-games/${pathParameters.id}/host`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateMemoryGameResponse>;
  },

  async getPlayerMemoryGame(
    pathParameters: GetPlayerMemoryGameParameters,
  ): Promise<GetPlayerMemoryGameResponse> {
    const response = await fetch(
      `/api/v1/memory-games/${pathParameters.id}/player`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetPlayerMemoryGameResponse>;
  },

  async createMemoryGamePick(
    pathParameters: CreateMemoryGamePickParameters,
    body: CreateMemoryGamePickRequest,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/memory-games/${pathParameters.id}/picks`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async skipPlayer(pathParameters: SkipPlayerParameters): Promise<void> {
    const response = await fetch(
      `/api/v1/memory-games/${pathParameters.id}/skip`,
      {
        method: 'POST',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async removeCommunityMemberInvitation(
    pathParameters: RemoveCommunityMemberInvitationParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/member-invitations/${pathParameters.id}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getUiVersion(): Promise<GetUiVersionResponse> {
    const response = await fetch(`/api/v1/ui-version`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetUiVersionResponse>;
  },

  async getStrengthGoals(
    pathParameters: GetStrengthGoalsParameters,
  ): Promise<GetStrengthGoalsResponse> {
    const response = await fetch(
      `/api/v1/groups/${pathParameters.id}/strength-goals`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetStrengthGoalsResponse>;
  },

  async createStrengthGoal(
    pathParameters: CreateStrengthGoalParameters,
    body: CreateStrengthGoalRequest,
  ): Promise<CreateStrengthGoalResponse> {
    const response = await fetch(
      `/api/v1/groups/${pathParameters.id}/strength-goals`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateStrengthGoalResponse>;
  },

  async removeStrengthGoalsByStrength(
    pathParameters: RemoveStrengthGoalsByStrengthParameters,
    queryParameters: RemoveStrengthGoalsByStrengthQuery,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/groups/${pathParameters.id}/strength-goals?${toQueryString(queryParameters)}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getStrengthGoal(
    pathParameters: GetStrengthGoalParameters,
  ): Promise<GetStrengthGoalResponse> {
    const response = await fetch(
      `/api/v1/strength-goals/${pathParameters.id}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetStrengthGoalResponse>;
  },

  async updateStrengthGoal(
    pathParameters: UpdateStrengthGoalParameters,
    body: UpdateStrengthGoalRequest,
  ): Promise<UpdateStrengthGoalResponse> {
    const response = await fetch(
      `/api/v1/strength-goals/${pathParameters.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateStrengthGoalResponse>;
  },

  async removeStrengthGoal(
    pathParameters: RemoveStrengthGoalParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/strength-goals/${pathParameters.id}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async createStrengthGoalEvent(
    pathParameters: CreateStrengthGoalEventParameters,
  ): Promise<CreateStrengthGoalEventResponse> {
    const response = await fetch(
      `/api/v1/strength-goals/${pathParameters.id}/events`,
      {
        method: 'POST',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateStrengthGoalEventResponse>;
  },

  async getGroupStrengthCompletedCount(
    pathParameters: GetGroupStrengthCompletedCountParameters,
  ): Promise<GetGroupStrengthCompletedCountResponse> {
    const response = await fetch(
      `/api/v1/groups/${pathParameters.id}/strength-goals/${pathParameters.strength}/completed-count`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetGroupStrengthCompletedCountResponse>;
  },

  async getUserRetention(): Promise<GetUserRetentionResponse> {
    const response = await fetch(`/api/v1/user-retention`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetUserRetentionResponse>;
  },

  async createClientError(body: CreateClientErrorRequest): Promise<void> {
    const response = await fetch(`/api/v1/error-report`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async createVoiceover(body: CreateVoiceoverRequest): Promise<void> {
    const response = await fetch(`/api/v1/animation-assets/voiceover`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getAnimations(): Promise<GetAnimationsResponse> {
    const response = await fetch(`/api/v1/animations`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetAnimationsResponse>;
  },

  async createAnimation(
    body: CreateAnimationRequest,
  ): Promise<CreateAnimationResponse> {
    const response = await fetch(`/api/v1/animations`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateAnimationResponse>;
  },

  async getAnimation(
    pathParameters: GetAnimationParameters,
  ): Promise<GetAnimationResponse> {
    const response = await fetch(`/api/v1/animations/${pathParameters.id}`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetAnimationResponse>;
  },

  async updateAnimation(
    pathParameters: UpdateAnimationParameters,
    body: UpdateAnimationRequest,
  ): Promise<UpdateAnimationResponse> {
    const response = await fetch(`/api/v1/animations/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateAnimationResponse>;
  },

  async removeAnimation(
    pathParameters: RemoveAnimationParameters,
  ): Promise<void> {
    const response = await fetch(`/api/v1/animations/${pathParameters.id}`, {
      method: 'DELETE',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getQuestionSets(): Promise<GetQuestionSetsResponse> {
    const response = await fetch(`/api/v1/questions-sets`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetQuestionSetsResponse>;
  },

  async createQuestionSet(
    body: CreateQuestionSetRequest,
  ): Promise<CreateQuestionSetResponse> {
    const response = await fetch(`/api/v1/questions-sets`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateQuestionSetResponse>;
  },

  async getQuestionSet(
    pathParameters: GetQuestionSetParameters,
  ): Promise<GetQuestionSetResponse> {
    const response = await fetch(`/api/v1/question-sets/${pathParameters.id}`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetQuestionSetResponse>;
  },

  async updateQuestionSet(
    pathParameters: UpdateQuestionSetParameters,
    body: UpdateQuestionSetRequest,
  ): Promise<UpdateQuestionSetResponse> {
    const response = await fetch(`/api/v1/question-sets/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateQuestionSetResponse>;
  },

  async removeQuestionSet(
    pathParameters: RemoveQuestionSetParameters,
  ): Promise<void> {
    const response = await fetch(`/api/v1/question-sets/${pathParameters.id}`, {
      method: 'DELETE',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async createQuiz(
    pathParameters: CreateQuizParameters,
    body: CreateQuizRequest,
  ): Promise<CreateQuizResponse> {
    const response = await fetch(
      `/api/v1/groups/${pathParameters.id}/quizzes/`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateQuizResponse>;
  },

  async createQuizPlayer(
    pathParameters: CreateQuizPlayerParameters,
    body: CreateQuizPlayerRequest,
  ): Promise<CreateQuizPlayerResponse> {
    const response = await fetch(
      `/api/v1/quizzes/${pathParameters.id}/players`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateQuizPlayerResponse>;
  },

  async getHostQuiz(
    pathParameters: GetHostQuizParameters,
  ): Promise<GetHostQuizResponse> {
    const response = await fetch(`/api/v1/quizzes/${pathParameters.id}/host`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetHostQuizResponse>;
  },

  async updateQuiz(
    pathParameters: UpdateQuizParameters,
    body: UpdateQuizRequest,
  ): Promise<UpdateQuizResponse> {
    const response = await fetch(`/api/v1/quizzes/${pathParameters.id}/host`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateQuizResponse>;
  },

  async getQuizWithCode(
    pathParameters: GetQuizWithCodeParameters,
  ): Promise<GetQuizWithCodeResponse> {
    const response = await fetch(`/api/v1/quizzes/${pathParameters.code}`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetQuizWithCodeResponse>;
  },

  async getPlayerQuiz(
    pathParameters: GetPlayerQuizParameters,
  ): Promise<GetPlayerQuizResponse> {
    const response = await fetch(
      `/api/v1/quizzes/${pathParameters.id}/player`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetPlayerQuizResponse>;
  },

  async createQuizAnswer(
    pathParameters: CreateQuizAnswerParameters,
    body: CreateQuizAnswerRequest,
  ): Promise<CreateQuizAnswerResponse> {
    const response = await fetch(
      `/api/v1/quizzes/${pathParameters.id}/anwers`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateQuizAnswerResponse>;
  },

  async removeQuizPlayer(
    pathParameters: RemoveQuizPlayerParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/quizzes/${pathParameters.id}/players/${pathParameters.playerId}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async removeQuizAnswer(
    pathParameters: RemoveQuizAnswerParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/quizzes/${pathParameters.id}/answers/${pathParameters.answerId}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getVideoProcessingJobs(): Promise<GetVideoProcessingJobsResponse> {
    const response = await fetch(`/api/v1/video-processing-jobs`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetVideoProcessingJobsResponse>;
  },

  async createVideoProcessingJob(
    body: CreateVideoProcessingJobRequest,
  ): Promise<CreateVideoProcessingJobResponse> {
    const response = await fetch(`/api/v1/video-processing-jobs`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateVideoProcessingJobResponse>;
  },

  async updateVideoProcessingJob(
    pathParameters: UpdateVideoProcessingJobParameters,
    body: UpdateVideoProcessingJobRequest,
  ): Promise<UpdateVideoProcessingJobResponse> {
    const response = await fetch(
      `/api/v1/video-processing-jobs/${pathParameters.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateVideoProcessingJobResponse>;
  },

  async removeVideoProcessingJob(
    pathParameters: RemoveVideoProcessingJobParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/video-processing-jobs/${pathParameters.id}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async videoProcessingJobCallback(
    pathParameters: VideoProcessingJobCallbackParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/video-processing-jobs/callback/${pathParameters.id}`,
      {
        method: 'POST',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async stripeWebHook(): Promise<void> {
    const response = await fetch(`/api/v1/stripe-webhook`, {
      method: 'POST',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getBillingContacts(
    queryParameters: GetBillingContactsQuery,
  ): Promise<GetBillingContactsResponse> {
    const response = await fetch(
      `/api/v1/billing-contacts?${toQueryString(queryParameters)}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetBillingContactsResponse>;
  },

  async createBillingContact(
    body: CreateBillingContactRequest,
  ): Promise<CreateBillingContactResponse> {
    const response = await fetch(`/api/v1/billing-contacts`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateBillingContactResponse>;
  },

  async updateBillingContact(
    pathParameters: UpdateBillingContactParameters,
    body: UpdateBillingContactRequest,
  ): Promise<UpdateBillingContactResponse> {
    const response = await fetch(
      `/api/v1/billing-contacts/${pathParameters.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateBillingContactResponse>;
  },

  async removeBillingContact(
    pathParameters: RemoveBillingContactParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/billing-contacts/${pathParameters.id}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getBillingGroups(
    queryParameters: GetBillingGroupsQuery,
  ): Promise<GetBillingGroupsResponse> {
    const response = await fetch(
      `/api/v1/billing-groups?${toQueryString(queryParameters)}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetBillingGroupsResponse>;
  },

  async createBillingGroup(
    body: CreateBillingGroupRequest,
  ): Promise<CreateBillingGroupResponse> {
    const response = await fetch(`/api/v1/billing-groups`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateBillingGroupResponse>;
  },

  async getBillingGroup(
    pathParameters: GetBillingGroupParameters,
  ): Promise<GetBillingGroupResponse> {
    const response = await fetch(
      `/api/v1/billing-groups/${pathParameters.id}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetBillingGroupResponse>;
  },

  async removeBillingGroup(
    pathParameters: RemoveBillingGroupParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/billing-groups/${pathParameters.id}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async updateBillingGroup(
    pathParameters: UpdateBillingGroupParameters,
    body: UpdateBillingGroupRequest,
  ): Promise<UpdateBillingGroupResponse> {
    const response = await fetch(
      `/api/v1/billing-groups/${pathParameters.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateBillingGroupResponse>;
  },

  async updateBillingGroupSubscription(
    pathParameters: UpdateBillingGroupSubscriptionParameters,
    body: UpdateBillingGroupSubscriptionRequest,
  ): Promise<UpdateBillingGroupSubscriptionResponse> {
    const response = await fetch(
      `/api/v1/billing-groups/${pathParameters.id}/subscription`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateBillingGroupSubscriptionResponse>;
  },

  async generateStrengthDiploma(
    body: GenerateStrengthDiplomaRequest,
  ): Promise<void> {
    const response = await fetch(`/api/v1/strength-diploma/download`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async generateGroupStrengthDiploma(
    pathParameters: GenerateGroupStrengthDiplomaParameters,
    body: GenerateGroupStrengthDiplomaRequest,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/groups/${pathParameters.id}/strength-diploma/download`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getAiGuidanceLogs(
    queryParameters: GetAiGuidanceLogsQuery,
  ): Promise<GetAiGuidanceLogsResponse> {
    const response = await fetch(
      `/api/v1/ai-guidance-logs?${toQueryString(queryParameters)}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetAiGuidanceLogsResponse>;
  },

  async getAiGuidanceLogById(
    pathParameters: GetAiGuidanceLogByIdParameters,
  ): Promise<GetAiGuidanceLogByIdResponse> {
    const response = await fetch(
      `/api/v1/ai-guidance-logs/${pathParameters.id}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetAiGuidanceLogByIdResponse>;
  },

  async getCoachingPlans(): Promise<GetCoachingPlansResponse> {
    const response = await fetch(`/api/v1/coaching-plans`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCoachingPlansResponse>;
  },

  async createCoachingPlan(
    body: CreateCoachingPlanRequest,
  ): Promise<CreateCoachingPlanResponse> {
    const response = await fetch(`/api/v1/coaching-plans`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCoachingPlanResponse>;
  },

  async getCoachingPlan(
    pathParameters: GetCoachingPlanParameters,
  ): Promise<GetCoachingPlanResponse> {
    const response = await fetch(
      `/api/v1/coaching-plans/${pathParameters.id}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCoachingPlanResponse>;
  },

  async updateCoachingPlan(
    pathParameters: UpdateCoachingPlanParameters,
    body: UpdateCoachingPlanRequest,
  ): Promise<UpdateCoachingPlanResponse> {
    const response = await fetch(
      `/api/v1/coaching-plans/${pathParameters.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateCoachingPlanResponse>;
  },

  async removeCoachingPlan(
    pathParameters: RemoveCoachingPlanParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/coaching-plans/${pathParameters.id}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getCoachingSessions(): Promise<GetCoachingSessionsResponse> {
    const response = await fetch(`/api/v1/coaching-sessions`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCoachingSessionsResponse>;
  },

  async createCoachingSession(
    body: CreateCoachingSessionRequest,
  ): Promise<CreateCoachingSessionResponse> {
    const response = await fetch(`/api/v1/coaching-sessions`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCoachingSessionResponse>;
  },

  async getCoachingSession(
    pathParameters: GetCoachingSessionParameters,
  ): Promise<GetCoachingSessionResponse> {
    const response = await fetch(
      `/api/v1/coaching-sessions/${pathParameters.id}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCoachingSessionResponse>;
  },

  async updateCoachingSession(
    pathParameters: UpdateCoachingSessionParameters,
    body: UpdateCoachingSessionRequest,
  ): Promise<UpdateCoachingSessionResponse> {
    const response = await fetch(
      `/api/v1/coaching-sessions/${pathParameters.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateCoachingSessionResponse>;
  },

  async removeCoachingSession(
    pathParameters: RemoveCoachingSessionParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/coaching-sessions/${pathParameters.id}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async sendCoachingMessage(
    pathParameters: SendCoachingMessageParameters,
    body: SendCoachingMessageRequest,
  ): Promise<SendCoachingMessageResponse> {
    const response = await fetch(
      `/api/v1/coaching-sessions/${pathParameters.id}/messages`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<SendCoachingMessageResponse>;
  },

  async getAvailableCoachingPlans(): Promise<GetAvailableCoachingPlansResponse> {
    const response = await fetch(`/api/v1/available-coaching-plans`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetAvailableCoachingPlansResponse>;
  },

  async getAllCoachingSessions(): Promise<GetAllCoachingSessionsResponse> {
    const response = await fetch(`/api/v1/admin/coaching-sessions`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetAllCoachingSessionsResponse>;
  },

  async getCoachingBasePrompts(): Promise<GetCoachingBasePromptsResponse> {
    const response = await fetch(`/api/v1/coaching-base-prompts`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCoachingBasePromptsResponse>;
  },

  async createCoachingBasePrompt(
    body: CreateCoachingBasePromptRequest,
  ): Promise<CreateCoachingBasePromptResponse> {
    const response = await fetch(`/api/v1/coaching-base-prompts`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCoachingBasePromptResponse>;
  },

  async getCoachingBasePrompt(
    pathParameters: GetCoachingBasePromptParameters,
  ): Promise<GetCoachingBasePromptResponse> {
    const response = await fetch(
      `/api/v1/coaching-base-prompts/${pathParameters.id}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCoachingBasePromptResponse>;
  },

  async updateCoachingBasePrompt(
    pathParameters: UpdateCoachingBasePromptParameters,
    body: UpdateCoachingBasePromptRequest,
  ): Promise<UpdateCoachingBasePromptResponse> {
    const response = await fetch(
      `/api/v1/coaching-base-prompts/${pathParameters.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateCoachingBasePromptResponse>;
  },

  async removeCoachingBasePrompt(
    pathParameters: RemoveCoachingBasePromptParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/coaching-base-prompts/${pathParameters.id}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },
};

export default api;
