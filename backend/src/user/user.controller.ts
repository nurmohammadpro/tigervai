import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto, LoginUserGoogleDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.schema';
import { DeleteDto, PaginationDto } from 'lib/pagination.dto';
import { AuthGuard, type ExpressRequest } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.userSignup(createUserDto);
  }
  @Post('create-vendor')
  createVendor(@Body() createUserDto: CreateUserDto) {
    return this.userService.vendorSignup(createUserDto);
  }
  @Post('create-admin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.adminCreateUser(createUserDto,"admin" as UserRole);
  }
  @Post('login-user')
  userLogin(@Body() login: LoginUserDto) {
    return this.userService.login(login);

  }
  @Post('login-user-with-google')
  userLoginWithGoogle(@Body() login: LoginUserGoogleDto) {
    return this.userService.loginWithGoogle(login.idToken);

  }

  @Get('find-one-user')
  findOneUSer(@Query() query:DeleteDto) {
    return this.userService.getSingleUser(query.id!);
  }
  @Get('get-my-profile')
  @UseGuards(AuthGuard)
  getMyProfile(@Req() req: ExpressRequest) {
    return this.userService.getSingleUser(req?.user?.id!);
  }
  @Get('am-i-authenticated')
  @UseGuards(AuthGuard)
  amIAuthenticated(@Req() req: ExpressRequest) {
    this.logger.debug("am-i-authenticated->",req?.user)
    return{
      data:true,
      message:"you are authenticated"
    }
  }
  @Get('find-all-users')
  findAll(@Query() query:PaginationDto) {
    return this.userService.findAll(query,"admin" as UserRole);
  }

 /*  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  } */

  @Patch('update-user')
  update( @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto.id, updateUserDto);
  }
  @Patch('update-user-admin')
  updateUserAdmin( @Body() updateUserDto: UpdateUserDto) {
    return this.userService.adminUpdateUser(updateUserDto.id, updateUserDto,"admin" as UserRole);
  }

  @Delete('delete-user')
  remove(@Query() qeury:DeleteDto) {
    return this.userService.remove(qeury.id!,"admin" as UserRole);
  }
}
