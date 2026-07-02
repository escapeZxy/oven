import { v4 as uuidv4 } from 'uuid';
import { User } from '../models';

export class UserRepository {
  private users: User[] = [];

  public async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  public async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  public async findByUsername(username: string): Promise<User | null> {
    return this.users.find(user => user.username === username) || null;
  }

  public async update(user: User): Promise<User | null> {
    const existingIndex = this.users.findIndex(u => u.id === user.id);
    if (existingIndex === -1) {
      return null;
    }

    this.users = [
      ...this.users.slice(0, existingIndex),
      user,
      ...this.users.slice(existingIndex + 1)
    ];
    return user;
  }

  public async delete(id: string): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return this.users.length < initialLength;
  }
}
