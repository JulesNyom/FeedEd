import AuthWrapper from "@/components/shared/AuthWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FeedEd - Questionnaires",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <AuthWrapper>
        {children}
      </AuthWrapper>
  );
}
