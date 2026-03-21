// This file is auto-generated

import {
  type LoginRequest,
  type MagicLoginRequest,
  type MagicLoginResponse,
  type EmailAuthRequest,
  type EmailAuthResponse,
  type CodeAuthRequest,
  type CheckEmailExistsRequest,
  type CheckEmailExistsResponse,
  type ConfirmEmailRequest,
  type CreateChallengeParticipationParameters,
  type CreateChallengeParticipationResponse,
  type CreateUserRequest,
  type CreateUserResponse,
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
  type GetGroupParameters,
  type GetGroupResponse,
  type UpdateGroupParameters,
  type UpdateGroupRequest,
  type UpdateGroupResponse,
  type CreateSprintPlayerParameters,
  type CreateSprintPlayerRequest,
  type CreateSprintPlayerResponse,
  type GetHostSprintParameters,
  type GetHostSprintResponse,
  type UpdateSprintParameters,
  type UpdateSprintRequest,
  type UpdateSprintResponse,
  type GetSprintWithCodeParameters,
  type GetSprintWithCodeResponse,
  type GetPlayerSprintParameters,
  type GetPlayerSprintResponse,
  type CreateSprintStrengthParameters,
  type CreateSprintStrengthRequest,
  type CreateSprintStrengthResponse,
  type RemoveSprintPlayerParameters,
  type GetCommunitiesResponse,
  type GetCommunitiesQuery,
  type CreateCommunityRequest,
  type CreateCommunityResponse,
  type CreateCommunityInvitationParameters,
  type CreateCommunityInvitationRequest,
  type CreateCommunityInvitationResponse,
  type GetCommunityParameters,
  type GetCommunityResponse,
  type UpdateCommunityParameters,
  type UpdateCommunityRequest,
  type UpdateCommunityResponse,
  type UpdateCommunityAvatarParameters,
  type UpdateCommunityAvatarResponse,
  type GetCommunityGroupsParameters,
  type GetCommunityGroupsResponse,
  type CreateCommunityGroupParameters,
  type CreateCommunityGroupRequest,
  type CreateCommunityGroupResponse,
  type CreateCommunityMomentParameters,
  type CreateCommunityMomentRequest,
  type CreateCommunityMomentResponse,
  type GetCommunityPostsParameters,
  type GetCommunityPostsResponse,
  type GetCommunityPostsQuery,
  type CreateCommunityUserImageParameters,
  type CreateCommunityUserImageResponse,
  type UpsertCommunityMemberParameters,
  type UpsertCommunityMemberRequest,
  type RemoveCommunityMemberParameters,
  type GetCommunityMembersParameters,
  type GetCommunityMembersResponse,
  type CreateUserToCommunityParameters,
  type CreateUserToCommunityRequest,
  type GetCommunityStatsParameters,
  type GetCommunityStatsResponse,
  type CreateCommunityMoodParameters,
  type CreateCommunityMoodRequest,
  type CreateCommunityMoodResponse,
  type CreateCommunitySprintParameters,
  type CreateCommunitySprintResponse,
  type GetCommunityProxyPostParameters,
  type GetCommunityProxyPostResponse,
  type GetCommunityInvitationWithCodeParameters,
  type GetCommunityInvitationWithCodeResponse,
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
  type UpdateChallengeResponse,
  type CreateCoachPostRequest,
  type CreateCoachPostResponse,
  type GetCoachPostParameters,
  type GetCoachPostResponse,
  type UpdateCoachPostParameters,
  type UpdateCoachPostRequest,
  type UpdateCoachPostResponse,
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
  type GetStrengthPeriodsResponse,
  type CreateStrengthPeriodRequest,
  type CreateStrengthPeriodResponse,
  type RemoveStrengthPeriodParameters,
  type UpdateStrengthPeriodParameters,
  type UpdateStrengthPeriodRequest,
  type UpdateStrengthPeriodResponse,
  type GetClicksResponse,
  type GetClicksQuery,
  type CreateClickRequest,
  type GetPageViewsResponse,
  type GetPageViewsQuery,
  type CreatePageViewRequest,
  type GetDailyActiveUsersResponse,
  type GetDailyActiveUsersQuery,
  type GetWeeklyActiveUsersResponse,
  type GetWeeklyActiveUsersQuery,
  type GetMonthlyActiveUsersResponse,
  type GetMonthlyActiveUsersQuery,
  type GetEmailsResponse,
  type CreateMemoryGameParameters,
  type CreateMemoryGameRequest,
  type CreateMemoryGameResponse,
  type CreateMemoryGamePlayerParameters,
  type CreateMemoryGamePlayerRequest,
  type CreateMemoryGamePlayerResponse,
  type GetHostMemoryGameParameters,
  type GetHostMemoryGameResponse,
  type UpdateMemoryGameParameters,
  type UpdateMemoryGameRequest,
  type UpdateMemoryGameResponse,
  type GetMemoryGameWithCodeParameters,
  type GetMemoryGameWithCodeResponse,
  type GetPlayerMemoryGameParameters,
  type GetPlayerMemoryGameResponse,
  type CreateMemoryGamePickParameters,
  type CreateMemoryGamePickRequest,
  type RemoveMemoryGamePlayerParameters,
} from './ApiTypes';

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
      window.location.href = '/start';
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

  async emailAuth(body: EmailAuthRequest): Promise<EmailAuthResponse> {
    const response = await fetch(`/api/v1/emailauth`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<EmailAuthResponse>;
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

  async createUser(body: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await fetch(`/api/v1/users`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateUserResponse>;
  },

  async getUsers(queryParameters: GetUsersQuery): Promise<GetUsersResponse> {
    const response = await fetch(
      `/api/v1/users?${new URLSearchParams(queryParameters).toString()}`,
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
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateGroupResponse>;
  },

  async createSprintPlayer(
    pathParameters: CreateSprintPlayerParameters,
    body: CreateSprintPlayerRequest,
  ): Promise<CreateSprintPlayerResponse> {
    const response = await fetch(
      `/api/v1/sprints/${pathParameters.id}/players`,
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

    return response.json() as Promise<CreateSprintPlayerResponse>;
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

  async getSprintWithCode(
    pathParameters: GetSprintWithCodeParameters,
  ): Promise<GetSprintWithCodeResponse> {
    const response = await fetch(`/api/v1/sprints/${pathParameters.code}`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetSprintWithCodeResponse>;
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

  async removeSprintPlayer(
    pathParameters: RemoveSprintPlayerParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/sprints/${pathParameters.id}/players/${pathParameters.playerId}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getCommunities(
    queryParameters: GetCommunitiesQuery,
  ): Promise<GetCommunitiesResponse> {
    const response = await fetch(
      `/api/v1/communities?${new URLSearchParams(queryParameters).toString()}`,
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
    body: CreateCommunityInvitationRequest,
  ): Promise<CreateCommunityInvitationResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/invitations`,
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
      `/api/v1/communities/${pathParameters.id}/posts?${new URLSearchParams(queryParameters).toString()}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetCommunityPostsResponse>;
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
  ): Promise<void> {
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

  async createCommunityMood(
    pathParameters: CreateCommunityMoodParameters,
    body: CreateCommunityMoodRequest,
  ): Promise<CreateCommunityMoodResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/moods`,
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

    return response.json() as Promise<CreateCommunityMoodResponse>;
  },

  async createCommunitySprint(
    pathParameters: CreateCommunitySprintParameters,
  ): Promise<CreateCommunitySprintResponse> {
    const response = await fetch(
      `/api/v1/communities/${pathParameters.id}/sprints`,
      {
        method: 'POST',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateCommunitySprintResponse>;
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
  ): Promise<UpdateChallengeResponse> {
    const response = await fetch(`/api/v1/challenges/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateChallengeResponse>;
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
  ): Promise<UpdateCoachPostResponse> {
    const response = await fetch(`/api/v1/coach-posts/${pathParameters.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<UpdateCoachPostResponse>;
  },

  async createArticesBackup(): Promise<void> {
    const response = await fetch(`/api/v1/articles/backup`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
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

  async getStrengthPeriods(): Promise<GetStrengthPeriodsResponse> {
    const response = await fetch(`/api/v1/strength-periods`, {
      method: 'GET',
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetStrengthPeriodsResponse>;
  },

  async createStrengthPeriod(
    body: CreateStrengthPeriodRequest,
  ): Promise<CreateStrengthPeriodResponse> {
    const response = await fetch(`/api/v1/strength-periods`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<CreateStrengthPeriodResponse>;
  },

  async removeStrengthPeriod(
    pathParameters: RemoveStrengthPeriodParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/strength-periods/${pathParameters.id}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async updateStrengthPeriod(
    pathParameters: UpdateStrengthPeriodParameters,
    body: UpdateStrengthPeriodRequest,
  ): Promise<UpdateStrengthPeriodResponse> {
    const response = await fetch(
      `/api/v1/strength-periods/${pathParameters.id}`,
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

    return response.json() as Promise<UpdateStrengthPeriodResponse>;
  },

  async getClicks(queryParameters: GetClicksQuery): Promise<GetClicksResponse> {
    const response = await fetch(
      `/api/v1/analytics/clicks?${new URLSearchParams(queryParameters).toString()}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetClicksResponse>;
  },

  async createClick(body: CreateClickRequest): Promise<void> {
    const response = await fetch(`/api/v1/analytics/clicks`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getPageViews(
    queryParameters: GetPageViewsQuery,
  ): Promise<GetPageViewsResponse> {
    const response = await fetch(
      `/api/v1/analytics/page-views?${new URLSearchParams(queryParameters).toString()}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetPageViewsResponse>;
  },

  async createPageView(body: CreatePageViewRequest): Promise<void> {
    const response = await fetch(`/api/v1/analytics/page-views`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },

  async getDailyActiveUsers(
    queryParameters: GetDailyActiveUsersQuery,
  ): Promise<GetDailyActiveUsersResponse> {
    const response = await fetch(
      `/api/v1/analytics/daily-active-users?${new URLSearchParams(queryParameters).toString()}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetDailyActiveUsersResponse>;
  },

  async getWeeklyActiveUsers(
    queryParameters: GetWeeklyActiveUsersQuery,
  ): Promise<GetWeeklyActiveUsersResponse> {
    const response = await fetch(
      `/api/v1/analytics/weekly-active-users?${new URLSearchParams(queryParameters).toString()}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetWeeklyActiveUsersResponse>;
  },

  async getMonthlyActiveUsers(
    queryParameters: GetMonthlyActiveUsersQuery,
  ): Promise<GetMonthlyActiveUsersResponse> {
    const response = await fetch(
      `/api/v1/analytics/monthly-active-users?${new URLSearchParams(queryParameters).toString()}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetMonthlyActiveUsersResponse>;
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
      `/api/v1/community/${pathParameters.id}/memory-games`,
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

  async createMemoryGamePlayer(
    pathParameters: CreateMemoryGamePlayerParameters,
    body: CreateMemoryGamePlayerRequest,
  ): Promise<CreateMemoryGamePlayerResponse> {
    const response = await fetch(
      `/api/v1/memory-games/${pathParameters.id}/players`,
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

    return response.json() as Promise<CreateMemoryGamePlayerResponse>;
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

  async getMemoryGameWithCode(
    pathParameters: GetMemoryGameWithCodeParameters,
  ): Promise<GetMemoryGameWithCodeResponse> {
    const response = await fetch(
      `/api/v1/memory-games/${pathParameters.code}`,
      {
        method: 'GET',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);

    return response.json() as Promise<GetMemoryGameWithCodeResponse>;
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

  async removeMemoryGamePlayer(
    pathParameters: RemoveMemoryGamePlayerParameters,
  ): Promise<void> {
    const response = await fetch(
      `/api/v1/memory-games/${pathParameters.id}/players/${pathParameters.playerId}`,
      {
        method: 'DELETE',
      },
    );

    this.redirectIfNotLoggedIn(response);
    await this.throwErrorIfNotOk(response);
  },
};

export default api;
