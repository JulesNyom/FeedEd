import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  emoji: string;
  change: string;
}

export default function StatCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
      <motion.div whileHover={{ scale: 1.03 }}>
        <StatCard title="Students" value="1,234" emoji="👥" change="+5.2%" />
      </motion.div>
      <motion.div whileHover={{ scale: 1.03 }}>
        <StatCard title="Forms" value="56" emoji="📝" change="+2.1%" />
      </motion.div>
      <motion.div whileHover={{ scale: 1.03 }}>
        <StatCard title="Programs" value="23" emoji="🎓" change="+3.7%" />
      </motion.div>
      <motion.div whileHover={{ scale: 1.03 }}>
        <StatCard title="Completion" value="85%" emoji="🏆" change="+1.4%" />
      </motion.div>
    </motion.div>
  );
}

function StatCard({ title, value, emoji, change }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">
          {title}
        </CardTitle>
        <motion.div whileHover={{ rotate: 15 }} className="text-lg sm:text-2xl">
          {emoji}
        </motion.div>
      </CardHeader>
      <CardContent>
        <div className="text-lg sm:text-2xl font-bold">{value}</div>
        <motion.p
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}>
          <span
            className={
              change.startsWith("+") ? "text-green-600" : "text-red-600"
            }>
            {change}
          </span>
        </motion.p>
      </CardContent>
    </Card>
  );
}