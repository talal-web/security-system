"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";

import AreaCreateModal from "@/components/area/AreaModal";
import AreaList from "@/components/area/AreaList";
import { Button } from "@/components/ui/Button";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export default function AreaPage() {
  const [open, setOpen] = useState(false);

  return (
    <PageContainer>
      {/* Page header */}
      <PageHeader
        title="Areas"
        icon={MapPin}
        description="Manage your operational areas and locations."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus />
            Add Area
          </Button>
        }
      />

      {/* Main content */}
      <section className="min-w-0">
        <AreaList />
      </section>

      {/* Create modal */}
      <AreaCreateModal open={open} onClose={() => setOpen(false)} />
    </PageContainer>
  );
}
