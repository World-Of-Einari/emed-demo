import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "eMed Assistant",
  description: "Ask questions about the eMed weight management programme",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f9fafb" }}>{children}</body>
    </html>
  );
}
