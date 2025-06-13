import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderData {
  userId: Types.ObjectId;
  numProducts: number;
  creationDate: Date;
  paymentMethod: string;
  totalPrice: number;
  status: string;
}

export interface IOrder extends IOrderData, Document {}

const OrderSchema: Schema = new Schema({
  userId: { type: Types.ObjectId, required: true, ref: 'User' },
  numProducts: { type: Number, required: true },
  creationDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, required: true, default: 'pending' }
});

const Order = mongoose.model<IOrder>('Order', OrderSchema, 'orders');
export default Order; 