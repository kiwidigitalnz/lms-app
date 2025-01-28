import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
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
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: contacts = [], refetch } = useQuery({
    queryKey: ["contacts", contactType],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let query = supabase
        .from("contacts")
        .select("id, first_name, last_name, company, contact_type")
        .eq("tenant_id", user.id);

      if (contactType) {
        query = query.eq("contact_type", contactType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Contact[];
    },
  });

  const selectedContacts = contacts.filter((contact) => value.includes(contact.id));

  const handleSelect = (contactId: string) => {
    const newValue = value.includes(contactId)
      ? value.filter(id => id !== contactId)
      : [...value, contactId];
    onChange(newValue);
  };

  const handleCreateSuccess = async () => {
    setShowCreateDialog(false);
    await refetch();
  };

  const handleCreateNew = () => {
    setOpen(false);
    setShowCreateDialog(true);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedContacts.length > 0 ? (
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
            onSelect={handleSelect}
            onCreateNew={handleCreateNew}
            contactType={contactType}
          />
        </PopoverContent>
      </Popover>

      {selectedContacts.length > 0 && (
        <SelectedContacts
          contacts={selectedContacts}
          onRemove={handleSelect}
        />
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <ContactForm 
            onSuccess={handleCreateSuccess}
            contact_type={contactType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}