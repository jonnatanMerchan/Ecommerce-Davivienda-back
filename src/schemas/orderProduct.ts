import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderProductData {
  orderId: Types.ObjectId;
  productId: string;
  units: number;
}

export interface IOrderProduct extends IOrderProductData, Document {}

const OrderProductSchema: Schema = new Schema({
  orderId: { type: Types.ObjectId, required: true, ref: 'Order' },
  productId: { type: String, required: true },
  units: { type: Number, required: true }
});

const OrderProduct = mongoose.model<IOrderProduct>('OrderProduct', OrderProductSchema, 'order_products');
export default OrderProduct; 