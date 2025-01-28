import { Mail, Shield, Clock, Briefcase, Phone } from "lucide-react";
import { format } from "date-fns";

interface ProfileInfoProps {
  email?: string;
  role?: string;
  createdAt?: string;
  company?: string;
  jobTitle?: string;
  mobile?: string;
  firstName?: string;
  lastName?: string;
}

export function ProfileInfo({ 
  email, 
  role, 
  createdAt, 
  company,
  jobTitle,
  mobile,
  firstName,
  lastName
}: ProfileInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left side - Name, Job Title, Company, Member Since */}
          <div className="space-y-1">
            {(firstName || lastName) && (
              <h3 className="text-lg font-semibold">
                {[firstName, lastName].filter(Boolean).join(" ")}
              </h3>
            )}
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{jobTitle || "No job title set"}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {company || "No company set"}
            </p>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Member since {createdAt ? format(new Date(createdAt), 'PPP') : "Unknown"}
              </span>
            </div>
          </div>

          {/* Right side - Role, Email, Mobile */}
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-2 justify-end">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground capitalize">
                {role?.replace('_', ' ') || "No role assigned"}
              </span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{mobile || "No mobile number set"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}