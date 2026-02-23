import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  Req, 
  UseGuards
} from '@nestjs/common';
import { SellProductItemService } from './sell-product-item.service';
import { CreateSellProductItemDto, GetOrdersDto, MySellsDto } from './dto/create-sell-product-item.dto';
import { OrderStatus } from './entities/sell-product-item.entity';
import { AuthGuard, type ExpressRequest } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { DeleteDto } from 'lib/pagination.dto';

@Controller('sell-product-item')
@ApiTags('Sell Product Item')
export class SellProductItemController {
  constructor(private readonly sellProductItemService: SellProductItemService) {}

  /**
   * Create sell(s) (grouped by vendor)
   */
  @Post()
  async create(@Body() dto: CreateSellProductItemDto) {
    return this.sellProductItemService.createSell(dto);
  }

  /**
   * Update order status (Vendor/Admin)
   */
  @Patch('status/:shortSellId')
  async updateStatus(
    @Param('shortSellId') shortSellId: string,
    @Body('newStatus') newStatus: OrderStatus,
    @Body('isVendor') isVendor: boolean,
  ) {
    return this.sellProductItemService.updateOrderStatus(shortSellId, newStatus);
  }

  /**
   * Get orders with pagination and sorting
   */
  @Get()
  async getOrders(@Req() req, @Query() query: GetOrdersDto) {
    const userId = req.user.id;
    const role = req.user.role;
    return this.sellProductItemService.getOrders(userId, role, query);
  }
  @Get('get-all-order')
  async getAllMyOrders( @Query() query: GetOrdersDto) {
   
    return this.sellProductItemService.getAllOrders(query);
  }
  @Get('get-admin-order')
  async getAdminOrder( @Query() query: GetOrdersDto) {
   
    return this.sellProductItemService.getAdminOrder(query);
  }
  @Get('get-my-order')
  @UseGuards(AuthGuard)
  async getOrder( @Query() query: GetOrdersDto,@Req() req:ExpressRequest) {
   
    return this.sellProductItemService.getMyOrder(query,req.user.id);
  }
  @Get('get-my-last-order')
  @UseGuards(AuthGuard)
  async getMyLastOrder( GetOrdersDto,@Req() req:ExpressRequest) {
   
    return this.sellProductItemService.getMyLastOrder(req.user.id);
  }
  @Get('get-my-dashboard-sells')
  @UseGuards(AuthGuard)
  async getMyDashBoardSells( @Query() query: MySellsDto,@Req() req:ExpressRequest) {
   
    return this.sellProductItemService.getMySellDashboard(query,req.user.id,req.user.role);
  }

  /**
   * Delete sell (both long & short)
   */
  @Delete('delete-sell')
  async deleteSell(@Query() longSellId: DeleteDto) {
    return this.sellProductItemService.deleteSell(longSellId?.id!);
  }
}
