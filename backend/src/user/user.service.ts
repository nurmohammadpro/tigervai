// src/user/user.service.ts

import { HttpException, Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import slugify from 'slugify';

import { User, UserDocument, UserSchema, UserRole } from './entities/user.schema';
import { PaginationDto } from 'lib/pagination.dto';
import { TenantConnectionService } from 'lib/connection/mongooseConnection.service';
import { globalUser } from 'lib/global-db/globaldb';
import {OAuth2Client } from "google-auth-library"

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    private jwtService: JwtService,
    private tenantConnectionService: TenantConnectionService,
  ) {}

  private userModel() {
    return this.tenantConnectionService.getModel<UserDocument>(
      globalUser,
      User.name,
      UserSchema,
    );
  }

  // ✅ ************ USER SIGNUP (CUSTOMER) ************ //
  async userSignup(dto: CreateUserDto) {
    if (dto.role !== UserRole.USER) dto.role = UserRole.USER;
    
   
    const createUser ={
      ...dto,
      isVerified: true
    }
    return this.createBaseUser(createUser);
  }

  // ✅ ************ VENDOR SIGNUP ************ //
  async vendorSignup(dto: CreateUserDto) {
    dto.role = UserRole.VENDOR;

    // vendor must have shop fields
    if (!dto.shopName) throw new HttpException('Shop name is required', 400);
     const createUser ={
      ...dto,
      isVerified: false
    }

    return this.createBaseUser(createUser);
  }

  // ✅ ************ ADMIN CREATION ************ //
  async adminCreateUser(dto: CreateUserDto, adminRole: UserRole) {
    // Only admin can create users
    if (adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can create user/vendor/manager/editor');
    }

    // Admin can set any role
    return this.createBaseUser(dto);
  }

  // ✅ Base create method (used by all signup types)
  private async createBaseUser(dto: CreateUserDto) {
    const model = this.userModel();
    if (!dto.password) throw new HttpException('Password is required', 400);

    // generate slug
    const rawSlug = `${dto.name}-${dto.email}`;
    const slug = slugify(rawSlug);

    // check exists
    const exists = await model.exists({
      $or: [{ email: dto.email }, { slug }],
    });

    if (exists) throw new HttpException('User already exists', 400);

    // hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const finalData = {
      ...dto,
      password: passwordHash,
      slug,
    };

    const create = await model.create(finalData);

    return {
      message: 'Account created successfully',
      data: create,
    };
  }

  // ✅ ************ LOGIN ************ //
  async login(dto: LoginUserDto) {
    const model = this.userModel();

    const user = await model.findOne({ email: dto.email }).lean();
    if (!user) throw new HttpException('User not found', 400);

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new HttpException('Invalid credentials', 400);

    // token payload
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      slug: user.slug,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '60d',
      secret: process.env.ACCESS_TOKEN,
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: process.env.REFRESH_TOKEN,
    });

    return {
      message: 'Login successful',
      access_token,
      refresh_token,
      user,
    };
  }


    async loginWithGoogle(tokenId:string) {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
       const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    })
   const googlePayload = ticket.getPayload();
   this.logger.debug('googlePayload',googlePayload)
   const {email,name,picture,} = googlePayload as {email:string,name:string,picture:string}
  
 


    const model = this.userModel();

   let user = await model.findOne({ email });

if (!user) {
     const rawSlug = `${name}-${email}`;
    const slug = slugify(rawSlug);
  user = await model.create({
    email,
    name,
    role: UserRole.USER,
    isVerified: true,
    slug
  });
}




    // token payload
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      slug: user.slug,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '60d',
      secret: process.env.ACCESS_TOKEN,
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: process.env.REFRESH_TOKEN,
    });

    return {
      message: 'Login successful',
      access_token,
      refresh_token,
      user,
    };
  }

  // ✅ ************ FIND ALL USERS (ADMIN ONLY) ************ //
  async findAll(query: PaginationDto, role: UserRole) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can list users');
    }

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } =
      query;

    const model = this.userModel();

    const skip = (page - 1) * limit;

    const total = await model.countDocuments();
    const data = await model
      .find()
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  // ✅ ************ USER SELF UPDATE ************ //
  async updateUser(id: string, dto: UpdateUserDto) {
    const model = this.userModel();

    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);

    const updated = await model.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) throw new HttpException('User not found', 404);

    return {
      message: 'Profile updated successfully',
      data: updated,
    };
  }

  // ✅ ************ ADMIN UPDATE USER ************ //
  async adminUpdateUser(id: string, dto: UpdateUserDto, adminRole: UserRole) {
    if (adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can update other users');
    }

    const model = this.userModel();

    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);

    const updated = await model.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) throw new HttpException('User not found', 404);

    return {
      message: 'User updated successfully by admin',
      data: updated,
    };
  }

  // ✅ ************ DELETE USER ************ //
  async remove(id: string, adminRole: UserRole) {
    if (adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can delete users');
    }

    const model = this.userModel();

    const deleted = await model.findByIdAndDelete(id);

    if (!deleted) throw new HttpException('User not found', 404);

    return {
      message: 'User removed successfully',
    };
  }

  // ✅ ************ get single user ************ //

  async getSingleUser(id: string) {
    const model = this.userModel();

    const user = await model.findById(id).lean();

    if (!user) throw new HttpException('User not found', 404);

    return {
      message: 'User found successfully',
      data: user,
    };
  }
}
