"use client";

import { Gavel, Plus } from "lucide-react";

import FineExportButton from "@/components/fine/FineExportButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

import type { Fine, FineFilters } from "@/types/fine";

interface FineHeaderProps {
  fines: Fine[];
  filters: FineFilters;
  canEdit: boolean;
  onAdd: () => void;
}

export default function FineHeader({
  fines,
  filters,
  canEdit,
  onAdd,
}: FineHeaderProps) {
  return (
    <PageHeader
      title="Employee Fines"
      description="Record, monitor, and manage employee fines and their recovery status."
      icon={Gavel}
      meta={
        <Badge className="hidden sm:inline-flex">
          {fines.length} {fines.length === 1 ? "Record" : "Records"}
        </Badge>
      }
      actions={
        <>
          <FineExportButton fines={fines} filters={filters} />

          {canEdit && (
            <Button onClick={onAdd}>
              <Plus />
              Add Fine
            </Button>
          )}
        </>
      }
    />
  );
}
