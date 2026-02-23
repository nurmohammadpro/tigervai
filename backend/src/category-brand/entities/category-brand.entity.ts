import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;
export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true })
  name: string;

  @Prop()
  logoUrl: string;


  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop()
  isTop:boolean;

}


@Schema({_id:false})
class Sub{
  @Prop({required:true})
  SubMain:string
  @Prop({ type: [String], required: true })
  subCategory: string[];
}


@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Sub], default: [] })
  sub: Sub[];

  @Prop()
  logoUrl: string;
  @Prop()
  isTop:boolean;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
export const CategorySchema = SchemaFactory.createForClass(Category);
