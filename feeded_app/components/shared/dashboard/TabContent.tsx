import React from 'react';
import { AnimatePresence } from "framer-motion";
import TabButtons from "./TabButtons";
import OverviewTab from "./OverviewTab";
import FormsTab from "./FormsTab";
import StudentsTab from "./StudentsTab";
import ProgramsTab from "./ProgramsTab";

type TabType = string;

interface TabContentProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function TabContent({ activeTab, setActiveTab }: TabContentProps) {
  return (
    <>
      <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-2 sm:mt-4">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && <OverviewTab key="overview" />}
          {activeTab === "forms" && <FormsTab key="forms" />}
          {activeTab === "students" && <StudentsTab key="students" />}
          {activeTab === "programs" && <ProgramsTab key="programs" />}
        </AnimatePresence>
      </div>
    </>
  );
}