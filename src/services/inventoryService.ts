import Inventory, { IInventory, IInventoryData } from '../schemas/inventory';
import Product, { IProduct } from '../schemas/product';

export class InventoryService {
  static async getInventoryByUserId(userId: string): Promise<(IInventoryData & { productDetails: IProduct })[] | null> {
    try {
      const inventoryItems = await Inventory.find({ userId }).lean();
      
      if (!inventoryItems || inventoryItems.length === 0) {
        return [];
      }

      const productIds = inventoryItems.map(item => item.productId);
      const products = await Product.find({ _id: { $in: productIds } }).lean();

      const productMap = new Map<string, IProduct>();
      products.forEach(p => productMap.set(p._id.toString(), p));

      const populatedInventory = inventoryItems.map(item => ({
        ...item,
        productDetails: productMap.get(item.productId.toString()) as IProduct
      }));

      return populatedInventory;

    } catch (error) {
      console.error('Error fetching inventory by user ID:', error);
      return null;
    }
  }

  static async updateInventoryUnits(productId: string, userId: string, newUnits: number): Promise<IInventory | null> {
    try {
      const inventoryItem = await Inventory.findOneAndUpdate(
        { productId, userId },
        { $set: { units: newUnits } },
        { new: true }
      );
      return inventoryItem;
    } catch (error) {
      console.error('Error updating inventory units:', error);
      return null;
    }
  }
} 