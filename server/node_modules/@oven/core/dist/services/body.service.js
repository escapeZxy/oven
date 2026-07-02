"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyService = void 0;
var BodyService = /** @class */ (function () {
    function BodyService(bodyRepository) {
        this.bodyRepository = bodyRepository;
    }
    // Body Measurement Methods
    BodyService.prototype.addMeasurement = function (measurementData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.createMeasurement(measurementData)];
            });
        });
    };
    BodyService.prototype.getMeasurement = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.findMeasurementById(id)];
            });
        });
    };
    BodyService.prototype.getAllMeasurementsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.findMeasurementsByUserId(userId)];
            });
        });
    };
    BodyService.prototype.updateMeasurement = function (measurement) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.updateMeasurement(measurement)];
            });
        });
    };
    BodyService.prototype.deleteMeasurement = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.deleteMeasurement(id)];
            });
        });
    };
    // Body Photo Methods
    BodyService.prototype.addBodyPhoto = function (photoData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.createPhoto(photoData)];
            });
        });
    };
    BodyService.prototype.getBodyPhoto = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.findPhotoById(id)];
            });
        });
    };
    BodyService.prototype.getAllBodyPhotosByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.findPhotosByUserId(userId)];
            });
        });
    };
    BodyService.prototype.updateBodyPhoto = function (photo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.updatePhoto(photo)];
            });
        });
    };
    BodyService.prototype.deleteBodyPhoto = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.deletePhoto(id)];
            });
        });
    };
    // Weight Goal Methods
    BodyService.prototype.setWeightGoal = function (goalData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!goalData.isActive) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.bodyRepository.deactivateAllWeightGoalsByUserId(goalData.userId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.bodyRepository.createWeightGoal(goalData)];
                }
            });
        });
    };
    BodyService.prototype.getWeightGoal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.findWeightGoalById(id)];
            });
        });
    };
    BodyService.prototype.getAllWeightGoalsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.findWeightGoalsByUserId(userId)];
            });
        });
    };
    BodyService.prototype.getActiveWeightGoalByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.findActiveWeightGoalByUserId(userId)];
            });
        });
    };
    BodyService.prototype.updateWeightGoal = function (goal) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!goal.isActive) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.bodyRepository.deactivateAllWeightGoalsByUserId(goal.userId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.bodyRepository.updateWeightGoal(goal)];
                }
            });
        });
    };
    BodyService.prototype.deleteWeightGoal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.bodyRepository.deleteWeightGoal(id)];
            });
        });
    };
    BodyService.prototype.calculateWeightProgress = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var activeGoal, measurements, latestMeasurement, currentWeight, targetWeight, startWeight, totalDiff, currentDiff, progress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getActiveWeightGoalByUserId(userId)];
                    case 1:
                        activeGoal = _a.sent();
                        if (!activeGoal) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.getAllMeasurementsByUserId(userId)];
                    case 2:
                        measurements = _a.sent();
                        if (measurements.length === 0) {
                            return [2 /*return*/, null];
                        }
                        latestMeasurement = measurements[0];
                        currentWeight = latestMeasurement.weight;
                        targetWeight = activeGoal.targetWeight;
                        startWeight = activeGoal.startWeight;
                        totalDiff = Math.abs(targetWeight - startWeight);
                        currentDiff = Math.abs(currentWeight - startWeight);
                        progress = totalDiff > 0 ? Math.round((1 - currentDiff / totalDiff) * 100) : 0;
                        return [2 /*return*/, {
                                current: currentWeight,
                                target: targetWeight,
                                progress: Math.min(progress, 100), // Cap at 100%
                            }];
                }
            });
        });
    };
    return BodyService;
}());
exports.BodyService = BodyService;
