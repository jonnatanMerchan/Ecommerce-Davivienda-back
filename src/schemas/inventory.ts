import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IInventoryData {
  productId: Types.ObjectId;
  units: number;
  userId: Types.ObjectId;
  dateCreate: Date;
}

export interface IInventory extends IInventoryData, Document {}

const InventorySchema: Schema = new Schema({
  productId: { type: Types.ObjectId, required: true, ref: 'Product' },
  units: { type: Number, required: true, default: 0 },
  userId: { type: Types.ObjectId, required: true, ref: 'User' },
  dateCreate: { type: Date, default: Date.now }
});

const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema, 'inventory');
export default Inventory; 