import * as crypto from 'crypto';

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
}

export class Invitation {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly token: string,
    private readonly ownerId: string,
    private status: InvitationStatus,
    private readonly createdAt: Date,
  ) {}

  static create(email: string, ownerId: string): Invitation {
    return new Invitation(
      crypto.randomUUID(),
      email,
      crypto.randomBytes(32).toString('hex'), // Secure token
      ownerId,
      InvitationStatus.PENDING,
      new Date(),
    );
  }
markAccepted(): void {
    if (this.status !== InvitationStatus.PENDING) {
      throw new Error('Invitation is no longer valid');
    }
    this.status = InvitationStatus.ACCEPTED;
  }
  
  // Getters
  getStatus(): InvitationStatus { return this.status; }
  getId() { return this.id; }
  getEmail() { return this.email; }
  getToken() { return this.token; }
  getOwnerId() { return this.ownerId; }
}