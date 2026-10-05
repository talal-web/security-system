const requiredEmployeeImageFields = [
  "profileImage",
  "cnicFrontImage",
  "cnicBackImage",
];

export const getMissingEmployeeImageFields = (files = {}) =>
  requiredEmployeeImageFields.filter((field) => !files?.[field]?.[0]);