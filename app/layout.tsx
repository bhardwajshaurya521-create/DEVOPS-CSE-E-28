import "./globals.css";
import { AppShell } from "@/components/AppShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </body>
    </html>
  )
}