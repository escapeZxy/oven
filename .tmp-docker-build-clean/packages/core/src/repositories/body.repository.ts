import { v4 as uuidv4 } from 'uuid';
import { BodyMeasurement, BodyPhoto, WeightGoal } from '../models';

export class BodyRepository {
  private measurements: BodyMeasurement[] = [];
  private photos: BodyPhoto[] = [];
  private weightGoals: WeightGoal[] = [];

  // Body Measurement CRUD
  public async createMeasurement(measurementData: Omit<BodyMeasurement, 'id'>): Promise<BodyMeasurement> {
    const newMeasurement: BodyMeasurement = {
      id: uuidv4(),
      ...measurementData,
    };
    this.measurements.push(newMeasurement);
    return newMeasurement;
  }

  public async findMeasurementById(id: string): Promise<BodyMeasurement | null> {
    return this.measurements.find(measurement => measurement.id === id) || null;
  }

  public async findMeasurementsByUserId(userId: string): Promise<BodyMeasurement[]> {
    return this.measurements
      .filter(measurement => measurement.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async updateMeasurement(measurement: BodyMeasurement): Promise<BodyMeasurement | null> {
    const existingIndex = this.measurements.findIndex(m => m.id === measurement.id);
    if (existingIndex === -1) {
      return null;
    }

    this.measurements = [
      ...this.measurements.slice(0, existingIndex),
      measurement,
      ...this.measurements.slice(existingIndex + 1)
    ];
    return measurement;
  }

  public async deleteMeasurement(id: string): Promise<boolean> {
    const initialLength = this.measurements.length;
    this.measurements = this.measurements.filter(measurement => measurement.id !== id);
    return this.measurements.length < initialLength;
  }

  // Body Photo CRUD
  public async createPhoto(photoData: Omit<BodyPhoto, 'id'>): Promise<BodyPhoto> {
    const newPhoto: BodyPhoto = {
      id: uuidv4(),
      ...photoData,
    };
    this.photos.push(newPhoto);
    return newPhoto;
  }

  public async findPhotoById(id: string): Promise<BodyPhoto | null> {
    return this.photos.find(photo => photo.id === id) || null;
  }

  public async findPhotosByUserId(userId: string): Promise<BodyPhoto[]> {
    return this.photos
      .filter(photo => photo.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async updatePhoto(photo: BodyPhoto): Promise<BodyPhoto | null> {
    const existingIndex = this.photos.findIndex(p => p.id === photo.id);
    if (existingIndex === -1) {
      return null;
    }

    this.photos = [
      ...this.photos.slice(0, existingIndex),
      photo,
      ...this.photos.slice(existingIndex + 1)
    ];
    return photo;
  }

  public async deletePhoto(id: string): Promise<boolean> {
    const initialLength = this.photos.length;
    this.photos = this.photos.filter(photo => photo.id !== id);
    return this.photos.length < initialLength;
  }

  // Weight Goal CRUD
  public async createWeightGoal(goalData: Omit<WeightGoal, 'id'>): Promise<WeightGoal> {
    const newGoal: WeightGoal = {
      id: uuidv4(),
      ...goalData,
    };
    this.weightGoals.push(newGoal);
    return newGoal;
  }

  public async findWeightGoalById(id: string): Promise<WeightGoal | null> {
    return this.weightGoals.find(goal => goal.id === id) || null;
  }

  public async findWeightGoalsByUserId(userId: string): Promise<WeightGoal[]> {
    return this.weightGoals
      .filter(goal => goal.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async findActiveWeightGoalByUserId(userId: string): Promise<WeightGoal | null> {
    return this.weightGoals.find(goal => goal.userId === userId && goal.isActive) || null;
  }

  public async updateWeightGoal(goal: WeightGoal): Promise<WeightGoal | null> {
    const existingIndex = this.weightGoals.findIndex(g => g.id === goal.id);
    if (existingIndex === -1) {
      return null;
    }

    this.weightGoals = [
      ...this.weightGoals.slice(0, existingIndex),
      goal,
      ...this.weightGoals.slice(existingIndex + 1)
    ];
    return goal;
  }

  public async deactivateAllWeightGoalsByUserId(userId: string): Promise<void> {
    this.weightGoals = this.weightGoals.map(goal =>
      goal.userId === userId ? { ...goal, isActive: false } : goal
    );
  }

  public async deleteWeightGoal(id: string): Promise<boolean> {
    const initialLength = this.weightGoals.length;
    this.weightGoals = this.weightGoals.filter(goal => goal.id !== id);
    return this.weightGoals.length < initialLength;
  }
}