/**
 * Represents a single body measurement entry.
 */
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
/**
 * Represents a body photo entry for visual progress tracking.
 */
export interface BodyPhoto {
    id: string;
    userId: string;
    date: string;
    imageUrl: string;
    bodyPart: 'front' | 'back' | 'side';
    notes?: string;
}
/**
 * Represents a weight goal set by the user.
 */
export interface WeightGoal {
    id: string;
    userId: string;
    targetWeight: number;
    targetDate: string;
    startWeight: number;
    createdAt: string;
    isActive: boolean;
}
//# sourceMappingURL=body.model.d.ts.map