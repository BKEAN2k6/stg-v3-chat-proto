import {fetchAccessToken, type AccessToken} from './fetchAccessToken';
import {
  isLicenseResponse,
  isSchoolResponse,
  isSkolonResponse,
  isUserResponse,
  type GetLicensesOptions,
  type GetSchoolsOptions,
  type GetUsersOptions,
  type ISkolonConnection,
  type LicenseResponse,
  type SchoolResponse,
  type SkolonResponse,
  type SkolonSDK,
  type UserResponse,
} from './types';

export class SkolonConnection implements ISkolonConnection {
  private static ensureValidResponse(
    resp: unknown,
  ): asserts resp is SkolonResponse {
    if (!isSkolonResponse(resp)) {
      throw new Error('Invalid response from Skolon');
    }

    if (resp.status !== 200) {
      throw new Error(`Skolon responded with status ${resp.status}`);
    }
  }

  private accessToken?: AccessToken;
  private readonly sdk: SkolonSDK;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    this.sdk = require('api')('@skolon/v2#j7nubldt3lrff');
  }

  public async getUsers(
    options?: GetUsersOptions,
    accessToken?: string,
  ): Promise<UserResponse> {
    await this.ensureAccessToken(accessToken);

    const resp = await this.sdk.partner_API_v2GetUsers(options);

    SkolonConnection.ensureValidResponse(resp);

    if (!isUserResponse(resp.data)) {
      throw new Error('Invalid response from Skolon');
    }

    return resp.data;
  }

  public async getSchools(
    options?: GetSchoolsOptions,
    accessToken?: string,
  ): Promise<SchoolResponse> {
    await this.ensureAccessToken(accessToken);

    const resp = await this.sdk.partner_API_v2GetSchools(options);

    SkolonConnection.ensureValidResponse(resp);

    if (!isSchoolResponse(resp.data)) {
      throw new Error('Invalid response from Skolon');
    }

    return resp.data;
  }

  public async getLicenses(
    options?: GetLicensesOptions,
    accessToken?: string,
  ): Promise<LicenseResponse> {
    await this.ensureAccessToken(accessToken);

    const resp = await this.sdk.partner_API_v2GetLicenses(options);

    SkolonConnection.ensureValidResponse(resp);

    if (!isLicenseResponse(resp.data)) {
      throw new Error('Invalid response from Skolon');
    }

    return resp.data;
  }

  private async ensureAccessToken(accessToken?: string) {
    if (accessToken) {
      this.sdk.auth(accessToken);

      return;
    }

    if (!this.accessToken || this.accessToken.expiresAt < Date.now()) {
      this.accessToken = await fetchAccessToken();
    }

    this.sdk.auth(this.accessToken.token);
  }
}
