import { User } from '../models';
export declare class UserRepository {
    private users;
    create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    update(user: User): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=user.repository.d.ts.map