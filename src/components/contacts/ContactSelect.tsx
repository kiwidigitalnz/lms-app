import { useState } from "react";
import { ChevronsUpDown, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  contactType?: "landlord" | "property_manager" | "supplier" | "tenant" | "other";
}

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

  const filteredContacts = contacts.filter(contact => {
    if (!search) return true;
    const searchTerm = search.toLowerCase();
    const firstName = contact.first_name.toLowerCase();
    const lastName = (contact.last_name || "").toLowerCase();
    const company = (contact.company || "").toLowerCase();
    
    return firstName.includes(searchTerm) || 
           lastName.includes(searchTerm) || 
           company.includes(searchTerm);
  });

  const selectedContact = contacts.find((contact) => contact.id === value);

  const getContactLabel = (contact: Contact) => {
    const name = `${contact.first_name} ${contact.last_name || ""}`.trim();
    return contact.company ? `${name} (${contact.company})` : name;
  };

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
            <div className="p-4 text-center text-sm text-muted-foreground">
              No contacts found.
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSelect("create-new")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Contact
                </Button>
              </div>
            </div>
          ) : (
            <Command>
              <CommandInput 
                placeholder="Search contacts..." 
                value={search}
                onValueChange={setSearch}
              />
              <CommandGroup>
                {filteredContacts.map((contact) => (
                  <CommandItem
                    key={contact.id}
                    value={contact.id}
                    onSelect={() => handleSelect(contact.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        contact.id === value ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {getContactLabel(contact)}
                  </CommandItem>
                ))}
                <CommandItem
                  value="create-new"
                  onSelect={() => handleSelect("create-new")}
                  className="cursor-pointer border-t"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Contact
                </CommandItem>
              </CommandGroup>
              {filteredContacts.length === 0 && (
                <CommandEmpty className="py-6 text-center text-sm">
                  No contacts found.
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSelect("create-new")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Contact
                    </Button>
                  </div>
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