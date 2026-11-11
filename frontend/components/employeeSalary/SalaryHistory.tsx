"use client";

import { Pencil, CalendarDays, History } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import type { EmployeeSalary } from "@/types/employeeSalary";

interface SalaryHistoryProps {
  salaryHistory: EmployeeSalary[];
  onEdit?: (salary: EmployeeSalary) => void;
  canEdit?: boolean;
}

export default function SalaryHistory({
  salaryHistory,
  onEdit,
  canEdit = false,
}: SalaryHistoryProps) {
  return (
    <Card>
      <CardHeader
        icon={History}
        title="Salary History"
        description={`${salaryHistory.length} record${salaryHistory.length === 1 ? "" : "s"}`}
      />

      <CardContent>
        {salaryHistory.length === 0 ? (
          <EmptyState
            title="No salary history available."
            className="border-slate-200 py-8"
          />
        ) : (
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200/80">
            {salaryHistory.map((salary) => (
              <li
                key={salary._id}
                className="p-4 transition-colors hover:bg-slate-50/60"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays className="size-3.5" />
                      <span>
                        Effective from{" "}
                        {new Date(salary.effectiveFrom).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900 tabular-nums">
                      Rs. {salary.monthlySalary.toLocaleString()}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge tone="neutral" className="capitalize">
                        {salary.reason.replaceAll("_", " ")}
                      </Badge>

                      {salary.notes && (
                        <span className="text-xs text-slate-500">
                          {salary.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  {canEdit && onEdit && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(salary)}
                      className="self-start"
                    >
                      <Pencil />
                      Correct
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
