import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { Metadata } from "next";
import AuthWrapper from "@/components/shared/AuthWrapper"; // Adjust this import path as needed

export const metadata: Metadata = {
  title: "FeedEd - Dashboard",
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
          <div className="bg-background grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
              <Topbar />
              {children}
            </div>
          </div>
        </AuthWrapper>
      </body>
    </html>
  );
}