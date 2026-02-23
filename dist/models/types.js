"use strict";
/**
 * Shared types & enums for database models
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionStatus = exports.ProductOptionType = exports.PaymentMethod = exports.OrderStatus = exports.UserStatus = exports.Role = void 0;
// ─── User & Role ─────────────────────────────────────────────────────────────
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["BRAND_ADMIN"] = "BRAND_ADMIN";
    Role["STORE_MANAGER"] = "STORE_MANAGER";
    Role["STAFF"] = "STAFF";
})(Role || (exports.Role = Role = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["DISABLED"] = "disabled";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
// ─── Order ───────────────────────────────────────────────────────────────────
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["CREATED"] = "CREATED";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["PREPARING"] = "PREPARING";
    OrderStatus["READY"] = "READY";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["COD"] = "COD";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
// ─── Product options ─────────────────────────────────────────────────────────
var ProductOptionType;
(function (ProductOptionType) {
    ProductOptionType["SINGLE"] = "single";
    ProductOptionType["MULTIPLE"] = "multiple";
})(ProductOptionType || (exports.ProductOptionType = ProductOptionType = {}));
// ─── Subscription ────────────────────────────────────────────────────────────
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["EXPIRED"] = "expired";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
//# sourceMappingURL=types.js.map