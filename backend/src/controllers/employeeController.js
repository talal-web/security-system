import {
  createEmployeeService,
  getEmployeesService,
  lookupEmployeeService,
  getEmployeeByIdService,
  updateEmployeeService,
  deleteEmployeeService,
} from "../services/employee/employee.service.js";

export const createEmployee = async (req, res) => {
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
};

export const getEmployees = async (req, res) => {
  const employees = await getEmployeesService(req.query, req.areaScope);

  res.status(200).json({
    success: true,
    data: employees,
  });
};

export const lookupEmployee = async (req, res) => {
  const empId = req.query?.empId || req.params?.empId;

  const employee = await lookupEmployeeService(empId, req.areaScope);

  res.status(200).json({
    success: true,
    data: employee,
  });
};

export const getEmployeeById = async (req, res) => {
  const employee = await getEmployeeByIdService(req.params.id, req.areaScope);

  res.status(200).json({
    success: true,
    data: employee,
  });
};

export const updateEmployee = async (req, res) => {
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
};

export const deleteEmployee = async (req, res) => {
  await deleteEmployeeService(req.params.id, req.areaScope);

  res.status(200).json({
    success: true,
    message: "Employee deleted successfully",
  });
};
