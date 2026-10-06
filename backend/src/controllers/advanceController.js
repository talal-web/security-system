import {
  createAdvanceService,
  getAdvancesService,
  getEmployeeAdvancesService,
  updateAdvanceService,
  cancelAdvanceService,
} from "../services/advance/advance.service.js";

// ======================================
// Create Advance
// ======================================

export const createAdvance = async (req, res) => {
  const result = await createAdvanceService(
    req.body,
    req.user,
    req.areaScope,
  );

  return res.status(201).json(result);
};

// ======================================
// Get All Advances
// ======================================

export const getAdvances = async (req, res) => {
  const result = await getAdvancesService(req.query, req.areaScope);

  return res.status(200).json(result);
};

// ======================================
// Get Employee Advance History
// ======================================

export const getEmployeeAdvances = async (req, res) => {
  const { employeeId } = req.params;

  const result = await getEmployeeAdvancesService(employeeId, req.areaScope);

  return res.status(200).json(result);
};

// ======================================
// Update Advance
// ======================================

export const updateAdvance = async (req, res) => {
  const { id } = req.params;

  const result = await updateAdvanceService(
    id,
    req.body,
    req.user,
    req.areaScope,
  );

  return res.status(200).json(result);
};

// ======================================
// Cancel Advance
// ======================================

export const cancelAdvance = async (req, res) => {
  const { id } = req.params;

  const result = await cancelAdvanceService(id, req.user, req.areaScope);

  return res.status(200).json(result);
};
