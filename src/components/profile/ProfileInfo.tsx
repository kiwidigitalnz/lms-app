import { Mail, Shield, Clock, Briefcase } from "lucide-react";
import { format } from "date-fns";

interface ProfileInfoProps {
  email?: string;
  role?: string;
  createdAt?: string;
  company?: string;
  jobTitle?: string;
  mobile?: string;
}

export function ProfileInfo({ 
  email, 
  role, 
  createdAt, 
  company,
  jobTitle,
  mobile
}: ProfileInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{jobTitle || "No job title set"}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {company || "No company set"}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-2 justify-end">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">
                {role?.replace('_', ' ') || "No role assigned"}
              </span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Member since {createdAt ? format(new Date(createdAt), 'PPP') : "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}