import { useState } from "react";

import { MapPin } from "lucide-react";

import { useCreateLocation } from "@/hooks/location/useLocation";
import { useSelectedArea } from "@/components/area/AreaContext";
import AreaSelect from "@/components/area/AreaSelect";
import SectorSelect from "@/components/sectors/SectorSelect";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";

const labelClasses = "mb-1.5 block text-sm font-medium text-slate-700";

const inputClasses =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15";

const selectWrapperClasses =
  "flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-card transition-[border-color,box-shadow] hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-500/15";

export default function CreateLocationForm() {
  const { selectedAreaId } = useSelectedArea();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [sectorSelection, setSectorSelection] = useState({
    areaId: selectedAreaId,
    sectorId: "",
  });
  const sector =
    sectorSelection.areaId === selectedAreaId ? sectorSelection.sectorId : "";

  const { mutate, isPending, isError, error } = useCreateLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAreaId || !sector || !name.trim()) return;

    mutate(
      {
        name: name.trim(),
        address: address.trim(),
        area: selectedAreaId,
        sector,
      },
      {
        onSuccess: () => {
          setName("");
          setAddress("");
          setSectorSelection({ areaId: selectedAreaId, sectorId: "" });
        },
      },
    );
  };

  return (
    <Card className="mx-auto max-w-2xl">
      {/* HEADER */}
      <CardHeader
        title="Create Location"
        description="Add a new location to your system"
        icon={MapPin}
      />

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {/* ERROR */}
          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">
              {error.message}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* NAME */}
            <div className="sm:col-span-2">
              <label className={labelClasses}>Location Name *</label>

              <input
                type="text"
                placeholder="e.g. Main Office"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
                required
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className={labelClasses}>Address</label>

              <input
                type="text"
                placeholder="Street / Area"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* SECTOR */}
            <div>
              <label className={labelClasses}>Area *</label>

              <AreaSelect
                showLabel={false}
                value={selectedAreaId ?? ""}
                useGlobalSelection
                disabled={isPending}
                wrapperClassName={selectWrapperClasses}
                required
              />
            </div>

            <div>
              <label className={labelClasses}>Sector *</label>

              <SectorSelect
                showLabel={false}
                areaId={selectedAreaId ?? undefined}
                value={sector}
                onChange={(e) =>
                  setSectorSelection({
                    areaId: selectedAreaId,
                    sectorId: e.target.value,
                  })
                }
                wrapperClassName={selectWrapperClasses}
                required
                disabled={!selectedAreaId || isPending}
              />
            </div>
          </div>
        </CardContent>

        {/* SUBMIT */}
        <CardFooter>
          <Button
            type="submit"
            disabled={isPending || !selectedAreaId || !name.trim() || !sector}
            className="w-full sm:w-auto"
          >
            {isPending ? "Creating Location..." : "Create Location"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
