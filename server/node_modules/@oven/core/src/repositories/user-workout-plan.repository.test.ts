import { UserWorkoutPlanRepository } from './user-workout-plan.repository';
import { UserWorkoutPlan } from '../models';

describe('UserWorkoutPlanRepository', () => {
  let repository: UserWorkoutPlanRepository;
  const testUserId = 'user-123';
  const testPlanId = 'plan-456';
  const testUserData: Omit<UserWorkoutPlan, 'id'> = {
    userId: testUserId,
    workoutPlanId: testPlanId,
    startDate: new Date().toISOString(),
    currentDayIndex: 0,
    isActive: true,
    logHistory: [],
  };

  beforeEach(() => {
    repository = new UserWorkoutPlanRepository();
  });

  describe('create', () => {
    it('should create a new user workout plan', async () => {
      const plan = await repository.create(testUserData);
      expect(plan).toHaveProperty('id');
      expect(plan.userId).toBe(testUserId);
      expect(plan.workoutPlanId).toBe(testPlanId);
      expect(plan.isActive).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return a user workout plan by id', async () => {
      const createdPlan = await repository.create(testUserData);
      const foundPlan = await repository.findById(createdPlan.id);
      expect(foundPlan).toEqual(createdPlan);
    });

    it('should return null for non-existent id', async () => {
      const foundPlan = await repository.findById('non-existent-id');
      expect(foundPlan).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return all user workout plans for a user', async () => {
      // Create two plans for the same user
      const plan1 = await repository.create(testUserData);
      const plan2 = await repository.create({
        ...testUserData,
        workoutPlanId: 'plan-789',
      });

      const foundPlans = await repository.findByUserId(testUserId);
      expect(foundPlans).toHaveLength(2);
      expect(foundPlans).toContainEqual(plan1);
      expect(foundPlans).toContainEqual(plan2);
    });

    it('should return an empty array for non-existent user', async () => {
      const foundPlans = await repository.findByUserId('non-existent-user');
      expect(foundPlans).toEqual([]);
    });
  });

  describe('findActiveByUserId', () => {
    it('should return the active user workout plan for a user', async () => {
      // Create an active plan
      const activePlan = await repository.create(testUserData);
      // Create an inactive plan
      await repository.create({
        ...testUserData,
        workoutPlanId: 'plan-789',
        isActive: false,
      });

      const foundPlan = await repository.findActiveByUserId(testUserId);
      expect(foundPlan).toEqual(activePlan);
    });

    it('should return null if no active plan exists', async () => {
      // Create an inactive plan
      await repository.create({
        ...testUserData,
        isActive: false,
      });

      const foundPlan = await repository.findActiveByUserId(testUserId);
      expect(foundPlan).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing user workout plan', async () => {
      const createdPlan = await repository.create(testUserData);
      const updatedPlan = { ...createdPlan, currentDayIndex: 1 };
      const result = await repository.update(updatedPlan);
      expect(result).toEqual(updatedPlan);
    });

    it('should return null for non-existent user workout plan', async () => {
      const nonExistentPlan: UserWorkoutPlan = {
        id: 'non-existent-id',
        ...testUserData,
      };
      const result = await repository.update(nonExistentPlan);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an existing user workout plan', async () => {
      const createdPlan = await repository.create(testUserData);
      const result = await repository.delete(createdPlan.id);
      expect(result).toBe(true);
      const foundPlan = await repository.findById(createdPlan.id);
      expect(foundPlan).toBeNull();
    });

    it('should return false for non-existent user workout plan', async () => {
      const result = await repository.delete('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('deactivateAllUserPlans', () => {
    it('should deactivate all user workout plans for a user', async () => {
      // Create two active plans for the same user
      await repository.create(testUserData);
      await repository.create({
        ...testUserData,
        workoutPlanId: 'plan-789',
      });

      // Deactivate all plans
      await repository.deactivateAllUserPlans(testUserId);

      // Check if all plans are inactive
      const foundPlans = await repository.findByUserId(testUserId);
      expect(foundPlans).toHaveLength(2);
      foundPlans.forEach(plan => {
        expect(plan.isActive).toBe(false);
      });
    });
  });
});
