import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { Metadata } from "next";
import AuthWrapper from "@/components/shared/AuthWrapper"; // Adjust this import path as needed

export const metadata: Metadata = {
  title: "FeedEd - Questionnaires",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>
              {children}
        </AuthWrapper>
      </body>
    </html>
  );
}