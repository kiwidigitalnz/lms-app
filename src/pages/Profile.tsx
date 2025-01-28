import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { SecuritySection } from "@/components/profile/SecuritySection";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID available");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error("Profile not found");
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  });

  const { data: userRole } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID available");

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user role:", error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  });

  if (isLoading) {
    return (
      <AppLayout title="Profile" description="Loading...">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div>Loading profile...</div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Profile" description="Error">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div>Error loading profile. Please try refreshing the page.</div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title="Profile" 
      description="Manage your profile settings"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="overflow-hidden">
          <ProfileHeader 
            firstName={profile?.first_name || ""}
            lastName={profile?.last_name || ""}
            jobTitle={profile?.job_title}
            company={profile?.company}
            avatarUrl={profile?.avatar_url}
          />
          
          <CardContent className="pt-16 pb-6">
            {isEditing ? (
              <ProfileForm
                initialData={{
                  first_name: profile?.first_name || "",
                  last_name: profile?.last_name || "",
                  company: profile?.company || "",
                  job_title: profile?.job_title || "",
                  mobile: profile?.mobile || "",
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-6">
                <ProfileInfo 
                  firstName={profile?.first_name}
                  lastName={profile?.last_name}
                  email={profile?.email || user?.email}
                  role={userRole?.role}
                  createdAt={profile?.created_at}
                  company={profile?.company}
                  jobTitle={profile?.job_title}
                  mobile={profile?.mobile}
                />
                
                <Separator />
                
                <div>
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <SecuritySection />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;