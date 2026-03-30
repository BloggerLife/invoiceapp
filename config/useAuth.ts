import { getServerSession, Session } from "next-auth";
import { authOptions } from "./auth";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  image?: string;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const session: Session | null = await getServerSession(authOptions);
  if (session?.user) {
    const { id, email, role, name, image } = session.user as AuthUser;
    return { id, email, role, name, image };
  }

  return null;
}
