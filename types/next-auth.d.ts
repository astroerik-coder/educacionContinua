import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique identifier */
      id?: string;
      /** Flag indicating if user must change their password */
      mustChangePassword?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's unique identifier */
    id: string;
    /** Flag indicating if user must change their password */
    mustChangePassword?: boolean;
  }
}
