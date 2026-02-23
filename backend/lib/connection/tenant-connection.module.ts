// src/tenants/tenant-connection.module.ts
import { Global, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { TenantConnectionService } from './mongooseConnection.service';

@Global()
@Module({
  imports: [
   
  ],
  providers: [TenantConnectionService],
  exports: [TenantConnectionService], 
})
export class TenantConnectionModule {}
