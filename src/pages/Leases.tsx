import { FileText } from "lucide-react";
import { LeaseList } from "@/components/dashboard/LeaseList";

const Leases = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Lease Agreements</h1>
        <p className="text-muted-foreground">
          Track and manage your commercial and industrial property leases
        </p>
      </div>
      <LeaseList />
    </div>
  );
};

export default Leases;