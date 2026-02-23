// src/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.schema';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';


export class CreateUserDto {
  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  // ✅ COMMON FIELDS
  @ApiProperty({ description: 'Full name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email for login', example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number of the user' })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  password: string;

  @ApiProperty({
    required: false,
    description: 'Address of the user (USER ONLY)',
  })
  @IsOptional()
  @IsString()
  address?: string;

  // ✅ VENDOR ONLY FIELDS
  @ApiProperty({
    required: false,
    description: 'Vendor shop name (VENDOR ONLY)',
    example: 'Rifat Fashion Zone',
  })
  @IsOptional()
  @IsString()
  shopName?: string;

  @ApiProperty({
    required: false,
    description: 'Vendor shop logo URL (VENDOR ONLY)',
  })
  @IsOptional()
  @IsString()
  shopLogo?: string;

  @ApiProperty({
    required: false,
    description: 'Vendor shop physical address (VENDOR ONLY)',
  })
  @IsOptional()
  @IsString()
  shopAddress?: string;

  @ApiProperty({
    required: false,
    description: 'Vendor shop description (VENDOR ONLY)',
  })
  @IsOptional()
  @IsString()
  vendorDescription?: string;
  @ApiProperty({
    required: false,
    description: 'true',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()

  isVerified?: boolean;
}
export class LoginUserDto {
    @ApiProperty({
      description: 'The email of the user',
      example: 'user@example.com',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;
  
    @ApiProperty({
      description: 'The password of the user',
      example: 'Password123!',
    })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
  }
  export class LoginUserGoogleDto {
    @ApiProperty({
      description: 'The email of the user',
      example: 'user@example.com',
    })
  
    idToken: string;
  
    
  }