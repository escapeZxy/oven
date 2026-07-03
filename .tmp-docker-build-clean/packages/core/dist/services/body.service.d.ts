import { BodyMeasurement, BodyPhoto, WeightGoal } from '../models';
import { BodyRepository } from '../repositories/body.repository';
export declare class BodyService {
    private bodyRepository;
    constructor(bodyRepository: BodyRepository);
    addMeasurement(measurementData: Omit<BodyMeasurement, 'id'>): Promise<BodyMeasurement>;
    getMeasurement(id: string): Promise<BodyMeasurement | null>;
    getAllMeasurementsByUserId(userId: string): Promise<BodyMeasurement[]>;
    updateMeasurement(measurement: BodyMeasurement): Promise<BodyMeasurement | null>;
    deleteMeasurement(id: string): Promise<boolean>;
    addBodyPhoto(photoData: Omit<BodyPhoto, 'id'>): Promise<BodyPhoto>;
    getBodyPhoto(id: string): Promise<BodyPhoto | null>;
    getAllBodyPhotosByUserId(userId: string): Promise<BodyPhoto[]>;
    updateBodyPhoto(photo: BodyPhoto): Promise<BodyPhoto | null>;
    deleteBodyPhoto(id: string): Promise<boolean>;
    setWeightGoal(goalData: Omit<WeightGoal, 'id'>): Promise<WeightGoal>;
    getWeightGoal(id: string): Promise<WeightGoal | null>;
    getAllWeightGoalsByUserId(userId: string): Promise<WeightGoal[]>;
    getActiveWeightGoalByUserId(userId: string): Promise<WeightGoal | null>;
    updateWeightGoal(goal: WeightGoal): Promise<WeightGoal | null>;
    deleteWeightGoal(id: string): Promise<boolean>;
    calculateWeightProgress(userId: string): Promise<{
        current: number;
        target: number;
        progress: number;
    } | null>;
}
//# sourceMappingURL=body.service.d.ts.map