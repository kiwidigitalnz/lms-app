import { Check, Loader2, Plus } from "lucide-react";
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
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelect: (contactId: string) => void;
  onCreateClick: () => void;
}

export function ContactSelectList({
  contacts,
  selectedIds,
  isLoading,
  error,
  searchTerm,
  onSearchChange,
  onSelect,
  onCreateClick,
}: ContactSelectListProps) {
  const getContactLabel = (contact: Contact) => {
    const name = `${contact.first_name} ${contact.last_name || ""}`.trim();
    return contact.company ? `${name} (${contact.company})` : name;
  };

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    const search = searchTerm.toLowerCase();
    const firstName = contact.first_name.toLowerCase();
    const lastName = (contact.last_name || "").toLowerCase();
    const company = (contact.company || "").toLowerCase();
    
    return firstName.includes(search) || 
           lastName.includes(search) || 
           company.includes(search);
  });

  return (
    <Command shouldFilter={false}> {/* Disable built-in filtering as we handle it manually */}
      <CommandInput 
        placeholder="Search contacts..." 
        value={searchTerm}
        onValueChange={onSearchChange}
      />
      <CommandList>
        {isLoading ? (
          <div className="py-6 text-center text-sm">
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            <p className="mt-2">Loading contacts...</p>
          </div>
        ) : error ? (
          <div className="py-6 text-center text-sm text-destructive">
            Error loading contacts. Please try again.
          </div>
        ) : filteredContacts.length === 0 ? (
          <CommandEmpty className="py-6 text-center text-sm">
            No contacts found.
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onCreateClick}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Contact
              </Button>
            </div>
          </CommandEmpty>
        ) : (
          <CommandGroup>
            {filteredContacts.map((contact) => {
              const label = getContactLabel(contact);
              return (
                <CommandItem
                  key={contact.id}
                  onSelect={() => onSelect(contact.id)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedIds.includes(contact.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}