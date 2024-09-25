// comparisonHelper.js
const db = require("../models");
const { Sequelize } = db;
const User = db.users;
// Helper function to calculate percentage comparison
const calculateComparisonPercentage = async () => {
  const currentMonth = new Date().getMonth() + 1; // Current month (1-12)
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1; // Previous month

  // Fetch users registered in the current month
  const currentMonthUsers = await User.count({
    where: Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), currentMonth),
  });

  // Fetch users registered in the previous month
  const previousMonthUsers = await User.count({
    where: Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), previousMonth),
  });

  // If no users last month, return "100.00% more"
  if (previousMonthUsers === 0) {
    return `100.00% more`;
  }

  // Calculate the percentage difference
  const percentageChange = ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100;

  // Format the result: "X.XX% more" or "X.XX% less"
  const formattedPercentage = Math.abs(percentageChange).toFixed(2);
  const comparisonText = percentageChange > 0 ? `${formattedPercentage}% more` : `${formattedPercentage}% less`;

  return comparisonText;
};

module.exports = calculateComparisonPercentage;
