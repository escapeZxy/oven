"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyRepository = void 0;
const uuid_1 = require("uuid");
class BodyRepository {
    constructor() {
        this.measurements = [];
        this.photos = [];
        this.weightGoals = [];
    }
    async createMeasurement(measurementData) {
        const newMeasurement = Object.assign({ id: (0, uuid_1.v4)() }, measurementData);
        this.measurements.push(newMeasurement);
        return newMeasurement;
    }
    async findMeasurementById(id) {
        return this.measurements.find(measurement => measurement.id === id) || null;
    }
    async findMeasurementsByUserId(userId) {
        return this.measurements
            .filter(measurement => measurement.userId === userId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    async updateMeasurement(measurement) {
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
    async deleteMeasurement(id) {
        const initialLength = this.measurements.length;
        this.measurements = this.measurements.filter(measurement => measurement.id !== id);
        return this.measurements.length < initialLength;
    }
    async createPhoto(photoData) {
        const newPhoto = Object.assign({ id: (0, uuid_1.v4)() }, photoData);
        this.photos.push(newPhoto);
        return newPhoto;
    }
    async findPhotoById(id) {
        return this.photos.find(photo => photo.id === id) || null;
    }
    async findPhotosByUserId(userId) {
        return this.photos
            .filter(photo => photo.userId === userId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    async updatePhoto(photo) {
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
    async deletePhoto(id) {
        const initialLength = this.photos.length;
        this.photos = this.photos.filter(photo => photo.id !== id);
        return this.photos.length < initialLength;
    }
    async createWeightGoal(goalData) {
        const newGoal = Object.assign({ id: (0, uuid_1.v4)() }, goalData);
        this.weightGoals.push(newGoal);
        return newGoal;
    }
    async findWeightGoalById(id) {
        return this.weightGoals.find(goal => goal.id === id) || null;
    }
    async findWeightGoalsByUserId(userId) {
        return this.weightGoals
            .filter(goal => goal.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async findActiveWeightGoalByUserId(userId) {
        return this.weightGoals.find(goal => goal.userId === userId && goal.isActive) || null;
    }
    async updateWeightGoal(goal) {
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
    async deactivateAllWeightGoalsByUserId(userId) {
        this.weightGoals = this.weightGoals.map(goal => goal.userId === userId ? Object.assign(Object.assign({}, goal), { isActive: false }) : goal);
    }
    async deleteWeightGoal(id) {
        const initialLength = this.weightGoals.length;
        this.weightGoals = this.weightGoals.filter(goal => goal.id !== id);
        return this.weightGoals.length < initialLength;
    }
}
exports.BodyRepository = BodyRepository;
//# sourceMappingURL=body.repository.js.map