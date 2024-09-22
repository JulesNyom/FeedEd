import React from 'react';
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
}

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base">
          Recent Activity 🔔
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-4">
          <ActivityItem
            title="New student registered"
            description="John Doe joined Web Dev"
            time="2h ago"
          />
          <ActivityItem
            title="Form submission"
            description="10 responses received"
            time="5h ago"
          />
          <ActivityItem
            title="Program completed"
            description="5 students finished UI/UX"
            time="1d ago"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ title, description, time }: ActivityItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center text-xs sm:text-sm">
      <div className="mr-2 rounded-full bg-primary/20 p-1">
        <Bell className="h-3 w-3 text-primary" />
      </div>
      <div className="flex-grow">
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <p className="text-xs text-muted-foreground">{time}</p>
    </motion.div>
  );
}