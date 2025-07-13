"use client";

import { AcademicProvider } from "../context/AcademicContext";
import SessionProvider from "../providers/SessionProvider";
import AuthLayout from "../auth-layout";
import PasswordChangeCheck from "./PasswordChangeCheck";
import ErrorBoundary from "./ErrorBoundary";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <AcademicProvider>
          <PasswordChangeCheck>
            <AuthLayout>{children}</AuthLayout>
          </PasswordChangeCheck>
        </AcademicProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
