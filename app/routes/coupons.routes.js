module.exports = (app) => {
    const couponController = require("../controllers/coupon.controller");
  
    var router = require("express").Router();
  
    // Get all coupons
    router.get('/coupons', couponController.getAllCoupons);
  
    // Add a new coupon
    router.post('/coupons', couponController.addCoupon);
  
    // Get a coupon by ID
    router.get('/coupons/:id', couponController.getCouponById);
  
    // Update a coupon by ID
    router.put('/coupons/:id', couponController.updateCoupon);
  
    // Delete a coupon by ID
    router.delete('/coupons/:id', couponController.deleteCoupon);
  
    app.use("/api", router);
  };
  