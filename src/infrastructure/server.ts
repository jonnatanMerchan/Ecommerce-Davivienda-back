import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from '../services/db';
import { loginController, registerController } from '../api/apiController';
import { createOrderController, getOrdersByUserIdController, getOrderDetailsByIdController, updateOrderStatusController } from '../api/orderController';
import { createProductController, getProductsByUserIdController } from '../api/productController';
import { getInventoryByUserIdController, updateInventoryUnitsController } from '../api/inventoryController';

const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.post('/api/auth/login', loginController);
app.post('/api/auth/register', registerController);
app.post('/api/orders/create', createOrderController);
app.get('/api/orders/user/:userId', getOrdersByUserIdController);
app.get('/api/orders/:orderId', getOrderDetailsByIdController);
app.post('/api/orders/updatedOrder', updateOrderStatusController);

app.post('/api/products/create', createProductController);
app.get('/api/products/user/:userId', getProductsByUserIdController);
app.get('/api/inventory/user/:userId', getInventoryByUserIdController);
app.post('/api/inventory/updateUnits', updateInventoryUnitsController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

