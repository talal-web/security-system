import {
  createBonusService,
  getBonusesService,
  getEmployeeBonusesService,
  updateBonusService,
  cancelBonusService,
} from "../services/bonus/bonus.service.js";

// ======================================
// Create Bonus
// ======================================

export const createBonus = async (req, res) => {
  const bonus = await createBonusService(
    req.body,
    req.user.id,
    req.areaScope,
  );

  return res.status(201).json({
    success: true,
    message: "Bonus created successfully",
    data: bonus,
  });
};

// ======================================
// Get All Bonuses
// ======================================

export const getBonuses = async (req, res) => {
  const bonuses = await getBonusesService(req.query, req.areaScope);

  return res.status(200).json({
    success: true,
    count: bonuses.length,
    data: bonuses,
  });
};

// ======================================
// Get Employee Bonus History
// ======================================

export const getEmployeeBonuses = async (req, res) => {
  const result = await getEmployeeBonusesService(
    req.params.employeeId,
    req.areaScope,
  );

  return res.status(200).json({
    success: true,
    count: result.bonuses.length,
    data: result,
  });
};

// ======================================
// Update / Correct Bonus
// ======================================

export const updateBonus = async (req, res) => {
  const bonus = await updateBonusService(
    req.params.id,
    req.body,
    req.user.id,
    req.areaScope,
  );

  return res.status(200).json({
    success: true,
    message: "Bonus updated successfully",
    data: bonus,
  });
};

// ======================================
// Cancel Bonus
// ======================================

export const cancelBonus = async (req, res) => {
  const bonus = await cancelBonusService(
    req.params.id,
    req.user.id,
    req.areaScope,
  );

  return res.status(200).json({
    success: true,
    message: "Bonus cancelled successfully",
    data: bonus,
  });
};
