import { PestUpload } from "@/components/pest-detect/upload";
import HistoricPests from "@/components/pest-detect/HistoricPests";

export default function PestAnalysisPage() {
  return (
    <div>
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Pest Detection & Analysis
          </h2>
        </div>
        <div className="w-full p-4 border rounded">
          <p className="text-lg mb-4">
            Upload an image to identify pests and get detailed mitigation
            strategies and control measures
          </p>
          <PestUpload />
        </div>
        <div>
          <HistoricPests />
        </div>
      </div>
    </div>
  );
}
