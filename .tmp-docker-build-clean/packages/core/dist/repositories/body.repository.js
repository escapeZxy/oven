"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyRepository = void 0;
var uuid_1 = require("uuid");
var BodyRepository = /** @class */ (function () {
    function BodyRepository() {
        this.measurements = [];
        this.photos = [];
        this.weightGoals = [];
    }
    // Body Measurement CRUD
    BodyRepository.prototype.createMeasurement = function (measurementData) {
        return __awaiter(this, void 0, void 0, function () {
            var newMeasurement;
            return __generator(this, function (_a) {
                newMeasurement = __assign({ id: (0, uuid_1.v4)() }, measurementData);
                this.measurements.push(newMeasurement);
                return [2 /*return*/, newMeasurement];
            });
        });
    };
    BodyRepository.prototype.findMeasurementById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.measurements.find(function (measurement) { return measurement.id === id; }) || null];
            });
        });
    };
    BodyRepository.prototype.findMeasurementsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.measurements
                        .filter(function (measurement) { return measurement.userId === userId; })
                        .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); })];
            });
        });
    };
    BodyRepository.prototype.updateMeasurement = function (measurement) {
        return __awaiter(this, void 0, void 0, function () {
            var existingIndex;
            return __generator(this, function (_a) {
                existingIndex = this.measurements.findIndex(function (m) { return m.id === measurement.id; });
                if (existingIndex === -1) {
                    return [2 /*return*/, null];
                }
                this.measurements = __spreadArray(__spreadArray(__spreadArray([], this.measurements.slice(0, existingIndex), true), [
                    measurement
                ], false), this.measurements.slice(existingIndex + 1), true);
                return [2 /*return*/, measurement];
            });
        });
    };
    BodyRepository.prototype.deleteMeasurement = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.measurements.length;
                this.measurements = this.measurements.filter(function (measurement) { return measurement.id !== id; });
                return [2 /*return*/, this.measurements.length < initialLength];
            });
        });
    };
    // Body Photo CRUD
    BodyRepository.prototype.createPhoto = function (photoData) {
        return __awaiter(this, void 0, void 0, function () {
            var newPhoto;
            return __generator(this, function (_a) {
                newPhoto = __assign({ id: (0, uuid_1.v4)() }, photoData);
                this.photos.push(newPhoto);
                return [2 /*return*/, newPhoto];
            });
        });
    };
    BodyRepository.prototype.findPhotoById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.photos.find(function (photo) { return photo.id === id; }) || null];
            });
        });
    };
    BodyRepository.prototype.findPhotosByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.photos
                        .filter(function (photo) { return photo.userId === userId; })
                        .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); })];
            });
        });
    };
    BodyRepository.prototype.updatePhoto = function (photo) {
        return __awaiter(this, void 0, void 0, function () {
            var existingIndex;
            return __generator(this, function (_a) {
                existingIndex = this.photos.findIndex(function (p) { return p.id === photo.id; });
                if (existingIndex === -1) {
                    return [2 /*return*/, null];
                }
                this.photos = __spreadArray(__spreadArray(__spreadArray([], this.photos.slice(0, existingIndex), true), [
                    photo
                ], false), this.photos.slice(existingIndex + 1), true);
                return [2 /*return*/, photo];
            });
        });
    };
    BodyRepository.prototype.deletePhoto = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.photos.length;
                this.photos = this.photos.filter(function (photo) { return photo.id !== id; });
                return [2 /*return*/, this.photos.length < initialLength];
            });
        });
    };
    // Weight Goal CRUD
    BodyRepository.prototype.createWeightGoal = function (goalData) {
        return __awaiter(this, void 0, void 0, function () {
            var newGoal;
            return __generator(this, function (_a) {
                newGoal = __assign({ id: (0, uuid_1.v4)() }, goalData);
                this.weightGoals.push(newGoal);
                return [2 /*return*/, newGoal];
            });
        });
    };
    BodyRepository.prototype.findWeightGoalById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.weightGoals.find(function (goal) { return goal.id === id; }) || null];
            });
        });
    };
    BodyRepository.prototype.findWeightGoalsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.weightGoals
                        .filter(function (goal) { return goal.userId === userId; })
                        .sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })];
            });
        });
    };
    BodyRepository.prototype.findActiveWeightGoalByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.weightGoals.find(function (goal) { return goal.userId === userId && goal.isActive; }) || null];
            });
        });
    };
    BodyRepository.prototype.updateWeightGoal = function (goal) {
        return __awaiter(this, void 0, void 0, function () {
            var existingIndex;
            return __generator(this, function (_a) {
                existingIndex = this.weightGoals.findIndex(function (g) { return g.id === goal.id; });
                if (existingIndex === -1) {
                    return [2 /*return*/, null];
                }
                this.weightGoals = __spreadArray(__spreadArray(__spreadArray([], this.weightGoals.slice(0, existingIndex), true), [
                    goal
                ], false), this.weightGoals.slice(existingIndex + 1), true);
                return [2 /*return*/, goal];
            });
        });
    };
    BodyRepository.prototype.deactivateAllWeightGoalsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.weightGoals = this.weightGoals.map(function (goal) {
                    return goal.userId === userId ? __assign(__assign({}, goal), { isActive: false }) : goal;
                });
                return [2 /*return*/];
            });
        });
    };
    BodyRepository.prototype.deleteWeightGoal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.weightGoals.length;
                this.weightGoals = this.weightGoals.filter(function (goal) { return goal.id !== id; });
                return [2 /*return*/, this.weightGoals.length < initialLength];
            });
        });
    };
    return BodyRepository;
}());
exports.BodyRepository = BodyRepository;
