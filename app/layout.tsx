import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "@/app/components/ClientWrapper";

// Exportación estándar de metadatos para Next.js App Router

export const metadata: Metadata = {
  title: "Centro de Educación Continua ESPE-Latacunga",
  description: "",
  generator: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="overflow-hidden max-w-screen max-h-screen w-full h-full">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
