import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProductData {
  name: string;
  description: string;
  sku: string;
  barcode: string;
  price: number;
  userId: Types.ObjectId;
  dateCreate: Date;
}

export interface IProduct extends IProductData, Document {}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  barcode: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  userId: { type: Types.ObjectId, required: true, ref: 'User' },
  dateCreate: { type: Date, default: Date.now }
});

const Product = mongoose.model<IProduct>('Product', ProductSchema, 'products');
export default Product; 