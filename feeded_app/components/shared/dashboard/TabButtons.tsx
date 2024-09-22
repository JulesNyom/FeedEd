import React from 'react';
import { motion } from "framer-motion";

interface TabButtonProps {
  children: React.ReactNode;
  emoji: string;
  active: boolean;
  onClick: () => void;
}

interface TabButtonsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabButtons({ activeTab, setActiveTab }: TabButtonsProps) {
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2">
      <TabButton
        emoji="📊"
        active={activeTab === "overview"}
        onClick={() => setActiveTab("overview")}>
        Overview
      </TabButton>
      <TabButton
        emoji="📄"
        active={activeTab === "forms"}
        onClick={() => setActiveTab("forms")}>
        Forms
      </TabButton>
      <TabButton
        emoji="🧑‍🎓"
        active={activeTab === "students"}
        onClick={() => setActiveTab("students")}>
        Students
      </TabButton>
      <TabButton
        emoji="📚"
        active={activeTab === "programs"}
        onClick={() => setActiveTab("programs")}>
        Programs
      </TabButton>
    </div>
  );
}

function TabButton({ children, emoji, active, onClick }: TabButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-colors flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted"
      }`}
      onClick={onClick}>
      <span>{emoji}</span>
      <span>{children}</span>
    </motion.button>
  );
}