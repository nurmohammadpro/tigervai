import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { TenantConnectionModule } from 'lib/connection/tenant-connection.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { SellProductItemModule } from './sell-product-item/sell-product-item.module';
import { CategoryBrandModule } from './category-brand/category-brand.module';
import { UploadServiceModule } from './upload-service/upload-service.module';
import { MeilisearchModule } from './meilisearch/meilisearch.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
     ConfigModule.forRoot({
    isGlobal:true
  }),
  JwtModule.register({
    global: true,
        secret: process.env.jwt ,
    signOptions: { expiresIn: '5d' },
  }),
     MongooseModule.forRoot(process.env.MONGODB_URL as string, {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
      onConnectionCreate: (connection) => {
        connection.on('connected', () => console.log('MongoDB connected'));
        connection.on('error', (err) => console.log('MongoDB error:', err));
        return connection;
      },
    }),
    
    TenantConnectionModule,
    UserModule,
    ProductModule,
    SellProductItemModule,
    CategoryBrandModule,
    UploadServiceModule,
    MeilisearchModule,
    CartModule,
 

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
