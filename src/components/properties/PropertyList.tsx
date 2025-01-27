import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building, Plus, Pencil, Trash2, Image } from "lucide-react";
import { PropertyForm } from "./PropertyForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function PropertyList() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data: propertiesData, error: propertiesError } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (propertiesError) throw propertiesError;

      // Fetch images for each property
      const propertiesWithImages = await Promise.all(
        propertiesData.map(async (property) => {
          const { data: images, error: imagesError } = await supabase
            .from("property_images")
            .select("file_path")
            .eq("property_id", property.id);

          if (imagesError) throw imagesError;

          return {
            ...property,
            images: images || [],
          };
        })
      );

      return propertiesWithImages;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading properties...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <PropertyForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Floor Area</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties?.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {property.name}
                    {property.images?.length > 0 && (
                      <HoverCard>
                        <HoverCardTrigger>
                          <Image className="h-4 w-4 text-gray-500" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="grid grid-cols-2 gap-2">
                            {property.images.slice(0, 4).map((image: any, index: number) => (
                              <img
                                key={index}
                                src={`${supabase.storage.from('property-images').getPublicUrl(image.file_path).data.publicUrl}`}
                                alt={`Property ${index + 1}`}
                                className="h-24 w-full object-cover rounded"
                              />
                            ))}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{property.property_type}</TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell>{property.ownership_status}</TableCell>
                <TableCell className="text-right">
                  {property.floor_area ? `${property.floor_area.toLocaleString()} sq ft` : "-"}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProperty(property)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Edit Property</DialogTitle>
                      </DialogHeader>
                      <PropertyForm
                        mode="edit"
                        initialData={property}
                        onSuccess={() => setEditingProperty(null)}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {properties?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Building className="h-8 w-8" />
                    <p>No properties found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}