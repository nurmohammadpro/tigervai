// src/tenants/tenant-connection.service.ts
import {  Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class TenantConnectionService implements OnModuleDestroy {
  private logger = new Logger(TenantConnectionService.name);
  private dbCache: Map<string, Connection> = new Map();

  constructor(@InjectConnection() private mainConnection: Connection) {}

  /**
   * Get database connection for a tenant using useDb()
   * This prevents memory leaks by reusing the main connection pool
   */
  getTenantDb(tenantName: string): Connection {
    // Return cached database if available
    if (this.dbCache.has(tenantName)) {
      this.logger.log(`Using cached database for tenant ${tenantName}`);
      return this.dbCache.get(tenantName)!;
    }

    // Use the main connection to access different database
    // useCache: true prevents creating new connections
    const db = this.mainConnection.useDb(tenantName, { useCache: true });
    this.logger.log(`Connected to database for tenant ${tenantName}`);
    
    // Cache the database reference
    this.dbCache.set(tenantName, db);
    
    return db;
  }

  /**
   * Get a model for a specific tenant
   */
  getModel<T>(tenantName: string, modelName: string, schema: any) {
    const db = this.getTenantDb(tenantName);

    // Check if model already exists
    if (db.models[modelName]) {
      return db.model<T>(modelName);
    }

    // Register model on this database
    return db.model<T>(modelName, schema);
  }

  /**
   * Clear database cache
   */
  clearCache(): void {
    this.dbCache.clear();
  }

  /**
   * NestJS lifecycle hook
   */
  async onModuleDestroy() {
    this.dbCache.clear();
  }
}
