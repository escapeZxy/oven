import { WorkoutPlanRepository } from './workout-plan.repository';
import { WorkoutPlan } from '../models';

describe('WorkoutPlanRepository', () => {
  let repository: WorkoutPlanRepository;

  beforeEach(() => {
    repository = new WorkoutPlanRepository();
  });

  describe('create', () => {
    it('should create a new workout plan with a unique id', async () => {
      const planData: Omit<WorkoutPlan, 'id'> = {
        name: 'Push Pull Legs',
        description: 'A classic PPL routine.',
        trainingDays: [],
      };

      const createdPlan = await repository.create(planData);

      expect(createdPlan).toBeDefined();
      expect(typeof createdPlan.id).toBe('string');
      expect(createdPlan.id).not.toBe('');
      expect(createdPlan.name).toBe(planData.name);
    });
  });

  describe('findById', () => {
    it('should return the plan with the given id', async () => {
      const planData: Omit<WorkoutPlan, 'id'> = {
        name: 'Push Pull Legs',
        description: 'A classic PPL routine.',
        trainingDays: [],
      };

      const createdPlan = await repository.create(planData);
      const foundPlan = await repository.findById(createdPlan.id);

      expect(foundPlan).toEqual(createdPlan);
    });

    it('should return null if no plan with the given id exists', async () => {
      const foundPlan = await repository.findById('non-existent-id');
      expect(foundPlan).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all created plans', async () => {
      const planData1: Omit<WorkoutPlan, 'id'> = {
        name: 'Push Pull Legs',
        description: 'A classic PPL routine.',
        trainingDays: [],
      };

      const planData2: Omit<WorkoutPlan, 'id'> = {
        name: '5x5 StrongLifts',
        description: 'A strength training program.',
        trainingDays: [],
      };

      const createdPlan1 = await repository.create(planData1);
      const createdPlan2 = await repository.create(planData2);

      const allPlans = await repository.findAll();

      expect(allPlans).toHaveLength(2);
      expect(allPlans).toContainEqual(createdPlan1);
      expect(allPlans).toContainEqual(createdPlan2);
    });

    it('should return an empty array if no plans exist', async () => {
      const allPlans = await repository.findAll();
      expect(allPlans).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update an existing plan', async () => {
      const planData: Omit<WorkoutPlan, 'id'> = {
        name: 'Push Pull Legs',
        description: 'A classic PPL routine.',
        trainingDays: [],
      };

      const createdPlan = await repository.create(planData);
      const updatedPlan = { ...createdPlan, name: 'Updated PPL' };

      const result = await repository.update(updatedPlan);

      expect(result).toEqual(updatedPlan);
      const foundPlan = await repository.findById(createdPlan.id);
      expect(foundPlan).toEqual(updatedPlan);
    });

    it('should return null if trying to update a non-existent plan', async () => {
      const nonExistentPlan: WorkoutPlan = {
        id: 'non-existent-id',
        name: 'Non-existent Plan',
        description: 'This plan does not exist',
        trainingDays: [],
      };

      const result = await repository.update(nonExistentPlan);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an existing plan', async () => {
      const planData: Omit<WorkoutPlan, 'id'> = {
        name: 'Push Pull Legs',
        description: 'A classic PPL routine.',
        trainingDays: [],
      };

      const createdPlan = await repository.create(planData);
      const result = await repository.delete(createdPlan.id);

      expect(result).toBe(true);
      const foundPlan = await repository.findById(createdPlan.id);
      expect(foundPlan).toBeNull();
    });

    it('should return false if trying to delete a non-existent plan', async () => {
      const result = await repository.delete('non-existent-id');
      expect(result).toBe(false);
    });
  });
});
