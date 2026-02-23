import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto, RemoveFromCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard, type ExpressRequest } from 'src/auth/auth.guard';
import { PaginationDto } from 'lib/pagination.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCartDto: CreateCartDto,@Req() req: ExpressRequest) {
    return this.cartService.create(req?.user.id,createCartDto);
  }


  @Get('get-cart')
  @UseGuards(AuthGuard)
  getCart(@Query() query:PaginationDto,@Req() req: ExpressRequest) {
    return this.cartService.getCart(query,req?.user.id);
  }

  @Get('get-cart-list')
  @UseGuards(AuthGuard)
  getCartList(@Req() req: ExpressRequest) {
    return this.cartService.getCartList(req?.user.id);
  }

  

  @Delete(':userId/remove')

  removeFromCart(
    @Param('userId') userId: string,
    @Body() dto: RemoveFromCartDto,
  ) {
    return this.cartService.removeFromCart(userId, dto.productId);
  }
}
