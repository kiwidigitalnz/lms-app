import { Building } from "lucide-react";
import { PropertyList } from "@/components/properties/PropertyList";

const Properties = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Properties</h1>
        <p className="text-muted-foreground">
          Manage your commercial and industrial properties
        </p>
      </div>
      <PropertyList />
    </div>
  );
};

export default Properties;