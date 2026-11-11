import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface EmployeeSectionProps {
  title: string;
  /** Kept for API compatibility; sections no longer render a colored accent. */
  color?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}

export default function EmployeeSection({
  title,
  icon,
  children,
}: EmployeeSectionProps) {
  return (
    <Card>
      <CardHeader title={title} icon={icon} />

      <CardContent>{children}</CardContent>
    </Card>
  );
}
