import type { StatusTone } from "@/utils/ui/statusColors";

export type FeatureStatus = {
  label: string;
  tone: StatusTone;
};

// Single place to set a feature's status badge in the sidebar and dashboard.
// Change the label to "In progress" (tone "warning") or remove the status
// from the feature entirely once it is no longer new.
export const BANK_FEATURE_STATUS: FeatureStatus = {
  label: "In progress",
  tone: "warning",
};
