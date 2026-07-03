import { WorkoutService } from './workout.service';
import { UserWorkoutPlan, WorkoutPlan, CompletedExerciseLog } from '../models';
import { UserWorkoutPlanRepository } from '../repositories/user-workout-plan.repository';
import { WorkoutPlanRepository } from '../repositories/workout-plan.repository';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let userWorkoutPlanRepository: UserWorkoutPlanRepository;
  let workoutPlanRepository: WorkoutPlanRepository;

  beforeEach(() => {
    userWorkoutPlanRepository = new UserWorkoutPlanRepository();
    workoutPlanRepository = new WorkoutPlanRepository();
    service = new WorkoutService(userWorkoutPlanRepository, workoutPlanRepository);
  });

  describe('startPlan', () => {
    it('should create an active UserWorkoutPlan for the user', async () => {
      const userId = 'user-1';
      const mockPlan: Omit<WorkoutPlan, 'id'> = {
        name: 'Test Plan',
        description: 'A plan for testing',
        trainingDays: [{ id: 'day-1', name: 'Day 1', type: 'training', exercises: [] }],
      };

      // Create the plan in the repository first
      const createdPlan = await workoutPlanRepository.create(mockPlan);

      const newUserPlan = await service.startPlan(userId, createdPlan.id);

      expect(newUserPlan).toBeDefined();
      expect(typeof newUserPlan.id).toBe('string');
      expect(newUserPlan.id).not.toBe('');
      expect(newUserPlan.userId).toBe(userId);
      expect(newUserPlan.workoutPlanId).toBe(createdPlan.id);
      expect(newUserPlan.isActive).toBe(true);
      expect(newUserPlan.currentDayIndex).toBe(0);
      expect(newUserPlan.logHistory).toEqual([]);
      expect(new Date(newUserPlan.startDate).getDate()).toBe(new Date().getDate());
    });

    it('should throw an error if workout plan not found', async () => {
      const userId = 'user-1';
      const nonExistentPlanId = 'non-existent-plan-id';

      await expect(service.startPlan(userId, nonExistentPlanId)).rejects.toThrow('Workout plan not found');
    });

    it('should deactivate previous active plans when starting a new one', async () => {
      const userId = 'user-1';

      // Create two workout plans
      const mockPlan1: Omit<WorkoutPlan, 'id'> = {
        name: 'Test Plan 1',
        description: 'First plan for testing',
        trainingDays: [{ id: 'day-1', name: 'Day 1', type: 'training', exercises: [] }],
      };

      const mockPlan2: Omit<WorkoutPlan, 'id'> = {
        name: 'Test Plan 2',
        description: 'Second plan for testing',
        trainingDays: [{ id: 'day-1', name: 'Day 1', type: 'training', exercises: [] }],
      };

      // Create plans in the repository
      const createdPlan1 = await workoutPlanRepository.create(mockPlan1);
      const createdPlan2 = await workoutPlanRepository.create(mockPlan2);

      // Start first plan
      const firstPlan = await service.startPlan(userId, createdPlan1.id);
      expect(firstPlan.isActive).toBe(true);

      // Start second plan
      const secondPlan = await service.startPlan(userId, createdPlan2.id);
      expect(secondPlan.isActive).toBe(true);

      // Check that first plan is now inactive
      const updatedFirstPlan = await userWorkoutPlanRepository.findById(firstPlan.id);
      expect(updatedFirstPlan?.isActive).toBe(false);
    });
  });

  describe('logWorkout', () => {
    it('should add a new workout log and increment the day index', async () => {
      // Create a workout plan
      const mockPlan: Omit<WorkoutPlan, 'id'> = {
        name: 'Test Plan',
        description: 'A plan for testing',
        trainingDays: [
          { id: 'day-1', name: 'Day 1', type: 'training', exercises: [] },
          { id: 'day-2', name: 'Day 2', type: 'training', exercises: [] },
        ],
      };

      const createdPlan = await workoutPlanRepository.create(mockPlan);

      // Create a user workout plan
      const userId = 'user-1';
      const userPlan = await service.startPlan(userId, createdPlan.id);

      const completedExercises: CompletedExerciseLog[] = [
        {
          exerciseId: 'ex-1',
          sets: 3,
          reps: [10, 10, 10],
          weight: [50, 50, 50],
        },
      ];

      const updatedPlan = await service.logWorkout(userPlan.id, completedExercises);

      expect(updatedPlan.logHistory.length).toBe(1);
      expect(updatedPlan.currentDayIndex).toBe(1);
      expect(updatedPlan.logHistory[0].status).toBe('completed');
      expect(updatedPlan.logHistory[0].trainingDayId).toBe('day-1');
      expect(updatedPlan.logHistory[0].completedExercises).toEqual(completedExercises);
    });

    it('should mark the plan as inactive when the last day is completed', async () => {
      // Create a workout plan with one day
      const mockPlan: Omit<WorkoutPlan, 'id'> = {
        name: 'Test Plan',
        description: 'A plan for testing',
        trainingDays: [{ id: 'day-1', name: 'Day 1', type: 'training', exercises: [] }],
      };

      const createdPlan = await workoutPlanRepository.create(mockPlan);

      // Create a user workout plan
      const userId = 'user-1';
      const userPlan = await service.startPlan(userId, createdPlan.id);

      const updatedPlan = await service.logWorkout(userPlan.id, []);

      expect(updatedPlan.isActive).toBe(false);
      expect(updatedPlan.currentDayIndex).toBe(1); // Index still increments
    });

    it('should throw an error if user workout plan not found', async () => {
      const nonExistentPlanId = 'non-existent-plan-id';
      const completedExercises: CompletedExerciseLog[] = [];

      await expect(service.logWorkout(nonExistentPlanId, completedExercises)).rejects.toThrow('User workout plan not found');
    });

    it('should throw an error if workout plan not found', async () => {
      // Create a user workout plan with a non-existent workout plan ID
      const userId = 'user-1';
      const nonExistentWorkoutPlanId = 'non-existent-workout-plan-id';

      const userPlan: Omit<UserWorkoutPlan, 'id'> = {
        userId,
        workoutPlanId: nonExistentWorkoutPlanId,
        startDate: new Date().toISOString(),
        currentDayIndex: 0,
        isActive: true,
        logHistory: [],
      };

      const createdUserPlan = await userWorkoutPlanRepository.create(userPlan);

      await expect(service.logWorkout(createdUserPlan.id, [])).rejects.toThrow('Workout plan not found');
    });
  });

  describe('skipDay', () => {
    it('should add a `skipped` log and increment the day index', async () => {
      // Create a workout plan
      const mockPlan: Omit<WorkoutPlan, 'id'> = {
        name: 'Test Plan',
        description: 'A plan for testing',
        trainingDays: [
          { id: 'day-1', name: 'Day 1', type: 'training', exercises: [] },
          { id: 'day-2', name: 'Day 2', type: 'rest', exercises: [] },
        ],
      };

      const createdPlan = await workoutPlanRepository.create(mockPlan);

      // Create a user workout plan
      const userId = 'user-1';
      const userPlan = await service.startPlan(userId, createdPlan.id);

      const updatedPlan = await service.skipDay(userPlan.id);

      expect(updatedPlan.logHistory.length).toBe(1);
      expect(updatedPlan.currentDayIndex).toBe(1);
      expect(updatedPlan.logHistory[0].status).toBe('skipped');
      expect(updatedPlan.logHistory[0].trainingDayId).toBe('day-1');
      expect(updatedPlan.logHistory[0].completedExercises).toEqual([]);
      expect(updatedPlan.isActive).toBe(true);
    });

    it('should mark the plan as inactive when the last day is skipped', async () => {
      // Create a workout plan with one day
      const mockPlan: Omit<WorkoutPlan, 'id'> = {
        name: 'Test Plan',
        description: 'A plan for testing',
        trainingDays: [{ id: 'day-1', name: 'Day 1', type: 'training', exercises: [] }],
      };

      const createdPlan = await workoutPlanRepository.create(mockPlan);

      // Create a user workout plan
      const userId = 'user-1';
      const userPlan = await service.startPlan(userId, createdPlan.id);

      const updatedPlan = await service.skipDay(userPlan.id);

      expect(updatedPlan.isActive).toBe(false);
    });

    it('should throw an error if user workout plan not found', async () => {
      const nonExistentPlanId = 'non-existent-plan-id';

      await expect(service.skipDay(nonExistentPlanId)).rejects.toThrow('User workout plan not found');
    });

    it('should throw an error if workout plan not found', async () => {
      // Create a user workout plan with a non-existent workout plan ID
      const userId = 'user-1';
      const nonExistentWorkoutPlanId = 'non-existent-workout-plan-id';

      const userPlan: Omit<UserWorkoutPlan, 'id'> = {
        userId,
        workoutPlanId: nonExistentWorkoutPlanId,
        startDate: new Date().toISOString(),
        currentDayIndex: 0,
        isActive: true,
        logHistory: [],
      };

      const createdUserPlan = await userWorkoutPlanRepository.create(userPlan);

      await expect(service.skipDay(createdUserPlan.id)).rejects.toThrow('Workout plan not found');
    });
  });

  describe('getActivePlan', () => {
    it('should return the active UserWorkoutPlan for the user', async () => {
      const userId = 'user-1';
      const mockPlan: Omit<WorkoutPlan, 'id'> = {
        name: 'Test Plan',
        description: 'A plan for testing',
        trainingDays: [{ id: 'day-1', name: 'Day 1', type: 'training', exercises: [] }],
      };

      // Create the plan in the repository first
      const createdPlan = await workoutPlanRepository.create(mockPlan);

      const userPlan = await service.startPlan(userId, createdPlan.id);
      const activePlan = await service.getActivePlan(userId);

      expect(activePlan).toEqual(userPlan);
    });

    it('should return null if no active plan exists', async () => {
      const userId = 'user-1';
      const activePlan = await service.getActivePlan(userId);

      expect(activePlan).toBeNull();
    });
  });

  describe('getAllPlans', () => {
    it('should return all UserWorkoutPlans for the user', async () => {
      const userId = 'user-1';

      // Create two workout plans
      const mockPlan1: Omit<WorkoutPlan, 'id'> = {
        name: 'Test Plan 1',
        description: 'First plan for testing',
        trainingDays: [{ id: 'day-1', name: 'Day 1', type: 'training', exercises: [] }],
      };

      const mockPlan2: Omit<WorkoutPlan, 'id'> = {
        name: 'Test Plan 2',
        description: 'Second plan for testing',
        trainingDays: [{ id: 'day-1', name: 'Day 1', type: 'training', exercises: [] }],
      };

      // Create plans in the repository
      const createdPlan1 = await workoutPlanRepository.create(mockPlan1);
      const createdPlan2 = await workoutPlanRepository.create(mockPlan2);

      // Start both plans
      const userPlan1 = await service.startPlan(userId, createdPlan1.id);
      const userPlan2 = await service.startPlan(userId, createdPlan2.id);

      const allPlans = await service.getAllPlans(userId);

      expect(allPlans).toHaveLength(2);
      // Check that both plans exist with the correct properties
      expect(allPlans.some(p => p.id === userPlan1.id && p.workoutPlanId === createdPlan1.id)).toBe(true);
      expect(allPlans.some(p => p.id === userPlan2.id && p.workoutPlanId === createdPlan2.id)).toBe(true);
      // Verify that only the second plan is active
      expect(allPlans.filter(p => p.isActive)).toHaveLength(1);
      expect(allPlans.find(p => p.isActive)?.id).toBe(userPlan2.id);
    });

    it('should return an empty array if no plans exist', async () => {
      const userId = 'user-1';
      const allPlans = await service.getAllPlans(userId);

      expect(allPlans).toEqual([]);
    });
  });
});
