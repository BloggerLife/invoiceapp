import { getUserById } from "@/actions/users";
import UserProfileForm from "@/components/Forms/UserProfileForm";
import { getAuthUser } from "@/config/useAuth";
import { Suspense } from "react";
import ProfileSettingsLoading from "./ProfileSettingsLoading";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSettingsLoading />}>
      <ProfileContent />
    </Suspense>
  );
}

async function ProfileContent() {
  const user = await getAuthUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const userDetails = await getUserById(user.id);

  const userProfile = {
    id: userDetails?.id ?? "",
    firstName: userDetails?.firstName ?? "",
    lastName: userDetails?.lastName ?? "",
    email: userDetails?.email ?? "",
    phone: userDetails?.phone ?? "",
    jobTitle: userDetails?.jobTitle ?? "",
    image: userDetails?.image ?? "",
  };

  return (
    <div>
      <UserProfileForm currentUser={userProfile} />
    </div>
  );
}
