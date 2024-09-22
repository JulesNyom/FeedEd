import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressItemProps {
  title: string;
  progress: number;
}

export default function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-2 2xl:space-y-4">
      <motion.div whileHover={{ scale: 1.03 }}>
        <Card>
          <CardHeader className="mb-[-10px] 2xl:mb-0">
            <CardTitle className="text-sm sm:text-base">
              Completion Rates 📈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div className="space-y-2">
              <ProgressItem title="Web Dev" progress={75} />
              <ProgressItem title="Data Science" progress={60} />
              <ProgressItem title="UX Design" progress={90} />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div whileHover={{ scale: 1.03 }}>
        <Card>
          <CardHeader className="mb-[-10px] 2xl:mb-0">
            <CardTitle className="text-sm sm:text-base">
              Quick Stats 📊
            </CardTitle>
          </CardHeader>
          <CardContent className="2xl:grid 2xl:grid-cols-2 flex gap-10 2xl:space-y-1 2xl:gap-4">
            <div className="space-y-1">
              <p className="2xl:text-sm text-xs font-medium">
                Total Enrollments
              </p>
              <p className="text-base 2xl:text-2xl  font-bold">2,543</p>
            </div>
            <div className="space-y-1">
              <p className="2xl:text-sm text-xs font-medium">
                Avg. Course Rating
              </p>
              <p className="text-base 2xl:text-2xl  font-bold">4.8/5</p>
            </div>
            <div className="space-y-1">
              <p className="2xl:text-sm text-xs font-medium">Active Courses</p>
              <p className="text-base 2xl:text-2xl font-bold">18</p>
            </div>
            <div className="space-y-1">
              <p className="2xl:text-sm text-xs font-medium">
                Certificates Issued
              </p>
              <p className="text-base 2xl:text-2xl font-bold">1,287</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function ProgressItem({ title, progress }: ProgressItemProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs sm:text-sm">
        <span>{title}</span>
        <span>{progress}%</span>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}>
        <Progress value={progress} className="h-1 sm:h-2" />
      </motion.div>
    </div>
  );
}