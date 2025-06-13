import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const result = await UserService.authenticate(email, password);
  if (!result) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  res.json(result);
  return;
};

export const registerController = async (req: Request, res: Response): Promise<void> => {
  const { name, lastName, phone, email, password } = req.body;
  const result = await UserService.registerUser(name, lastName, phone, email, password);
  if (!result) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }
  res.json(result);
  return;
}; 