import { Request, Response } from 'express';
import { InventoryService } from '../services/inventoryService';

export const getInventoryByUserIdController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const inventory = await InventoryService.getInventoryByUserId(userId);
    if (!inventory) {
      res.status(404).json({ message: 'No inventory found for this user' });
      return;
    }
    res.status(200).json(inventory);
    return;
  } catch (error) {
    console.error('Error in getInventoryByUserIdController:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const updateInventoryUnitsController = async (req: Request, res: Response) => {
  const { productId, userId, newUnits } = req.body;

  if (!productId || !userId || typeof newUnits !== 'number') {
    res.status(400).json({ message: 'Missing required fields (productId, userId, newUnits) or newUnits is not a number' });
    return;
  }

  try {
    const updatedInventory = await InventoryService.updateInventoryUnits(productId, userId, newUnits);
    if (!updatedInventory) {
      res.status(404).json({ message: 'Inventory item not found or could not be updated' });
      return;
    }
    res.status(200).json(updatedInventory);
    return;
  } catch (error) {
    console.error('Error in updateInventoryUnitsController:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}; 