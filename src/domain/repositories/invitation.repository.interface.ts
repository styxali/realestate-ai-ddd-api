import { Invitation } from '../model/invitation';

export interface IInvitationRepository {
  save(invitation: Invitation): Promise<void>;
  findByToken(token: string): Promise<Invitation | null>;
}