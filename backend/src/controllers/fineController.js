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

export const createFine = async (req, res) => {
  const fine = await createFineService(req.body, req.user, req.areaScope);

  return res.status(201).json({
    success: true,
    message: "Fine created successfully",
    data: fine,
  });
};

// ======================================
// GET ALL FINES
// ======================================

export const getFines = async (req, res) => {
  const fines = await getFinesService(req.query, req.areaScope);

  return res.status(200).json({
    success: true,
    count: fines.length,
    data: fines,
  });
};

// ======================================
// GET EMPLOYEE FINES
// ======================================

export const getEmployeeFines = async (req, res) => {
  const result = await getEmployeeFinesService(
    req.params.employeeId,
    req.areaScope,
  );

  return res.status(200).json({
    success: true,
    count: result.fines.length,
    data: result,
  });
};

// ======================================
// UPDATE FINE
// ======================================

export const updateFine = async (req, res) => {
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
};

// ======================================
// CANCEL FINE
// ======================================

export const cancelFine = async (req, res) => {
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
};
