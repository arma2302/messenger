import type { Metadata } from "next";
import "./globals.css";
import ToasterContext from "./context/ToastContext";
import AuthContext from "./context/AuthContext";
import ActiveStatus from "./component/ActiveStatus";

export const metadata: Metadata = {
  title: "Messenger Clone",
  description: "Messenger clone app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />

          {children}
        </AuthContext>
      </body>
    </html>
  );
}