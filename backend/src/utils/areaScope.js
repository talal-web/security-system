const objectIdPattern = /^[a-fA-F0-9]{24}$/;

const sanitizeObjectId = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (Array.isArray(value)) {
    return null;
  }

  const raw = String(value).trim();

  if (!raw || raw === "null" || raw === "undefined") {
    return null;
  }

  return objectIdPattern.test(raw) ? raw : null;
};

const flattenAreaValues = (value) => {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];
  const flattened = [];

  for (const entry of values) {
    if (entry === undefined || entry === null || entry === "") {
      continue;
    }

    if (Array.isArray(entry)) {
      flattened.push(...flattenAreaValues(entry));
    } else {
      flattened.push(entry);
    }
  }

  return flattened;
};

const normalizeAreaIds = (value) => {
  const values = flattenAreaValues(value);
  const seen = new Set();
  const normalized = [];

  for (const entry of values) {
    const sanitized = sanitizeObjectId(entry);

    if (!sanitized) {
      throw new Error("Invalid area ID");
    }

    if (!seen.has(sanitized)) {
      seen.add(sanitized);
      normalized.push(sanitized);
    }
  }

  return normalized;
};

const requireSingleAreaId = (value) => {
  const ids = normalizeAreaIds(value);

  if (ids.length !== 1) {
    throw new Error("Exactly one area must be selected");
  }

  return ids[0];
};

const isPrivileged = (user = {}) =>
  user.role === "admin" || user.role === "developer";

export const getPermittedAreaIds = (user = {}) => {
  if (!user || isPrivileged(user)) {
    return [];
  }

  const areas = Array.isArray(user.areas) ? user.areas : [];
  return normalizeAreaIds(areas);
};

export const resolveScopedAreaIds = (user = {}, requestedAreaId) => {
  const requestedId = requireSingleAreaId(requestedAreaId);

  if (isPrivileged(user)) {
    return [requestedId];
  }

  const permitted = getPermittedAreaIds(user);

  if (!permitted.length) {
    throw new Error("Unauthorized: no area access assigned");
  }

  if (!permitted.includes(requestedId)) {
    throw new Error("Unauthorized area access");
  }

  return [requestedId];
};

export const createAreaScopeFilter = (user = {}, requestedAreaId) => {
  const [areaId] = resolveScopedAreaIds(user, requestedAreaId);

  return { area: areaId };
};

export const ensureEmployeeAreaAccess = (
  user = {},
  employee = {},
  selectedAreaId,
) => {
  const employeeAreaValue = employee?.area
    ? employee.area._id || employee.area
    : null;

  const employeeArea = sanitizeObjectId(employeeAreaValue);

  if (!employeeArea) {
    throw new Error("Invalid employee area");
  }

  // If a selected area is provided, it must be the employee's area.
  if (selectedAreaId !== undefined) {
    const selectedId = requireSingleAreaId(selectedAreaId);

    if (employeeArea !== selectedId) {
      throw new Error("Employee is outside the selected area");
    }
  }

  // Every user, including admins and developers, must have
  // a selected area when this check is used for a scoped request.
  resolveScopedAreaIds(user, selectedAreaId ?? employeeArea);

  if (employeeArea !== (selectedAreaId ?? employeeArea)) {
    throw new Error("Unauthorized area access");
  }

  return true;
};

export const validateRequestedAreaAccess = (user = {}, areaId) => {
  return resolveScopedAreaIds(user, areaId);
};

export const applyAreaScopeToQuery = (user = {}, query = {}, options = {}) => {
  const field = options.field || "area";
  const requestedArea = options.requestedArea ?? query[field];

  const [areaId] = resolveScopedAreaIds(user, requestedArea);

  query[field] = areaId;

  return query;
};
