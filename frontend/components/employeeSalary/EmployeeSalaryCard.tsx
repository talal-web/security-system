"use client";

import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import type { EmployeeSalary } from "@/types/employeeSalary";

interface EmployeeSalaryCardProps {
  salary?: EmployeeSalary;
  onAdd?: () => void;
  onEdit?: (salary: EmployeeSalary) => void;
  canEdit?: boolean;
}

export default function EmployeeSalaryCard({
  salary,
  onAdd,
  onEdit,
  canEdit = false,
}: EmployeeSalaryCardProps) {
  const canShowAction = canEdit && (salary ? !!onEdit : !!onAdd);

  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">
              Current Monthly Salary
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-3xl">
              Rs. {salary ? salary.monthlySalary.toLocaleString() : "0"}
            </h2>

            {salary && (
              <p className="mt-1 text-sm text-slate-500">
                Effective from{" "}
                {new Date(salary.effectiveFrom).toLocaleDateString()}
              </p>
            )}
          </div>

          {canShowAction && (
            <Button
              variant={salary ? "secondary" : "primary"}
              onClick={salary ? () => onEdit?.(salary) : onAdd}
            >
              {salary ? (
                <>
                  <Pencil />
                  Correct
                </>
              ) : (
                <>
                  <Plus />
                  Add Salary
                </>
              )}
            </Button>
          )}
        </div>

        {salary?.reason && (
          <div className="mt-4">
            <Badge tone="neutral" className="capitalize">
              {salary.reason.replaceAll("_", " ")}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
