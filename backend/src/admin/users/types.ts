import type { UserStatus } from "@prisma/client";

/** 用户列表项 */
export interface AdminUserListItem {
  id: string;
  email: string;
  nickname: string;
  isVerified: boolean;
  status: UserStatus;
  memoryCount: number;
  createdAt: string;
}

/** 用户详情 */
export interface AdminUserDetail {
  id: string;
  email: string;
  nickname: string;
  signature: string;
  avatarUrl: string;
  showCardOnGuestPage: boolean;
  isVerified: boolean;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  stats: {
    memoryCount: number;
    publicMemoryCount: number;
  };
}

/** 用户印记简表项 */
export interface AdminUserMemoryItem {
  id: string;
  title: string;
  isPublic: boolean;
  createdAt: string;
}
