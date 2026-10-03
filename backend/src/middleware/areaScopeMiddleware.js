import {
  createAreaScopeFilter,
  getPermittedAreaIds,
  resolveScopedAreaIds,
  validateRequestedAreaAccess,
} from "../utils/areaScope.js";

// ======================================
// Get requested area
// ======================================

const getRequestedArea = (req) => {
  const queryArea = req.query?.area;
  const bodyArea = req.body?.area;

  // Reject legacy plural parameters.
  if (req.query?.areas !== undefined || req.body?.areas !== undefined) {
    const error = new Error("Only one area can be selected");
    error.statusCode = 400;
    throw error;
  }

  // Reject conflicting query and body values.
  if (
    queryArea !== undefined &&
    bodyArea !== undefined &&
    String(queryArea) !== String(bodyArea)
  ) {
    const error = new Error("Conflicting area selections");
    error.statusCode = 400;
    throw error;
  }

  const area = queryArea ?? bodyArea;

  // Reject multiple selections.
  if (Array.isArray(area)) {
    const error = new Error("Only one area can be selected");
    error.statusCode = 400;
    throw error;
  }

  // Require exactly one non-empty string.
  if (typeof area !== "string" || !area.trim()) {
    const error = new Error("Area selection is required");
    error.statusCode = 400;
    throw error;
  }

  return area.trim();
};

// ======================================
// Enforce area scope
// ======================================

export const enforceAreaScope = (req, res, next) => {
  try {
    const user = req.user || {};

    // Authentication check.
    if (!user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Every request must select exactly one area.
    const requestedArea = getRequestedArea(req);

    // Get areas assigned to this user.
    const permittedAreaIds = getPermittedAreaIds(user);

    const isAdmin = user.role === "admin" || user.role === "developer";

    let scopedAreaIds;

    if (isAdmin) {
      // Admins and developers can select any valid area.
      scopedAreaIds = resolveScopedAreaIds(user, [requestedArea]);
    } else {
      // Other users must have assigned area access.
      if (!permittedAreaIds.length) {
        return res.status(403).json({
          success: false,
          message: "No area access assigned to this user",
        });
      }

      // Validate that the selected area is permitted.
      scopedAreaIds = validateRequestedAreaAccess(user, [requestedArea]);
    }

    // Exactly one validated area must remain.
    if (scopedAreaIds.length !== 1) {
      const error = new Error("Select exactly one valid area");
      error.statusCode = 400;
      throw error;
    }

    // Use the validated ID as the single source of truth.
    const areaId = scopedAreaIds[0];

    req.areaScope = {
      isAdmin,
      areaId,
      permittedAreaIds,
      filter: createAreaScopeFilter(user, [areaId]),
    };

    return next();
  } catch (error) {
    const statusCode = error.statusCode || 403;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Unauthorized area access",
    });
  }
};

// ======================================
// Require area access
// ======================================

export const requireAreaAccess = (req, res, next) => {
  if (
    req.areaScope &&
    typeof req.areaScope.areaId === "string" &&
    req.areaScope.areaId.trim()
  ) {
    return next();
  }

  return enforceAreaScope(req, res, next);
};
