import { Plus } from "lucide-react";
import { CommandItem } from "@/components/ui/command";

interface CreateNewButtonProps {
  onSelect: () => void;
}

export function CreateNewButton({ onSelect }: CreateNewButtonProps) {
  return (
    <CommandItem
      value="create-new"
      onSelect={onSelect}
      className="cursor-pointer border-t"
    >
      <Plus className="mr-2 h-4 w-4" />
      Create New Contact
    </CommandItem>
  );
}