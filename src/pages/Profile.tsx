import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, Building2, Mail, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { format } from "date-fns";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const initials = `${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`;

  return (
    <AppLayout 
      title="Profile" 
      description="Manage your profile settings"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <ProfileAvatar 
                avatarUrl={profile?.avatar_url}
                initials={initials}
                size="lg"
                editable
              />
            </div>

            {isEditing ? (
              <ProfileForm
                initialData={{
                  first_name: profile?.first_name || "",
                  last_name: profile?.last_name || "",
                  company: profile?.company || "",
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-6">
                <div className="grid gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="text-sm">{user?.email}</p>
                </div>
                
                <div className="grid gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" />
                    Name
                  </div>
                  <p className="text-sm">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                </div>

                <div className="grid gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    Company
                  </div>
                  <p className="text-sm">
                    {profile?.company || "Not set"}
                  </p>
                </div>

                <div className="grid gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Role
                  </div>
                  <p className="text-sm capitalize">
                    {userRole?.role?.replace('_', ' ') || "No role assigned"}
                  </p>
                </div>

                <div className="grid gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Member Since
                  </div>
                  <p className="text-sm">
                    {profile?.created_at ? format(new Date(profile.created_at), 'PPP') : "Unknown"}
                  </p>
                </div>

                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;