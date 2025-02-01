import AlertsList from "@/components/alerts/AlertsList";

export default function AlertsPage() {
  return (
    <div>
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Farm Alerts & Notifications
          </h2>
        </div>

        <AlertsList />
      </div>
    </div>
  );
}
