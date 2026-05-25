/** 管理端印记列表项 */
export interface AdminMemoryListItem {
  id: string;
  title: string;
  ownerEmail: string;
  ownerNickname: string;
  typeId: string | null;
  typeLabel: string | null;
  isPublic: boolean;
  linkSuffix: string;
  shareSlug: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/** 管理端印记详情 */
export interface AdminMemoryDetail extends AdminMemoryListItem {
  content: string;
  meta: string;
  images: string[];
  coverUrl: string;
  heightWeight: number;
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}
