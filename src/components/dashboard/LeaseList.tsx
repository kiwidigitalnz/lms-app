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
import { format } from "date-fns";
import { FileText, Plus, Pencil, Trash2, TrendingUp } from "lucide-react";
import { LeaseForm } from "./LeaseForm";
import { RentReviewForm } from "./RentReviewForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export function LeaseList() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLease, setEditingLease] = useState<any>(null);
  const [reviewingLease, setReviewingLease] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leases, isLoading } = useQuery({
    queryKey: ["leases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leases")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("leases").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Rental agreement deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["leases"] });
    } catch (error) {
      console.error("Error deleting lease:", error);
      toast({
        title: "Error",
        description: "Failed to delete rental agreement",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading rental agreements...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              Add Rental Agreement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Rental Agreement</DialogTitle>
            </DialogHeader>
            <LeaseForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Rent Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leases?.map((lease) => (
              <TableRow key={lease.id}>
                <TableCell className="font-medium">{lease.property_name}</TableCell>
                <TableCell className="capitalize">{lease.lease_type}</TableCell>
                <TableCell>{format(new Date(lease.start_date), "PP")}</TableCell>
                <TableCell>{format(new Date(lease.end_date), "PP")}</TableCell>
                <TableCell className="text-right">
                  ${lease.rent_amount.toLocaleString()}
                  <span className="text-muted-foreground text-sm">
                    /{lease.payment_frequency}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingLease(lease)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Rental Agreement</DialogTitle>
                      </DialogHeader>
                      <LeaseForm
                        mode="edit"
                        initialData={lease}
                        onSuccess={() => setEditingLease(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setReviewingLease(lease)}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Record Rent Review</DialogTitle>
                      </DialogHeader>
                      <RentReviewForm
                        leaseId={lease.id}
                        currentRent={lease.rent_amount}
                        onSuccess={() => setReviewingLease(null)}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(lease.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {leases?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="h-8 w-8" />
                    <p>No rental agreements found</p>
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