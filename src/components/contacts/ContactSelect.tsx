import { useState } from "react";
import { Check, ChevronsUpDown, Plus, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "./ContactForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  contactType?: "landlord" | "property_manager" | "supplier" | "tenant" | "other";
  placeholder?: string;
}

export function ContactSelect({ 
  value = [], 
  onChange, 
  contactType,
  placeholder = "Select contact..."
}: ContactSelectProps) {
  const [open, setOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["contacts", contactType],
    queryFn: async () => {
      let query = supabase
        .from("contacts")
        .select("id, first_name, last_name, company, contact_type")
        .order("first_name", { ascending: true });

      if (contactType) {
        query = query.eq("contact_type", contactType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Contact[];
    },
  });

  const contacts = data || [];
  const selectedContacts = contacts.filter((contact) => value.includes(contact.id));

  const getContactLabel = (contact: Contact) => {
    const name = `${contact.first_name} ${contact.last_name || ""}`.trim();
    return contact.company ? `${name} (${contact.company})` : name;
  };

  const handleSelect = (contactId: string) => {
    setOpen(false); // Close popover after selection
    const newValue = value.includes(contactId)
      ? value.filter(id => id !== contactId)
      : [...value, contactId];
    onChange(newValue);
  };

  const removeContact = (contactId: string) => {
    onChange(value.filter(id => id !== contactId));
  };

  const renderCommandContent = () => {
    if (isLoading) {
      return (
        <div className="py-6 text-center text-sm">
          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          <p className="mt-2">Loading contacts...</p>
        </div>
      );
    }

    if (!contacts || contacts.length === 0) {
      return (
        <CommandEmpty className="py-6 text-center text-sm">
          No contacts found.
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Contact
            </Button>
          </div>
        </CommandEmpty>
      );
    }

    return (
      <CommandGroup>
        {contacts.map((contact) => (
          <CommandItem
            key={contact.id}
            value={contact.id}
            onSelect={() => handleSelect(contact.id)}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                value.includes(contact.id) ? "opacity-100" : "opacity-0"
              )}
            />
            {getContactLabel(contact)}
          </CommandItem>
        ))}
      </CommandGroup>
    );
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
          <PopoverContent className="w-[400px] p-0">
            <Command>
              <CommandInput placeholder="Search contacts..." />
              <CommandList>
                {renderCommandContent()}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm 
              onSuccess={() => {
                setIsCreateOpen(false);
              }}
              initialData={contactType ? { contact_type: contactType } : undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      {selectedContacts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedContacts.map((contact) => (
            <Badge key={contact.id} variant="secondary">
              {getContactLabel(contact)}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => removeContact(contact.id)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}