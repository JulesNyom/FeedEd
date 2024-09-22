"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import StatCards from "./StatCards";
import TabContent from "./TabContent";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col">
      <StatCards />
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mt-2 sm:mt-4 md:mt-3 2xl:mt-6">
        <motion.div
          className="lg:col-span-2 bg-gray-50 rounded-xl shadow-lg p-2 sm:p-4 md:p-6 flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          <TabContent activeTab={activeTab} setActiveTab={setActiveTab} />
        </motion.div>
        <motion.div
          className="space-y-2 sm:space-y-4 md:space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <QuickActions />
          <RecentActivity />
        </motion.div>
      </div>
    </div>
  );
}