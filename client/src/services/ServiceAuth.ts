import Backend from '@/services/Backend';
import {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  VerifyRequest,
  ChangePasswordRequest,
  ApiResponse,
  User,
} from '@/models/domain';

const ServiceAuth = {
  async login(data: LoginRequest): Promise<ApiResponse<AuthTokens & { user: User }>> {
    const result = await Backend.post<ApiResponse<AuthTokens & { user: User }>>('/auth/login', data);
    if (result.success && result.data) {
      Backend.setToken(result.data.accessToken);
      if (result.data.refreshToken) {
        Backend.setRefreshToken(result.data.refreshToken);
      }
    }
    return result;
  },

  async register(data: RegisterRequest): Promise<ApiResponse<{ email: string }>> {
    return Backend.post<ApiResponse<{ email: string }>>('/auth/register', data);
  },

  async verify(data: VerifyRequest): Promise<ApiResponse<AuthTokens & { user: User }>> {
    const result = await Backend.post<ApiResponse<AuthTokens & { user: User }>>('/auth/verify', data);
    if (result.success && result.data) {
      Backend.setToken(result.data.accessToken);
      if (result.data.refreshToken) {
        Backend.setRefreshToken(result.data.refreshToken);
      }
    }
    return result;
  },

  async resendCode(email: string): Promise<ApiResponse> {
    return Backend.post<ApiResponse>('/auth/resend-code', { email });
  },

  async loginAsGuest(): Promise<ApiResponse<AuthTokens & { user: User }>> {
    const result = await Backend.post<ApiResponse<AuthTokens & { user: User }>>('/auth/guest');
    if (result.success && result.data) {
      Backend.setToken(result.data.accessToken);
    }
    return result;
  },

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    return Backend.post<ApiResponse>('/auth/change-password', data);
  },

  async logout(): Promise<void> {
    try {
      await Backend.post('/auth/logout');
    } finally {
      Backend.clearTokens();
    }
  },

  isAuthenticated(): boolean {
    return Backend.isAuthenticated();
  },
};

export default ServiceAuth;
