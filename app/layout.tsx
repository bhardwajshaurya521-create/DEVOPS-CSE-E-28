import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata = {
  title: "PocketWise — Student Finance",
  description: "Simple pocket money management for students"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><AppShell>{children}</AppShell></body>
    </html>
  );
}
