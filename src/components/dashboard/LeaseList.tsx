import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { FileText } from "lucide-react";

export function LeaseList() {
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

  if (isLoading) {
    return <div>Loading leases...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right">Rent Amount</TableHead>
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
            </TableRow>
          ))}
          {leases?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <FileText className="h-8 w-8" />
                  <p>No leases found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}