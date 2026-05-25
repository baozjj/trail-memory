/** M07 审计写入参数（与 docs/admin/M07 一致） */
export interface WriteAuditLogParams {
  adminUserId: string
  action: string
  targetType: string
  targetId: string
  payload?: Record<string, unknown>
  ip?: string
}

/** M07 前为空操作，避免 M02/M03 无法编译 */
export async function writeAuditLog(_params: WriteAuditLogParams): Promise<void> {
  // no-op until M07
}
