"use client";

import { Gift, Plus } from "lucide-react";

import BonusExportButton from "./BonusExportButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

import type { Bonus, BonusFilters } from "@/types/bonus";

interface BonusHeaderProps {
  bonuses: Bonus[];
  filters: BonusFilters;
  canEdit: boolean;
  onAdd: () => void;
}

export default function BonusHeader({
  bonuses,
  filters,
  canEdit,
  onAdd,
}: BonusHeaderProps) {
  return (
    <PageHeader
      title="Employee Bonuses"
      description="Manage employee bonuses, payment status, and bonus history."
      icon={Gift}
      meta={
        <Badge className="hidden sm:inline-flex">
          {bonuses.length} {bonuses.length === 1 ? "Record" : "Records"}
        </Badge>
      }
      actions={
        <>
          <BonusExportButton bonuses={bonuses} filters={filters} />

          {canEdit && (
            <Button onClick={onAdd}>
              <Plus />
              Add Bonus
            </Button>
          )}
        </>
      }
    />
  );
}
