import Product, { IProduct, IProductData } from '../schemas/product';
import Inventory from '../schemas/inventory';

export class ProductService {
  static async createProduct(
    name: string,
    description: string,
    sku: string,
    barcode: string,
    price: number,
    userId: string
  ): Promise<IProduct | null> {
    try {
      const newProduct: IProduct = await Product.create({
        name,
        description,
        sku,
        barcode,
        price,
        userId,
        dateCreate: new Date()
      });

      await Inventory.create({
        productId: newProduct._id,
        units: 0,
        userId,
        dateCreate: new Date()
      });

      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  }

  static async getProductsByUserId(userId: string): Promise<(IProductData & { units: number | null })[] | null> {
    try {
      const products = await Product.find({ userId }).lean();
      if (!products || products.length === 0) {
        return [];
      }

      const productIds = products.map(p => p._id);
      const inventoryItems = await Inventory.find({ userId, productId: { $in: productIds } }).lean();

      const inventoryMap = new Map<string, number>();
      inventoryItems.forEach(item => inventoryMap.set(item.productId.toString(), item.units));

      const populatedProducts = products.map(product => ({
        ...product,
        units: inventoryMap.get(product._id.toString()) || 0
      }));
      
      return populatedProducts;

    } catch (error) {
      console.error('Error fetching products by user ID:', error);
      return null;
    }
  }
} 