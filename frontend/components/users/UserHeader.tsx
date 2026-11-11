"use client";

import { Plus, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export default function UserHeader({ onAddUser }: { onAddUser: () => void }) {
  return (
    <PageHeader
      title="Users"
      icon={UsersRound}
      meta={<Badge tone="info">Access control</Badge>}
      description="Manage accounts, roles, and access status."
      actions={
        <Button onClick={onAddUser}>
          <Plus /> Add user
        </Button>
      }
    />
  );
}
