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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactForm } from "./ContactForm";

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
  onCreateSuccess: () => void;
  contactType?: "landlord" | "property_manager" | "supplier" | "tenant" | "other";
}

export function ContactSelectList({
  contacts,
  selectedIds,
  onSelect,
  onCreateSuccess,
  contactType,
}: ContactSelectListProps) {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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

  const handleCreateClick = () => {
    setIsCreateOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    onCreateSuccess();
  };

  return (
    <>
      <Command shouldFilter={false}>
        <CommandInput 
          placeholder="Search contacts..." 
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          {filteredContacts.length === 0 ? (
            <CommandEmpty className="py-6 text-center text-sm">
              No contacts found.
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCreateClick}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Contact
                </Button>
              </div>
            </CommandEmpty>
          ) : (
            <CommandGroup>
              {filteredContacts.map((contact) => (
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
                  {getContactLabel(contact)}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
    </>
  );
}