import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, Building2, Mail, Clock, Briefcase, Phone, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SecurityForm } from "@/components/profile/SecurityForm";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: userRole } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const initials = `${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`;

  return (
    <AppLayout 
      title="Profile" 
      description="Manage your profile settings"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Card */}
        <Card className="overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="absolute -bottom-12 left-6">
              <ProfileAvatar 
                avatarUrl={profile?.avatar_url}
                initials={initials}
                size="lg"
                editable
              />
            </div>
          </div>
          <CardContent className="pt-16 pb-6">
            {isEditing ? (
              <ProfileForm
                initialData={{
                  first_name: profile?.first_name || "",
                  last_name: profile?.last_name || "",
                  company: profile?.company || "",
                  job_title: profile?.job_title || "",
                  mobile: profile?.mobile || "",
                  email: profile?.email || "",
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{profile?.job_title || "No job title set"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile?.company || "No company set"}
                  </p>
                </div>
                
                <Separator />
                
                <div className="grid gap-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profile?.email || user?.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profile?.mobile || "No mobile number set"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">
                      {userRole?.role?.replace('_', ' ') || "No role assigned"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Member since {profile?.created_at ? format(new Date(profile.created_at), 'PPP') : "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card>
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;