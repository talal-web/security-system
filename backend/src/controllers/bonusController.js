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

export const createBonus = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// ======================================
// Get All Bonuses
// ======================================

export const getBonuses = async (req, res, next) => {
  try {
    const bonuses = await getBonusesService(req.query, req.areaScope);

    return res.status(200).json({
      success: true,
      count: bonuses.length,
      data: bonuses,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Get Employee Bonus History
// ======================================

export const getEmployeeBonuses = async (req, res, next) => {
  try {
    const result = await getEmployeeBonusesService(
      req.params.employeeId,
      req.areaScope,
    );

    return res.status(200).json({
      success: true,
      count: result.bonuses.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Update / Correct Bonus
// ======================================

export const updateBonus = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// ======================================
// Cancel Bonus
// ======================================

export const cancelBonus = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
