import { IsNotEmpty, IsNumber, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreatePropertyRequest {
 

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