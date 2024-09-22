import React from 'react';
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface StudentItemProps {
  name: string;
  email: string;
  program: string;
  progress: number;
}

export default function StudentsTab() {
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
          <Input placeholder="Search students..." className="pl-8 w-full" />
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>
      <div className="m-3 space-y-2">
        <StudentItem
          name="Alice Johnson"
          email="alice@example.com"
          program="Web Dev"
          progress={75}
        />
        <StudentItem
          name="Bob Smith"
          email="bob@example.com"
          program="Data Science"
          progress={60}
        />
        <StudentItem
          name="Charlie Brown"
          email="charlie@example.com"
          program="UX Design"
          progress={90}
        />
        <StudentItem
          name="Diana Ross"
          email="diana@example.com"
          program="Web Dev"
          progress={40}
        />
      </div>
    </motion.div>
  );
}

function StudentItem({ name, email, program, progress }: StudentItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs sm:text-sm">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p className="font-medium text-xs sm:text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-medium">{program}</p>
        <div className="mt-1 w-16 sm:w-24">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}>
            <Progress value={progress} className="h-1" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}