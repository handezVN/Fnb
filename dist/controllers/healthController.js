"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = getHealth;
const database_1 = __importDefault(require("../config/database"));
/**
 * Health check + DB connectivity
 */
async function getHealth(_req, res) {
    try {
        const dbResult = await database_1.default.query('SELECT NOW() as now');
        res.json({
            message: 'Backend running 🚀',
            data: dbResult.rows,
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        res.status(503).json({
            message: 'Service unavailable',
            error: err instanceof Error ? err.message : 'Unknown error',
        });
    }
}
//# sourceMappingURL=healthController.js.map