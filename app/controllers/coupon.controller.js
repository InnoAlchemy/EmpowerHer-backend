const db = require("../models");
const Coupon = db.coupons;

// Get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving coupons" });
  }
};

// Add a new coupon
exports.addCoupon = async (req, res) => {
  const { title, code, limit, amount } = req.body;
  try {
    const newCoupon = await Coupon.create({
      title,
      code,
      limit,
      amount
    });
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
};

// Get a coupon by ID
exports.getCouponById = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findOne({ where: { id } });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving coupon" });
  }
};

// Update a coupon by ID
exports.updateCoupon = async (req, res) => {
  const { id } = req.params;
  const { title, code, limit, amount } = req.body;

  try {
    // Find the coupon by ID
    const coupon = await Coupon.findOne({ where: { id } });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Update only provided fields
    coupon.title = title !== undefined ? title : coupon.title;
    coupon.code = code !== undefined ? code : coupon.code;
    coupon.limit = limit !== undefined ? limit : coupon.limit;
    coupon.amount = amount!== undefined ? limit : coupon.amount;

    // Save updated coupon
    await coupon.save();
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Error updating coupon", error: error.message });
  }
};


// Delete a coupon by ID
exports.deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findOne({ where: { id } });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    await coupon.destroy();
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coupon" });
  }
};
