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
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("No user found during profile update");
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log("Starting profile update with data:", formData);
    console.log("User ID:", user.id);

    try {
      // Prepare update data with trimmed values
      const updateData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        company: formData.company.trim(),
        job_title: formData.job_title.trim(),
        mobile: formData.mobile.trim(),
        updated_at: new Date().toISOString(),
      };

      console.log("Sending update to Supabase:", updateData);

      const { error, data } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .maybeSingle();

      console.log("Supabase response:", { error, data });

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      if (!data) {
        console.error("No data returned from update operation");
        throw new Error('No data returned from update operation');
      }

      console.log("Profile updated successfully:", data);
      console.log("Invalidating query with key:", ["profile", user.id]);

      // Immediately invalidate and refetch profile data
      await queryClient.invalidateQueries({ 
        queryKey: ["profile", user.id],
        exact: true,
        refetchType: 'all'
      });
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      onCancel();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-1">
        <label className="text-sm font-medium">First Name</label>
        <Input
          value={formData.first_name}
          onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
          required
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Last Name</label>
        <Input
          value={formData.last_name}
          onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
          required
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}