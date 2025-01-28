import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateNew: () => void;
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="p-4 text-center text-sm text-muted-foreground">
      No contacts found.
      <div className="mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCreateNew}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Contact
        </Button>
      </div>
    </div>
  );
}