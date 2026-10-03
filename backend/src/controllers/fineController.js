import {
  createFineService,
  getFinesService,
  getEmployeeFinesService,
  updateFineService,
  cancelFineService,
} from "../services/fine/fine.service.js";

// ======================================
// CREATE FINE
// ======================================

export const createFine = async (req, res, next) => {
  try {
    const fine = await createFineService(req.body, req.user, req.areaScope);

    return res.status(201).json({
      success: true,
      message: "Fine created successfully",
      data: fine,
    });
  } catch (error) {
    error.operationMessage = "Failed to create fine";
    return next(error);
  }
};

// ======================================
// GET ALL FINES
// ======================================

export const getFines = async (req, res, next) => {
  try {
    const fines = await getFinesService(req.query, req.areaScope);

    return res.status(200).json({
      success: true,
      count: fines.length,
      data: fines,
    });
  } catch (error) {
    error.operationMessage = "Failed to get fines";
    return next(error);
  }
};

// ======================================
// GET EMPLOYEE FINES
// ======================================

export const getEmployeeFines = async (req, res, next) => {
  try {
    const result = await getEmployeeFinesService(
      req.params.employeeId,
      req.areaScope,
    );

    return res.status(200).json({
      success: true,
      count: result.fines.length,
      data: result,
    });
  } catch (error) {
    error.operationMessage = "Failed to get employee fines";
    return next(error);
  }
};

// ======================================
// UPDATE FINE
// ======================================

export const updateFine = async (req, res, next) => {
  try {
    const fine = await updateFineService(
      req.params.id,
      req.body,
      req.user,
      req.areaScope,
    );

    return res.status(200).json({
      success: true,
      message: "Fine updated successfully",
      data: fine,
    });
  } catch (error) {
    error.operationMessage = "Failed to update fine";
    return next(error);
  }
};

// ======================================
// CANCEL FINE
// ======================================

export const cancelFine = async (req, res, next) => {
  try {
    const fine = await cancelFineService(
      req.params.id,
      req.user,
      req.areaScope,
    );

    return res.status(200).json({
      success: true,
      message: "Fine cancelled successfully",
      data: fine,
    });
  } catch (error) {
    error.operationMessage = "Failed to cancel fine";
    return next(error);
  }
};
