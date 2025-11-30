export interface ITokenService {
  sign(payload: object): string;
}