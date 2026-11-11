"use client";

import { Plus, WalletCards } from "lucide-react";

import AdvanceExportButton from "@/components/advance/AdvanceExportButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

import type { Advance, AdvanceFilters } from "@/types/advance";

interface AdvanceHeaderProps {
  advances: Advance[];
  filters: AdvanceFilters;
  canEdit: boolean;
  onAdd: () => void;
}

export default function AdvanceHeader({
  advances,
  filters,
  canEdit,
  onAdd,
}: AdvanceHeaderProps) {
  return (
    <PageHeader
      title="Employee Advances"
      description="Manage employee advances, repayments, and outstanding balances."
      icon={WalletCards}
      meta={
        <Badge className="hidden sm:inline-flex">
          {advances.length} {advances.length === 1 ? "Record" : "Records"}
        </Badge>
      }
      actions={
        <>
          <AdvanceExportButton advances={advances} filters={filters} />

          {canEdit && (
            <Button onClick={onAdd}>
              <Plus />
              Add Advance
            </Button>
          )}
        </>
      }
    />
  );
}
