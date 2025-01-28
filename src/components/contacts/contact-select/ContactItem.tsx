import { Check } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { Contact } from "@/types/contact";
import { getContactLabel } from "../utils/contactUtils";

interface ContactItemProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ContactItem({ contact, isSelected, onSelect }: ContactItemProps) {
  return (
    <CommandItem
      key={contact.id}
      value={contact.id}
      onSelect={() => onSelect(contact.id)}
      className="cursor-pointer"
    >
      <Check
        className={`mr-2 h-4 w-4 ${
          isSelected ? "opacity-100" : "opacity-0"
        }`}
      />
      {getContactLabel(contact)}
    </CommandItem>
  );
}