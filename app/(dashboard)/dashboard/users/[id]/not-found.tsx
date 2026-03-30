import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UserNotFound() {
  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            User Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The user you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild className="w-full">
            <Link href="/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
