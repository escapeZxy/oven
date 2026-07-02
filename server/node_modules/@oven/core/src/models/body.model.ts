/**
 * Represents a single body measurement entry.
 */
export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string; // ISO 8601 format
  weight: number; // in kg or lbs depending on user settings
  bodyFat?: number; // in percentage
  muscleMass?: number; // in kg or lbs depending on user settings
  measurements?: {
    neck?: number; // in cm or inches
    shoulders?: number; // in cm or inches
    chest?: number; // in cm or inches
    waist?: number; // in cm or inches
    hips?: number; // in cm or inches
    arms?: number; // in cm or inches (left/right average)
    thighs?: number; // in cm or inches (left/right average)
    calves?: number; // in cm or inches (left/right average)
  };
  notes?: string;
}

/**
 * Represents a body photo entry for visual progress tracking.
 */
export interface BodyPhoto {
  id: string;
  userId: string;
  date: string; // ISO 8601 format
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
  targetWeight: number; // in kg or lbs depending on user settings
  targetDate: string; // ISO 8601 format
  startWeight: number; // in kg or lbs depending on user settings
  createdAt: string; // ISO 8601 format
  isActive: boolean;
}
