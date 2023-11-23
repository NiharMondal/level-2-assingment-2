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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../user-model"));
const getAllOrdersOfSpecificUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findById(userId).select("orders -_id");
    return result;
});
const updateOrder = (userId, order) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.myStaticMethod(userId);
    if (!user) {
        throw new Error("User not found!");
    }
    const result = yield user_model_1.default.findByIdAndUpdate(userId, {
        $push: { orders: order },
    }, { new: true, runValidators: true });
    return result;
});
const calculateTotalPrice = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.myStaticMethod(userId);
    if (!user) {
        throw new Error("User not found!");
    }
    const data = yield user_model_1.default.aggregate([
        //stage 1 --->findby userId
        { $match: { _id: new mongoose_1.default.Types.ObjectId(userId) } },
        // stage 2 ---> break oders array
        { $unwind: "$orders" },
        //stage 3 ---> group by id and calculate totalprice
        {
            $group: {
                _id: null,
                totalprice: {
                    $sum: { $multiply: ["$orders.price", "$orders.quantity"] },
                },
            },
        },
        { $project: { _id: 0 } },
    ]);
    return data;
});
exports.orderServices = {
    getAllOrdersOfSpecificUser,
    updateOrder,
    calculateTotalPrice,
};
