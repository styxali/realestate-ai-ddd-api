import { IsNotEmpty, IsNumber, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreatePropertyRequest {
  // In a fully secured app, ownerId usually comes from the JWT Token.
  // For this milestone, we accept it in the body to test the relationship easily.
  @IsUUID()
  @IsNotEmpty()
  ownerId: string;

  @IsString()
  @MinLength(5, { message: 'Title is too short' })
  title: string;

  @IsString()
  @MinLength(10, { message: 'Description must be descriptive' })
  description: string;

  @IsNumber()
  @Min(0)
  price: number;
}