import {
  createEmployeeService,
  getEmployeesService,
  lookupEmployeeService,
  getEmployeeByIdService,
  updateEmployeeService,
  deleteEmployeeService,
} from "../services/employee/employee.service.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const createEmployee = asyncHandler(async (req, res) => {
  const employee = await createEmployeeService({
    data: req.body,
    files: req.files,
    userId: req.user?.id,
    user: req.user,
    areaScope: req.areaScope,
  });

  res.status(201).json({
    success: true,
    message: "Employee created successfully",
    data: employee,
  });
});

export const getEmployees = asyncHandler(async (req, res) => {
  const trustedAreaScope = req.areaScope || {
    filter: {},
    permittedAreaIds: [],
    requestedAreaIds: [],
    isAdmin: false,
  };

  const sanitizedQuery = { ...req.query };

  // Remove alternate client-supplied area filter parameters.
  delete sanitizedQuery.areas;
  delete sanitizedQuery.areaFilter;

  const employees = await getEmployeesService(sanitizedQuery, trustedAreaScope);

  res.status(200).json({
    success: true,
    data: employees,
  });
});

export const lookupEmployee = asyncHandler(async (req, res) => {
  const empId = req.query?.empId || req.params?.empId;
  const employee = await lookupEmployeeService(empId);

  if (req.user.role !== "admin" && req.user.role !== "developer") {
    const areaScope = req.areaScope || { permittedAreaIds: [] };
    const employeeArea = employee?.area ? String(employee.area) : "";

    if (!employeeArea || !areaScope.permittedAreaIds.includes(employeeArea)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized area access",
      });
    }
  }

  res.status(200).json({
    success: true,
    data: employee,
  });
});

export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await getEmployeeByIdService(req.params.id);

  if (req.user.role !== "admin" && req.user.role !== "developer") {
    const permitted = req.areaScope?.permittedAreaIds || [];
    const employeeArea = employee?.area?._id
      ? String(employee.area._id)
      : String(employee?.area || "");

    if (!employee || !employeeArea || !permitted.includes(employeeArea)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized area access",
      });
    }
  }

  res.status(200).json({
    success: true,
    data: employee,
  });
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const currentEmployee = await getEmployeeByIdService(req.params.id);

  if (req.user.role !== "admin" && req.user.role !== "developer") {
    const permitted = req.areaScope?.permittedAreaIds || [];
    const employeeArea = currentEmployee?.area?._id
      ? String(currentEmployee.area._id)
      : String(currentEmployee?.area || "");

    if (!employeeArea || !permitted.includes(employeeArea)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized area access",
      });
    }
  }

  const employee = await updateEmployeeService({
    id: req.params.id,
    data: req.body,
    files: req.files,
    user: req.user,
    areaScope: req.areaScope,
  });

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    data: employee,
  });
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  await deleteEmployeeService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Employee deleted successfully",
  });
});
