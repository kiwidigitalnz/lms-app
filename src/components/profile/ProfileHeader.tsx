import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Briefcase } from "lucide-react";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  jobTitle?: string;
  company?: string;
  avatarUrl?: string | null;
}

export function ProfileHeader({ 
  firstName, 
  lastName, 
  jobTitle, 
  company, 
  avatarUrl 
}: ProfileHeaderProps) {
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  
  return (
    <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="absolute -bottom-12 left-6">
        <ProfileAvatar 
          avatarUrl={avatarUrl}
          initials={initials}
          size="lg"
          editable
        />
      </div>
    </div>
  );
}