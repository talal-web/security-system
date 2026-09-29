import {
  createAreaScopeFilter,
  getPermittedAreaIds,
  resolveScopedAreaIds,
  validateRequestedAreaAccess,
} from "../utils/areaScope.js";

const getRequestAreaValues = (req) => {
  const candidates = [
    req.query?.area,
    req.body?.area,
    req.query?.areas,
    req.body?.areas,
  ];

  const flattened = candidates.flatMap((candidate) => {
    if (candidate === undefined || candidate === null || candidate === "") {
      return [];
    }

    return Array.isArray(candidate) ? candidate : [candidate];
  });

  return flattened.length ? flattened : null;
};

export const enforceAreaScope = (req, res, next) => {
  try {
    const user = req.user || {};

    if (!user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const requestedArea = getRequestAreaValues(req);
    const permitted = getPermittedAreaIds(user);

    if (user.role === "admin" || user.role === "developer") {
      const requestedAreaIds = requestedArea
        ? resolveScopedAreaIds(user, requestedArea)
        : [];

      req.areaScope = {
        isAdmin: true,
        permittedAreaIds: [],
        requestedAreaIds,
        filter: createAreaScopeFilter(user, requestedArea),
      };
      return next();
    }

    if (!permitted.length) {
      return res.status(403).json({
        success: false,
        message: "No area access assigned to this user",
      });
    }

    const scopedAreaIds = validateRequestedAreaAccess(
      user,
      requestedArea ?? permitted,
    );

    req.areaScope = {
      isAdmin: false,
      permittedAreaIds: permitted,
      requestedAreaIds: scopedAreaIds,
      filter: createAreaScopeFilter(user, requestedArea ?? permitted),
    };

    return next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message || "Unauthorized area access",
    });
  }
};

export const requireAreaAccess = (req, res, next) => {
  if (req.areaScope && req.areaScope.permittedAreaIds !== undefined) {
    return next();
  }

  return enforceAreaScope(req, res, next);
};
