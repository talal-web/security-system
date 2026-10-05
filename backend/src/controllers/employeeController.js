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
    data: req.body ?? {},
    files: req.files,
    userId: req.user?.id,
    areaScope: req.areaScope,
  });

  res.status(201).json({
    success: true,
    message: "Employee created successfully",
    data: employee,
  });
});

export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await getEmployeesService(req.query, req.areaScope);

  res.status(200).json({
    success: true,
    data: employees,
  });
});

export const lookupEmployee = asyncHandler(async (req, res) => {
  const empId = req.query?.empId || req.params?.empId;

  const employee = await lookupEmployeeService(empId, req.areaScope);

  res.status(200).json({
    success: true,
    data: employee,
  });
});

export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await getEmployeeByIdService(req.params.id, req.areaScope);

  res.status(200).json({
    success: true,
    data: employee,
  });
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await updateEmployeeService({
    id: req.params.id,
    data: req.body ?? {},
    files: req.files,
    areaScope: req.areaScope,
  });

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    data: employee,
  });
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  await deleteEmployeeService(req.params.id, req.areaScope);

  res.status(200).json({
    success: true,
    message: "Employee deleted successfully",
  });
});
