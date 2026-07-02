"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyService = void 0;
class BodyService {
    constructor(bodyRepository) {
        this.bodyRepository = bodyRepository;
    }
    async addMeasurement(measurementData) {
        return this.bodyRepository.createMeasurement(measurementData);
    }
    async getMeasurement(id) {
        return this.bodyRepository.findMeasurementById(id);
    }
    async getAllMeasurementsByUserId(userId) {
        return this.bodyRepository.findMeasurementsByUserId(userId);
    }
    async updateMeasurement(measurement) {
        return this.bodyRepository.updateMeasurement(measurement);
    }
    async deleteMeasurement(id) {
        return this.bodyRepository.deleteMeasurement(id);
    }
    async addBodyPhoto(photoData) {
        return this.bodyRepository.createPhoto(photoData);
    }
    async getBodyPhoto(id) {
        return this.bodyRepository.findPhotoById(id);
    }
    async getAllBodyPhotosByUserId(userId) {
        return this.bodyRepository.findPhotosByUserId(userId);
    }
    async updateBodyPhoto(photo) {
        return this.bodyRepository.updatePhoto(photo);
    }
    async deleteBodyPhoto(id) {
        return this.bodyRepository.deletePhoto(id);
    }
    async setWeightGoal(goalData) {
        if (goalData.isActive) {
            await this.bodyRepository.deactivateAllWeightGoalsByUserId(goalData.userId);
        }
        return this.bodyRepository.createWeightGoal(goalData);
    }
    async getWeightGoal(id) {
        return this.bodyRepository.findWeightGoalById(id);
    }
    async getAllWeightGoalsByUserId(userId) {
        return this.bodyRepository.findWeightGoalsByUserId(userId);
    }
    async getActiveWeightGoalByUserId(userId) {
        return this.bodyRepository.findActiveWeightGoalByUserId(userId);
    }
    async updateWeightGoal(goal) {
        if (goal.isActive) {
            await this.bodyRepository.deactivateAllWeightGoalsByUserId(goal.userId);
        }
        return this.bodyRepository.updateWeightGoal(goal);
    }
    async deleteWeightGoal(id) {
        return this.bodyRepository.deleteWeightGoal(id);
    }
    async calculateWeightProgress(userId) {
        const activeGoal = await this.getActiveWeightGoalByUserId(userId);
        if (!activeGoal) {
            return null;
        }
        const measurements = await this.getAllMeasurementsByUserId(userId);
        if (measurements.length === 0) {
            return null;
        }
        const latestMeasurement = measurements[0];
        const currentWeight = latestMeasurement.weight;
        const targetWeight = activeGoal.targetWeight;
        const startWeight = activeGoal.startWeight;
        const totalDiff = Math.abs(targetWeight - startWeight);
        const currentDiff = Math.abs(currentWeight - startWeight);
        const progress = totalDiff > 0 ? Math.round((1 - currentDiff / totalDiff) * 100) : 0;
        return {
            current: currentWeight,
            target: targetWeight,
            progress: Math.min(progress, 100),
        };
    }
}
exports.BodyService = BodyService;
//# sourceMappingURL=body.service.js.map