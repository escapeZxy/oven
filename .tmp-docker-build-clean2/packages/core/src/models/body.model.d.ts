export interface BodyMeasurement {
    id: string;
    userId: string;
    date: string;
    weight: number;
    bodyFat?: number;
    muscleMass?: number;
    measurements?: {
        neck?: number;
        shoulders?: number;
        chest?: number;
        waist?: number;
        hips?: number;
        arms?: number;
        thighs?: number;
        calves?: number;
    };
    notes?: string;
}
export interface BodyPhoto {
    id: string;
    userId: string;
    date: string;
    imageUrl: string;
    bodyPart: 'front' | 'back' | 'side';
    notes?: string;
}
export interface WeightGoal {
    id: string;
    userId: string;
    targetWeight: number;
    targetDate: string;
    startWeight: number;
    createdAt: string;
    isActive: boolean;
}
