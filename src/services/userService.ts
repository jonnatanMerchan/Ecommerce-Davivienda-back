import User, { IUser } from '../schemas/user';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export class UserService {
  static async authenticate(email: string, password: string): Promise<{ userId: string; token: string; name: string; lastName: string } | null> {
    const user: IUser | null = await User.findOne({ email });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return { userId: user._id.toString(), token, name: user.name, lastName: user.lastName };
  }

  static async registerUser(
    name: string,
    lastName: string,
    phone: string,
    email: string,
    password: string
  ): Promise<{ userId: string; token: string; name: string; lastName: string } | null> {
    const existingUser = await User.findOne({ email });
    if (existingUser) return null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, lastName, phone, email, password: hashedPassword });
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    return { userId: newUser._id.toString(), token, name: newUser.name, lastName: newUser.lastName };
  }
}