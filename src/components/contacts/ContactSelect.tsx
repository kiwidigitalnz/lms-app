import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/components/ui/command";
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContactForm } from "../ContactForm";
import { Contact, ContactSelectProps } from "@/types/contact";
import { ContactItem } from "./contact-select/ContactItem";
import { EmptyState } from "./contact-select/EmptyState";
import { CreateNewButton } from "./contact-select/CreateNewButton";
import { filterContacts, getContactLabel } from "./utils/contactUtils";

export function ContactSelect({ 
  value, 
  onChange, 
  placeholder = "Search contacts...",
  contactType 
}: ContactSelectProps) {
  const [open, setOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [search, setSearch] = useState("");

  const { data: contacts = [], isLoading } = useQuery({
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
      return data || [];
    },
  });

  const filteredContacts = filterContacts(contacts, search);
  const selectedContact = contacts.find((contact) => contact.id === value);

  const handleSelect = (contactId: string) => {
    if (contactId === "create-new") {
      setShowCreateDialog(true);
      setOpen(false);
    } else {
      onChange(contactId);
      setOpen(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
  };

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-start">
        Loading contacts...
      </Button>
    );
  }

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
            {selectedContact ? (
              <span className="truncate">
                {getContactLabel(selectedContact)}
              </span>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          {contacts.length === 0 ? (
            <EmptyState onCreateNew={() => handleSelect("create-new")} />
          ) : (
            <Command>
              <CommandInput 
                placeholder="Search contacts..." 
                value={search}
                onValueChange={setSearch}
              />
              <CommandGroup>
                {filteredContacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    isSelected={contact.id === value}
                    onSelect={handleSelect}
                  />
                ))}
                <CreateNewButton onSelect={() => handleSelect("create-new")} />
              </CommandGroup>
              {filteredContacts.length === 0 && (
                <CommandEmpty className="py-6 text-center text-sm">
                  <EmptyState onCreateNew={() => handleSelect("create-new")} />
                </CommandEmpty>
              )}
            </Command>
          )}
        </PopoverContent>
      </Popover>

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