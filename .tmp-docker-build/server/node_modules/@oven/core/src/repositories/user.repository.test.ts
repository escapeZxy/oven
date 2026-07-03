import { UserRepository } from './user.repository';
import { User } from '../models';

describe('UserRepository', () => {
  let repository: UserRepository;
  const testUser: Omit<User, 'id' | 'createdAt'> = {
    email: 'test@example.com',
    username: 'testuser',
    displayName: 'Test User',
  };

  beforeEach(() => {
    repository = new UserRepository();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user = await repository.create(testUser);
      expect(user).toHaveProperty('id');
      expect(user.email).toBe(testUser.email);
      expect(user.username).toBe(testUser.username);
      expect(user.displayName).toBe(testUser.displayName);
      expect(user).toHaveProperty('createdAt');
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const createdUser = await repository.create(testUser);
      const foundUser = await repository.findById(createdUser.id);
      expect(foundUser).toEqual(createdUser);
    });

    it('should return null for non-existent id', async () => {
      const foundUser = await repository.findById('non-existent-id');
      expect(foundUser).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const createdUser = await repository.create(testUser);
      const foundUser = await repository.findByEmail(testUser.email);
      expect(foundUser).toEqual(createdUser);
    });

    it('should return null for non-existent email', async () => {
      const foundUser = await repository.findByEmail('non-existent@example.com');
      expect(foundUser).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const createdUser = await repository.create(testUser);
      const foundUser = await repository.findByUsername(testUser.username);
      expect(foundUser).toEqual(createdUser);
    });

    it('should return null for non-existent username', async () => {
      const foundUser = await repository.findByUsername('non-existent-username');
      expect(foundUser).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const createdUser = await repository.create(testUser);
      const updatedUser = { ...createdUser, displayName: 'Updated Test User' };
      const result = await repository.update(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should return null for non-existent user', async () => {
      const nonExistentUser: User = {
        id: 'non-existent-id',
        ...testUser,
        createdAt: new Date().toISOString(),
      };
      const result = await repository.update(nonExistentUser);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an existing user', async () => {
      const createdUser = await repository.create(testUser);
      const result = await repository.delete(createdUser.id);
      expect(result).toBe(true);
      const foundUser = await repository.findById(createdUser.id);
      expect(foundUser).toBeNull();
    });

    it('should return false for non-existent user', async () => {
      const result = await repository.delete('non-existent-id');
      expect(result).toBe(false);
    });
  });
});
