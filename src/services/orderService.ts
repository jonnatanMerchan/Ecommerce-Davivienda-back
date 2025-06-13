import Order, { IOrder, IOrderData } from '../schemas/order';
import OrderProduct, { IOrderProduct, IOrderProductData } from '../schemas/orderProduct';
import Product, { IProduct } from '../schemas/product';
import User, { IUser } from '../schemas/user';

export class OrderService {
  static async createOrder(
    userId: string,
    numProducts: number,
    paymentMethod: string,
    totalPrice: number,
    products: Array<{ productId: string; quantity: number }>,
    status: string
  ): Promise<IOrder | null> {
    try {
      const newOrder: IOrder = await Order.create({
        userId,
        numProducts,
        paymentMethod,
        totalPrice,
        creationDate: new Date(),
        status
      });

      for (const product of products) {
        await OrderProduct.create({
          orderId: newOrder._id,
          productId: product.productId,
          units: product.quantity
        });
      }

      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  static async getOrdersByUserId(userId: string): Promise<IOrder[] | null> {
    try {
      const orders = await Order.find({ userId }).lean();
      return orders;
    } catch (error) {
      console.error('Error fetching orders by user ID:', error);
      return null;
    }
  }

  static async getOrderDetailsById(orderId: string): Promise<(IOrderData & { userDetails: IUser; orderProducts: (IOrderProductData & { productDetails: IProduct })[] }) | null> {
    try {
      const order = await Order.findById(orderId).lean();
      if (!order) return null;

      const userDetails = await User.findById(order.userId).lean();
      if (!userDetails) return null;

      const orderProducts = await OrderProduct.find({ orderId }).lean();

      const productIds = orderProducts.map(op => op.productId);

      const products = await Product.find({ _id: { $in: productIds } }).lean();

      const productMap = new Map<string, IProduct>();
      products.forEach(p => productMap.set(p._id.toString(), p));

      const populatedOrderProducts = orderProducts.map(op => ({
        ...op,
        productDetails: productMap.get(op.productId.toString()) as IProduct
      }));

      return { ...order, userDetails, orderProducts: populatedOrderProducts };

    } catch (error) {
      console.error('Error fetching order details by ID:', error);
      return null;
    }
  }

  static async updateOrderStatus(orderId: string, newStatus: string): Promise<IOrder | null> {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: newStatus },
        { new: true }
      );
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      return null;
    }
  }
} 