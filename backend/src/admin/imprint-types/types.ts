import type { ImprintCoverImageInfo } from "../../lib/imprint-cover-info.js";

/** 管理端印记类型 */
export interface AdminImprintType {
  id: string;
  label: string;
  coverPath: string;
  coverInfo: ImprintCoverImageInfo;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/** C 端公开项 */
export interface PublicImprintType {
  id: string;
  label: string;
  coverSrc: string;
}
