import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SecurityForm } from "@/components/profile/SecurityForm";

export function SecuritySection() {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const { toast } = useToast();

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;

      toast({
        title: "Success",
        description: "Please check your email to confirm the change",
      });
      setIsEditingEmail(false);
      setNewEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">Security Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your email and password
          </p>
        </div>
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>

      <Separator />

      {/* Email Update Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="font-medium">Email Address</h4>
          <p className="text-sm text-muted-foreground">
            Change your email address
          </p>
        </div>

        {isEditingEmail ? (
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium">New Email</label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save Email</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditingEmail(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setIsEditingEmail(true)}
          >
            Change Email
          </Button>
        )}
      </div>

      <Separator />

      {/* Password Update Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="font-medium">Password</h4>
          <p className="text-sm text-muted-foreground">
            Change your password
          </p>
        </div>
        <SecurityForm />
      </div>
    </div>
  );
}