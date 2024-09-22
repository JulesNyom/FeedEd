import React from 'react';
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProgramCardProps {
  title: string;
  students: number;
  status: 'In Progress' | 'Upcoming' | 'Completed';
}

export default function ProgramsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-2 sm:space-y-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search programs..." className="m-2 pl-8 w-full" />
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Program
        </Button>
      </div>
      <div className="m-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <ProgramCard title="Advanced JS" students={25} status="In Progress" />
        <ProgramCard title="ML Basics" students={40} status="Upcoming" />
        <ProgramCard
          title="UI/UX Fundamentals"
          students={30}
          status="Completed"
        />
        <ProgramCard
          title="Python for Data Science"
          students={35}
          status="In Progress"
        />
      </div>
    </motion.div>
  );
}

function ProgramCard({ title, students, status }: ProgramCardProps) {
  const statusColor =
    status === "In Progress"
      ? "bg-blue-100 text-blue-800"
      : status === "Upcoming"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-800";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm flex justify-between items-center">
            <span className="truncate">{title}</span>
            <Badge className={`${statusColor} text-xs`}>{status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg sm:text-2xl font-bold">{students}</p>
          <p className="text-xs text-muted-foreground">Students</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}