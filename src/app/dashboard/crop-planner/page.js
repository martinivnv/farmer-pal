// app/dashboard/crop/page.js
import CropDashboardClient from "@/components/crop/CropDashboardClient";
import HistoricCropPlanningData from "@/components/crop/HistoricCropPlanningData";

export const metadata = {
  title: "Crop Location Planner - Farmer Pal",
  description:
    "Plan your crop locations using AI and environmental data analysis",
};

export default async function CropDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Crop Location Planner</h1>
      <CropDashboardClient />
      <HistoricCropPlanningData />
    </div>
  );
}
