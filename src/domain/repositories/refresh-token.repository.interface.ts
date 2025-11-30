export interface RefreshTokenEntity {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface IRefreshTokenRepository {
  create(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  findLatest(userId: string): Promise<RefreshTokenEntity | null>;
  revoke(id: string): Promise<void>; // Used for rotation (delete/invalidate)
  revokeAllForUser(userId: string): Promise<void>; // Security kill switch
}