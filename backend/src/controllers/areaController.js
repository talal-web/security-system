import {
  createAreaService,
  getAreasService,
  getAreaByIdService,
  updateAreaService,
  deleteAreaService,
  reorderAreasService,
} from "../services/area/area.service.js";

// ======================================
// Create Area
// ======================================

export const createArea = async (req, res) => {
  const area = await createAreaService(req.body);

  return res.status(201).json({
    success: true,
    message: "Area created successfully",
    data: area,
  });
};

// ======================================
// Get All Areas
// ======================================

export const getAreas = async (req, res) => {
  const areas = await getAreasService(req.query, req.user);

  return res.status(200).json({
    success: true,
    count: areas.length,
    data: areas,
  });
};

// ======================================
// Get Single Area
// ======================================

export const getAreaById = async (req, res) => {
  const area = await getAreaByIdService({
    id: req.params.id,
  });

  return res.status(200).json({
    success: true,
    data: area,
  });
};

// ======================================
// Update Area
// ======================================

export const updateArea = async (req, res) => {
  const area = await updateAreaService({
    id: req.params.id,
    ...req.body,
  });

  return res.status(200).json({
    success: true,
    message: "Area updated successfully",
    data: area,
  });
};

// ======================================
// Delete Area
// ======================================

export const deleteArea = async (req, res) => {
  await deleteAreaService({
    id: req.params.id,
  });

  return res.status(200).json({
    success: true,
    message: "Area deleted successfully",
  });
};

// ======================================
// Reorder Areas
// ======================================

export const reorderAreas = async (req, res) => {
  await reorderAreasService({
    areas: req.body.areas,
  });

  return res.status(200).json({
    success: true,
    message: "Areas reordered successfully.",
  });
};
