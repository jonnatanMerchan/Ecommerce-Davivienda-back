import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

export const createOrderController = async (req: Request, res: Response) => {
  const { userId, numProducts, paymentMethod, totalPrice, orderProducts, status } = req.body;

  if (!userId || !numProducts || !paymentMethod || !totalPrice || !orderProducts || !Array.isArray(orderProducts) || orderProducts.length === 0) {
    res.status(400).json({ message: 'Missing required fields or orderProducts is not a valid array' });
    return;
  }

  const productsToSend = orderProducts.map((item: any) => ({ productId: item.productId, quantity: item.quantity }));

  try {
    const newOrder = await OrderService.createOrder(userId, numProducts, paymentMethod, totalPrice, productsToSend, status);
    if (!newOrder) {
      res.status(500).json({ message: 'Error creating order' });
      return;
    }
    res.status(201).json(newOrder);
    return;
  } catch (error) {
    console.error('Error in createOrderController:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const getOrdersByUserIdController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const orders = await OrderService.getOrdersByUserId(userId);
    if (!orders) {
      res.status(404).json({ message: 'No orders found for this user' });
      return;
    }
    res.status(200).json(orders);
    return;
  } catch (error) {
    console.error('Error in getOrdersByUserIdController:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const getOrderDetailsByIdController = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const orderDetails = await OrderService.getOrderDetailsById(orderId);
    if (!orderDetails) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.status(200).json(orderDetails);
    return;
  } catch (error) {
    console.error('Error in getOrderDetailsByIdController:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const updateOrderStatusController = async (req: Request, res: Response) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    res.status(400).json({ message: 'Order ID and status are required' });
    return;
  }

  try {
    const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      res.status(404).json({ message: 'Order not found or could not be updated' });
      return;
    }
    res.status(200).json(updatedOrder);
    return;
  } catch (error) {
    console.error('Error in updateOrderStatusController:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}; 