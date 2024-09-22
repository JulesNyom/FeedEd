import React from 'react';
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FormCardProps {
  title: string;
  responses: number;
  status: 'Active' | 'Draft' | 'Closed';
}

export default function FormsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-2 sm:space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search forms..." className="pl-8 w-full" />
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Form
        </Button>
      </div>
      <div className="grid m-3 grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <FormCard title="Student Feedback" responses={45} status="Active" />
        <FormCard title="Course Evaluation" responses={30} status="Draft" />
        <FormCard title="Alumni Sign-up" responses={100} status="Closed" />
        <FormCard
          title="Instructor Assessment"
          responses={22}
          status="Active"
        />
      </div>
    </motion.div>
  );
}

function FormCard({ title, responses, status }: FormCardProps) {
  const statusColor =
    status === "Active"
      ? "bg-green-100 text-green-800"
      : status === "Draft"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

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
          <p className="text-lg sm:text-2xl font-bold">{responses}</p>
          <p className="text-xs text-muted-foreground">Responses</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}