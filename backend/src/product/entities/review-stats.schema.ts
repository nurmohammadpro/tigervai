// src/review/schemas/review-stats.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ReviewStatsDocument = HydratedDocument<ReviewStats>;

@Schema({ timestamps: true })
export class ReviewStats {
  @Prop({ type: MongooseSchema.Types.ObjectId, unique: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({type: MongooseSchema.Types.ObjectId})
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ default: 0 })
  count5: number;

  @Prop({ default: 0 })
  count4: number;

  @Prop({ default: 0 })
  count3: number;

  @Prop({ default: 0 })
  count2: number;

  @Prop({ default: 0 })
  count1: number;
}

export const ReviewStatsSchema = SchemaFactory.createForClass(ReviewStats);
