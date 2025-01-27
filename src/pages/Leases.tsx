import { AppLayout } from "@/components/layout/AppLayout";
import { LeaseList } from "@/components/dashboard/LeaseList";

const Leases = () => {
  return (
    <AppLayout 
      title="Leases" 
      description="Manage your lease agreements"
    >
      <LeaseList />
    </AppLayout>
  );
};

export default Leases;