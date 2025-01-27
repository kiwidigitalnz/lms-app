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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserPlus, Pencil, Trash2, Users } from "lucide-react";
import { ContactForm } from "./ContactForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type Contact = {
  id: string;
  first_name: string;
  last_name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  contact_type: "landlord" | "property_manager" | "supplier" | "tenant" | "other";
};

export function ContactList() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactType, setContactType] = useState<Contact["contact_type"] | "">("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts", searchQuery, contactType],
    queryFn: async () => {
      let query = supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%`);
      }

      if (contactType) {
        query = query.eq("contact_type", contactType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Contact[];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("contacts").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading contacts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select 
            value={contactType} 
            onValueChange={(value: Contact["contact_type"] | "") => setContactType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All contact types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All contact types</SelectItem>
              <SelectItem value="landlord">Landlord</SelectItem>
              <SelectItem value="property_manager">Property Manager</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="tenant">Tenant</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts?.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">
                  {contact.first_name} {contact.last_name}
                </TableCell>
                <TableCell className="capitalize">
                  {contact.contact_type.replace(/_/g, " ")}
                </TableCell>
                <TableCell>{contact.company || "-"}</TableCell>
                <TableCell>{contact.email || "-"}</TableCell>
                <TableCell>{contact.phone || contact.mobile || "-"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingContact(contact)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Contact</DialogTitle>
                      </DialogHeader>
                      <ContactForm
                        mode="edit"
                        initialData={contact}
                        onSuccess={() => setEditingContact(null)}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {contacts?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Users className="h-8 w-8" />
                    <p>No contacts found</p>
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