import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  company: string | null;
}

interface ContactSelectListProps {
  contacts: Contact[];
  selectedIds: string[];
  onSelect: (contactId: string) => void;
  onCreateNew: () => void;
  contactType?: "landlord" | "property_manager" | "supplier" | "tenant" | "other";
}

export function ContactSelectList({
  contacts,
  selectedIds,
  onSelect,
  onCreateNew,
  contactType,
}: ContactSelectListProps) {
  const [search, setSearch] = useState("");

  const getContactLabel = (contact: Contact) => {
    const name = `${contact.first_name} ${contact.last_name || ""}`.trim();
    return contact.company ? `${name} (${contact.company})` : name;
  };

  const filteredContacts = contacts.filter(contact => {
    const searchTerm = search.toLowerCase();
    const firstName = contact.first_name.toLowerCase();
    const lastName = (contact.last_name || "").toLowerCase();
    const company = (contact.company || "").toLowerCase();
    
    return firstName.includes(searchTerm) || 
           lastName.includes(searchTerm) || 
           company.includes(searchTerm);
  });

  const handleSelect = (value: string) => {
    if (value === "create-new") {
      onCreateNew();
    } else {
      onSelect(value);
    }
  };

  return (
    <Command shouldFilter={false}>
      <CommandInput 
        placeholder="Search contacts..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty className="py-6 text-center text-sm">
          No contacts found.
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCreateNew();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Contact
            </Button>
          </div>
        </CommandEmpty>
        <CommandGroup>
          {filteredContacts.map((contact) => (
            <CommandItem
              key={contact.id}
              value={contact.id}
              onSelect={handleSelect}
              className="cursor-pointer"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedIds.includes(contact.id) ? "opacity-100" : "opacity-0"
                )}
              />
              {getContactLabel(contact)}
            </CommandItem>
          ))}
          {filteredContacts.length > 0 && (
            <CommandItem
              value="create-new"
              onSelect={handleSelect}
              className="cursor-pointer border-t"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Contact
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}