import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  company: string | null;
}

interface SelectedContactsProps {
  contacts: Contact[];
  onRemove: (contactId: string) => void;
}

export function SelectedContacts({ contacts, onRemove }: SelectedContactsProps) {
  const getContactLabel = (contact: Contact) => {
    const name = `${contact.first_name} ${contact.last_name || ""}`.trim();
    return contact.company ? `${name} (${contact.company})` : name;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {contacts.map((contact) => (
        <Badge key={contact.id} variant="secondary">
          {getContactLabel(contact)}
          <button
            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={() => onRemove(contact.id)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </button>
        </Badge>
      ))}
    </div>
  );
}