import Backend from '@/services/Backend';
import {
  User,
  UserBalance,
  UserStats,
  PaymentAccount,
  NotificationSettings,
  PrivacySettings,
  ApiResponse,
  PaymentMethod,
} from '@/models/domain';

const ServiceUsers = {
  async getMe(): Promise<User> {
    return Backend.get<User>('/users/me');
  },

  async updateMe(data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'username'>>): Promise<User> {
    return Backend.put<User>('/users/me', data);
  },

  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    return Backend.upload<ApiResponse<{ avatarUrl: string }>>('/users/me/avatar', formData);
  },

  async getBalance(): Promise<UserBalance> {
    return Backend.get<UserBalance>('/users/me/balance');
  },

  async getStats(): Promise<UserStats> {
    return Backend.get<UserStats>('/users/me/stats');
  },

  async findByCode(friendCode: string): Promise<User | null> {
    try {
      return await Backend.get<User>(`/users/find?code=${friendCode}`);
    } catch {
      return null;
    }
  },

  async getPaymentAccounts(): Promise<PaymentAccount[]> {
    return Backend.get<PaymentAccount[]>('/users/me/payment-accounts');
  },

  async addPaymentAccount(data: { type: PaymentMethod; label: string; value: string }): Promise<PaymentAccount> {
    return Backend.post<PaymentAccount>('/users/me/payment-accounts', data);
  },

  async removePaymentAccount(id: number): Promise<void> {
    return Backend.delete(`/users/me/payment-accounts/${id}`);
  },

  async getNotificationSettings(): Promise<NotificationSettings> {
    return Backend.get<NotificationSettings>('/users/me/notifications');
  },

  async updateNotificationSettings(data: Partial<NotificationSettings>): Promise<NotificationSettings> {
    return Backend.put<NotificationSettings>('/users/me/notifications', data);
  },

  async getPrivacySettings(): Promise<PrivacySettings> {
    return Backend.get<PrivacySettings>('/users/me/privacy');
  },

  async updatePrivacySettings(data: Partial<PrivacySettings>): Promise<PrivacySettings> {
    return Backend.put<PrivacySettings>('/users/me/privacy', data);
  },
};

export default ServiceUsers;
