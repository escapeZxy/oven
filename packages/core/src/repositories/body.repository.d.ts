import { BodyMeasurement, BodyPhoto, WeightGoal } from '../models';
export declare class BodyRepository {
    private measurements;
    private photos;
    private weightGoals;
    createMeasurement(measurementData: Omit<BodyMeasurement, 'id'>): Promise<BodyMeasurement>;
    findMeasurementById(id: string): Promise<BodyMeasurement | null>;
    findMeasurementsByUserId(userId: string): Promise<BodyMeasurement[]>;
    updateMeasurement(measurement: BodyMeasurement): Promise<BodyMeasurement | null>;
    deleteMeasurement(id: string): Promise<boolean>;
    createPhoto(photoData: Omit<BodyPhoto, 'id'>): Promise<BodyPhoto>;
    findPhotoById(id: string): Promise<BodyPhoto | null>;
    findPhotosByUserId(userId: string): Promise<BodyPhoto[]>;
    updatePhoto(photo: BodyPhoto): Promise<BodyPhoto | null>;
    deletePhoto(id: string): Promise<boolean>;
    createWeightGoal(goalData: Omit<WeightGoal, 'id'>): Promise<WeightGoal>;
    findWeightGoalById(id: string): Promise<WeightGoal | null>;
    findWeightGoalsByUserId(userId: string): Promise<WeightGoal[]>;
    findActiveWeightGoalByUserId(userId: string): Promise<WeightGoal | null>;
    updateWeightGoal(goal: WeightGoal): Promise<WeightGoal | null>;
    deactivateAllWeightGoalsByUserId(userId: string): Promise<void>;
    deleteWeightGoal(id: string): Promise<boolean>;
}
