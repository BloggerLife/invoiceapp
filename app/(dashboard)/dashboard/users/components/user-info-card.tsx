import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Mail,
  Phone,
  Briefcase,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { UserDetailsResponse } from "@/types/user";

interface UserInfoCardProps {
  user: UserDetailsResponse["user"];
}

export function UserInfoCard({ user }: UserInfoCardProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "SERVICE_PROVIDER":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            />
            <AvatarFallback>
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.phone}</span>
            </div>
            {user.jobTitle && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.jobTitle}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {user.role.replace("_", " ")}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {user.status ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">
                {user.status ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {user.isVerified ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">
                {user.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>

            {user.subscription && (
              <div>
                <Badge variant="outline" className="mr-2">
                  {user.subscription.plan}
                </Badge>
                <Badge
                  variant={
                    user.subscription.status === "ACTIVE"
                      ? "default"
                      : "secondary"
                  }
                >
                  {user.subscription.status}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
