"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import EmployeeCard from "@/components/employees/EmployeeCard";
import { Employee } from "@/types/employee";

import {
  BriefcaseBusiness,
  Filter,
  MapPin,
  Search,
  ShieldCheck,
  Users,
  X,
  Plus,
  Banknote,
} from "lucide-react";
import { useEmployees } from "@/hooks/employee/useEmployees";

import { designationOptions } from "@/constants/employee";

type Filters = {
  search: string;
  status: string;
  designation: string;
  sector: string;
  salary: string;
};

export default function EmployeesPage() {
  const { employees, loading, error } = useEmployees();

  // Sector Options
  const sectorOptions = useMemo(
    () => [...new Set(employees.map((emp) => emp.sector))],
    [employees],
  );

  // ======================
  // FILTER STATES
  // ======================

  const initialFilters: Filters = {
    search: "",
    status: "",
    designation: "",
    sector: "",
    salary: "",
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);

  // TEMP FILTERS
  const [tempFilters, setTempFilters] = useState<Filters>(initialFilters);

  // FILTER PANEL
  const [showFilters, setShowFilters] = useState(false);

  // ======================
  // APPLY FILTERS
  // ======================

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  // ======================
  // CLEAR FILTERS
  // ======================

  const clearFilters = () => {
    setFilters(initialFilters);
    setTempFilters(initialFilters);
  };

  // ======================
  // REMOVE SINGLE FILTER
  // ======================

  const removeFilter = (key: keyof Filters) => {
    const updatedFilters = {
      ...filters,
      [key]: "",
    };

    const updatedTempFilters = {
      ...tempFilters,
      [key]: "",
    };

    setFilters(updatedFilters);
    setTempFilters(updatedTempFilters);
  };

  // ======================
  // FILTERED EMPLOYEES
  // ======================

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp: Employee) => {
      const search = filters.search.toLowerCase();

      const matchesSearch =
        !filters.search ||
        emp.name?.toLowerCase().includes(search) ||
        emp.cnic?.toLowerCase().includes(search) ||
        emp.phone1?.toLowerCase().includes(search);

      const matchesStatus = !filters.status || emp.status === filters.status;

      const matchesDesignation =
        !filters.designation || emp.designation === filters.designation;

      const matchesSector = !filters.sector || emp.sector === filters.sector;

      const matchesSalary =
        !filters.salary || Number(emp.basicSalary) === Number(filters.salary);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDesignation &&
        matchesSector &&
        matchesSalary
      );
    });
  }, [employees, filters]);

  // ======================
  // ACTIVE FILTER COUNT
  // ======================

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) =>
      key !== "search" && key !== "otherSalary" && Boolean(value),
  ).length;
  // ======================
  // LOADING
  // ======================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-lg font-semibold text-slate-700">
          Loading employees...
        </p>
      </div>
    );
  }

  // ======================
  // ERROR
  // ======================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-2xl bg-red-50 px-5 py-4 text-red-600 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  // ======================
  // UI
  // ======================

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}

        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-xs font-semibold text-orange-700">
              <Users className="h-4 w-4" />
              Employee Management
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Employees
            </h1>

            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Manage all employee records and staff details.
            </p>
          </div>

          {/* RIGHT */}
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Total Employees
            </p>

            <h2 className="mt-1 text-3xl font-black text-slate-900">
              {filteredEmployees.length}
            </h2>
          </div>
        </div>

        {/* ================= TOOLBAR ================= */}

        <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* SEARCH */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search employee..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              {/* FILTER BUTTON */}
              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* ADD BUTTON */}
              <Link
                href="/employees/create"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                <Plus className="h-4 w-4" />
                Add Employee
              </Link>
            </div>
          </div>

          {/* ================= FILTER PANEL ================= */}

          {showFilters && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {/* STATUS */}
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    value={tempFilters.status}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-orange-500"
                  >
                    <option value="">All Status</option>

                    <option value="active">Active</option>

                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* SALARY */}
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="number"
                    min="0"
                    placeholder="Enter salary manually"
                    value={tempFilters.salary}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        salary: e.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-orange-500"
                  />
                </div>
                {/* DESIGNATION */}
                <div className="relative">
                  <BriefcaseBusiness className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    value={tempFilters.designation}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        designation: e.target.value,
                      }))
                    }
                    className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-orange-500"
                  >
                    <option value="">All Designations</option>

                    {designationOptions.map((designation) => (
                      <option key={designation} value={designation}>
                        {designation}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SECTOR */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    value={tempFilters.sector}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        sector: e.target.value,
                      }))
                    }
                    className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-orange-500"
                  >
                    <option value="">All Sectors</option>

                    {sectorOptions.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-11 rounded-2xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Clear Filters
                </button>

                <button
                  type="button"
                  onClick={applyFilters}
                  className="h-11 rounded-2xl bg-orange-600 px-5 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= ACTIVE FILTERS ================= */}

        {Object.entries(filters).some(
          ([key, value]) => key !== "search" && Boolean(value),
        ) && (
          <div className="mb-5 flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) =>
              key !== "search" && value ? (
                <div
                  key={key}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
                >
                  <span>
                    {key}: {value}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFilter(key as keyof Filters)}
                    className="transition hover:text-red-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : null,
            )}
          </div>
        )}

        {/* ================= GRID ================= */}

        {filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((employee: Employee) => (
              <EmployeeCard key={employee._id} employee={employee} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-75 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-700">
                No employees found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your filters.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
