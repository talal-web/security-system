"use client";

import { ClipboardMinus, Plus } from "lucide-react";

import DeductionExportButton from "./DeductionExportButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

import type { Deduction, DeductionFilters } from "@/types/deduction";

interface DeductionHeaderProps {
  deductions: Deduction[];
  filters: DeductionFilters;
  canEdit: boolean;
  onAdd: () => void;
}

export default function DeductionHeader({
  deductions,
  filters,
  canEdit,
  onAdd,
}: DeductionHeaderProps) {
  return (
    <PageHeader
      title="Employee Deductions"
      description="Manage employee deductions, repayments, and outstanding balances."
      icon={ClipboardMinus}
      meta={
        <Badge className="hidden sm:inline-flex">
          {deductions.length} {deductions.length === 1 ? "Record" : "Records"}
        </Badge>
      }
      actions={
        <>
          <DeductionExportButton deductions={deductions} filters={filters} />

          {canEdit && (
            <Button onClick={onAdd}>
              <Plus />
              Add Deduction
            </Button>
          )}
        </>
      }
    />
  );
}
