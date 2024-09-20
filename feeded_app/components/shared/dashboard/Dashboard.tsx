"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Plus,
  Search,
  BarChart,
  Users,
  FileText,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col">
      <StatCards />
      <div className=" flex-grow grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mt-2 sm:mt-4 md:mt-3 2xl:mt-6">
        <motion.div
          className="lg:col-span-2 bg-gray-50 rounded-xl shadow-lg p-2 sm:p-4 md:p-6 flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-2 sm:mt-4">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && <OverviewTab key="overview" />}
              {activeTab === "forms" && <FormsTab key="forms" />}
              {activeTab === "students" && <StudentsTab key="students" />}
              {activeTab === "programs" && <ProgramsTab key="programs" />}
            </AnimatePresence>
          </div>
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

function StatCards() {
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

function StatCard({ title, value, emoji, change }) {
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

function TabButtons({ activeTab, setActiveTab }) {
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

function TabButton({ children, emoji, active, onClick }) {
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

function OverviewTab() {
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

function FormsTab() {
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

function StudentsTab() {
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

function ProgramsTab() {
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

function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base">Quick Actions ⚡</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" className="text-xs sm:text-sm">
          <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          New Form
        </Button>
        <Button size="sm" variant="outline" className="text-xs sm:text-sm">
          <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Add Student
        </Button>
        <Button size="sm" variant="outline" className="text-xs sm:text-sm">
          <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          New Program
        </Button>
        <Button size="sm" variant="outline" className="text-xs sm:text-sm">
          <BarChart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          View Reports
        </Button>
      </CardContent>
    </Card>
  );
}

function RecentActivity() {
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

function ActivityItem({ title, description, time }) {
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

function ProgressItem({ title, progress }) {
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

function FormCard({ title, responses, status }) {
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

function StudentItem({ name, email, program, progress }) {
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

function ProgramCard({ title, students, status }) {
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
