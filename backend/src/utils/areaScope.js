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

  if (!objectIdPattern.test(raw)) {
    return null;
  }

  return raw;
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
      continue;
    }

    flattened.push(entry);
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

    if (seen.has(sanitized)) {
      continue;
    }

    seen.add(sanitized);
    normalized.push(sanitized);
  }

  return normalized;
};

export const getPermittedAreaIds = (user = {}) => {
  if (!user || user.role === "admin" || user.role === "developer") {
    return [];
  }

  const areas = Array.isArray(user.areas) ? user.areas : [];
  return normalizeAreaIds(areas);
};

export const resolveScopedAreaIds = (user = {}, requestedAreaIds) => {
  if (!user || user.role === "admin" || user.role === "developer") {
    return normalizeAreaIds(requestedAreaIds ?? []);
  }

  const permitted = getPermittedAreaIds(user);

  if (!permitted.length) {
    throw new Error("Unauthorized: no area access assigned");
  }

  const requested = normalizeAreaIds(requestedAreaIds ?? permitted);

  if (!requested.length) {
    return [...permitted];
  }

  const unauthorized = requested.filter((id) => !permitted.includes(id));

  if (unauthorized.length) {
    throw new Error("Unauthorized area access");
  }

  return requested;
};

export const createAreaScopeFilter = (user = {}, requestedAreaIds) => {
  if (!user || user.role === "admin" || user.role === "developer") {
    const requested = normalizeAreaIds(requestedAreaIds ?? []);

    if (!requested.length) {
      return {};
    }

    return requested.length === 1
      ? { area: requested[0] }
      : { area: { $in: requested } };
  }

  const permitted = getPermittedAreaIds(user);

  if (!permitted.length) {
    throw new Error("Unauthorized: no area access assigned");
  }

  const scopedAreaIds = resolveScopedAreaIds(
    user,
    requestedAreaIds === undefined ? permitted : requestedAreaIds,
  );

  return { area: { $in: scopedAreaIds } };
};

export const ensureEmployeeAreaAccess = (user = {}, employee = {}) => {
  if (!user || user.role === "admin" || user.role === "developer") {
    return true;
  }

  const userAreas = new Set(getPermittedAreaIds(user));

  if (!userAreas.size) {
    throw new Error("Unauthorized: no area access assigned");
  }

  const employeeAreaValue = employee?.area
    ? employee.area._id || employee.area
    : null;
  const employeeArea = sanitizeObjectId(employeeAreaValue);

  if (!employeeArea || !userAreas.has(employeeArea)) {
    throw new Error("Unauthorized area access");
  }

  return true;
};

export const validateRequestedAreaAccess = (user = {}, areaIdOrIds) => {
  const requested = normalizeAreaIds(areaIdOrIds ?? []);

  if (!user || user.role === "admin" || user.role === "developer") {
    return requested;
  }

  const permitted = getPermittedAreaIds(user);

  if (!permitted.length) {
    throw new Error("Unauthorized: no area access assigned");
  }

  if (!requested.length) {
    return [...permitted];
  }

  const unauthorized = requested.filter((id) => !permitted.includes(id));

  if (unauthorized.length) {
    throw new Error("Unauthorized area access");
  }

  return requested;
};

export const applyAreaScopeToQuery = (user = {}, query = {}, options = {}) => {
  const field = options.field || "area";
  const requestedArea = options.requestedArea ?? query[field];

  if (!user || user.role === "admin" || user.role === "developer") {
    const sanitized = normalizeAreaIds(requestedArea ?? []);

    if (sanitized.length === 1) {
      query[field] = sanitized[0];
    } else if (sanitized.length > 1) {
      query[field] = { $in: sanitized };
    } else if (
      requestedArea !== undefined &&
      requestedArea !== null &&
      requestedArea !== ""
    ) {
      throw new Error("Invalid area ID");
    }

    return query;
  }

  const permitted = getPermittedAreaIds(user);

  if (!permitted.length) {
    throw new Error("Unauthorized: no area access assigned");
  }

  const validated = validateRequestedAreaAccess(
    user,
    requestedArea === undefined || requestedArea === null || requestedArea === ""
      ? permitted
      : requestedArea,
  );

  if (validated.length === 1) {
    query[field] = validated[0];
  } else {
    query[field] = { $in: validated };
  }

  return query;
};
