// app/dashboard/locations/page.tsx

import CreateLocationForm from "@/components/locations/CreateLocationForm";

import LocationList from "@/components/locations/LocationList";

export default function LocationsPage() {
  return (
    <div className="space-y-6 p-6">
      <LocationList />
    </div>
  );
}
