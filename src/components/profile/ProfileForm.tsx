import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  company: string;
  job_title: string;
  mobile: string;
}

interface ProfileFormProps {
  initialData: ProfileFormData;
  onCancel: () => void;
}

export function ProfileForm({ initialData, onCancel }: ProfileFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onCancel();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-1">
        <label className="text-sm font-medium">First Name</label>
        <Input
          value={formData.first_name}
          onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Last Name</label>
        <Input
          value={formData.last_name}
          onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Company</label>
        <Input
          value={formData.company}
          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Job Title</label>
        <Input
          value={formData.job_title}
          onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Mobile</label>
        <Input
          value={formData.mobile}
          onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
          type="tel"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save Changes</Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}