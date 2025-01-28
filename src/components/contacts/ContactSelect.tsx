import { useState } from "react";
import { ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContactForm } from "./ContactForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContactSelectList } from "./ContactSelectList";
import { SelectedContacts } from "./SelectedContacts";

interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  company: string | null;
  contact_type: "landlord" | "property_manager" | "supplier" | "tenant" | "other";
}

interface ContactSelectProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  contactType?: "landlord" | "property_manager" | "supplier" | "tenant" | "other";
}

export function ContactSelect({ 
  value = [], 
  onChange, 
  placeholder = "Select contact...",
  contactType
}: ContactSelectProps) {
  const [open, setOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["contacts", contactType],
    queryFn: async () => {
      console.log("Fetching contacts...");
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user);
      
      if (!user) throw new Error("No user found");

      let query = supabase
        .from("contacts")
        .select("id, first_name, last_name, company, contact_type")
        .eq("tenant_id", user.id);

      if (contactType) {
        query = query.eq("contact_type", contactType);
      }

      const { data: contacts, error } = await query;
      
      if (error) {
        console.error("Error fetching contacts:", error);
        throw error;
      }

      console.log("Fetched contacts:", contacts);
      return contacts as Contact[];
    },
    enabled: open,
  });

  const contacts = data || [];
  const selectedContacts = contacts.filter((contact) => value.includes(contact.id));

  const handleSelect = (contactId: string) => {
    console.log("Selecting contact:", contactId);
    const newValue = value.includes(contactId)
      ? value.filter(id => id !== contactId)
      : [...value, contactId];
    onChange(newValue);
    setOpen(false);
  };

  const removeContact = (contactId: string) => {
    onChange(value.filter(id => id !== contactId));
  };

  const handleCreateClick = () => {
    console.log("Opening create dialog");
    setIsCreateOpen(true);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              ) : selectedContacts.length > 0 ? (
                <span className="truncate">
                  {`${selectedContacts.length} contact${selectedContacts.length === 1 ? '' : 's'} selected`}
                </span>
              ) : (
                placeholder
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <ContactSelectList
              contacts={contacts}
              selectedIds={value}
              isLoading={isLoading}
              error={error as Error}
              searchTerm={search}
              onSearchChange={setSearch}
              onSelect={handleSelect}
              onCreateClick={handleCreateClick}
            />
          </PopoverContent>
        </Popover>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm 
              onSuccess={() => {
                setIsCreateOpen(false);
                refetch();
              }}
              defaultContactType={contactType}
            />
          </DialogContent>
        </Dialog>
      </div>

      {selectedContacts.length > 0 && (
        <SelectedContacts
          contacts={selectedContacts}
          onRemove={removeContact}
        />
      )}
    </div>
  );
}