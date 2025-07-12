"use client";

import { AcademicProvider } from "../context/AcademicContext";
import SessionProvider from "../providers/SessionProvider";
import AuthLayout from "../auth-layout";
import PasswordChangeCheck from "./PasswordChangeCheck";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AcademicProvider>
        <PasswordChangeCheck>
          <AuthLayout>{children}</AuthLayout>
        </PasswordChangeCheck>
      </AcademicProvider>
    </SessionProvider>
  );
}
