import { BodyMeasurement, BodyPhoto, WeightGoal } from '../models';
import { BodyRepository } from '../repositories/body.repository';

export class BodyService {
  constructor(private bodyRepository: BodyRepository) {}

  // Body Measurement Methods
  public async addMeasurement(measurementData: Omit<BodyMeasurement, 'id'>): Promise<BodyMeasurement> {
    return this.bodyRepository.createMeasurement(measurementData);
  }

  public async getMeasurement(id: string): Promise<BodyMeasurement | null> {
    return this.bodyRepository.findMeasurementById(id);
  }

  public async getAllMeasurementsByUserId(userId: string): Promise<BodyMeasurement[]> {
    return this.bodyRepository.findMeasurementsByUserId(userId);
  }

  public async updateMeasurement(measurement: BodyMeasurement): Promise<BodyMeasurement | null> {
    return this.bodyRepository.updateMeasurement(measurement);
  }

  public async deleteMeasurement(id: string): Promise<boolean> {
    return this.bodyRepository.deleteMeasurement(id);
  }

  // Body Photo Methods
  public async addBodyPhoto(photoData: Omit<BodyPhoto, 'id'>): Promise<BodyPhoto> {
    return this.bodyRepository.createPhoto(photoData);
  }

  public async getBodyPhoto(id: string): Promise<BodyPhoto | null> {
    return this.bodyRepository.findPhotoById(id);
  }

  public async getAllBodyPhotosByUserId(userId: string): Promise<BodyPhoto[]> {
    return this.bodyRepository.findPhotosByUserId(userId);
  }

  public async updateBodyPhoto(photo: BodyPhoto): Promise<BodyPhoto | null> {
    return this.bodyRepository.updatePhoto(photo);
  }

  public async deleteBodyPhoto(id: string): Promise<boolean> {
    return this.bodyRepository.deletePhoto(id);
  }

  // Weight Goal Methods
  public async setWeightGoal(goalData: Omit<WeightGoal, 'id'>): Promise<WeightGoal> {
    // Deactivate any existing active goals
    if (goalData.isActive) {
      await this.bodyRepository.deactivateAllWeightGoalsByUserId(goalData.userId);
    }
    
    return this.bodyRepository.createWeightGoal(goalData);
  }

  public async getWeightGoal(id: string): Promise<WeightGoal | null> {
    return this.bodyRepository.findWeightGoalById(id);
  }

  public async getAllWeightGoalsByUserId(userId: string): Promise<WeightGoal[]> {
    return this.bodyRepository.findWeightGoalsByUserId(userId);
  }

  public async getActiveWeightGoalByUserId(userId: string): Promise<WeightGoal | null> {
    return this.bodyRepository.findActiveWeightGoalByUserId(userId);
  }

  public async updateWeightGoal(goal: WeightGoal): Promise<WeightGoal | null> {
    // If updating to active, deactivate others
    if (goal.isActive) {
      await this.bodyRepository.deactivateAllWeightGoalsByUserId(goal.userId);
    }
    
    return this.bodyRepository.updateWeightGoal(goal);
  }

  public async deleteWeightGoal(id: string): Promise<boolean> {
    return this.bodyRepository.deleteWeightGoal(id);
  }

  public async calculateWeightProgress(userId: string): Promise<{ current: number; target: number; progress: number } | null> {
    const activeGoal = await this.getActiveWeightGoalByUserId(userId);
    if (!activeGoal) {
      return null;
    }

    const measurements = await this.getAllMeasurementsByUserId(userId);
    if (measurements.length === 0) {
      return null;
    }

    // Get the most recent weight measurement
    const latestMeasurement = measurements[0];
    const currentWeight = latestMeasurement.weight;
    const targetWeight = activeGoal.targetWeight;
    const startWeight = activeGoal.startWeight;

    // Calculate progress percentage
    const totalDiff = Math.abs(targetWeight - startWeight);
    const currentDiff = Math.abs(currentWeight - startWeight);
    const progress = totalDiff > 0 ? Math.round((1 - currentDiff / totalDiff) * 100) : 0;

    return {
      current: currentWeight,
      target: targetWeight,
      progress: Math.min(progress, 100), // Cap at 100%
    };
  }
}