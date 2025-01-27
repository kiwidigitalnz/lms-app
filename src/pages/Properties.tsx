import { AppLayout } from "@/components/layout/AppLayout";
import { PropertyList } from "@/components/properties/PropertyList";

const Properties = () => {
  return (
    <AppLayout 
      title="Properties" 
      description="Manage your property portfolio"
    >
      <PropertyList />
    </AppLayout>
  );
};

export default Properties;