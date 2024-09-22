// QuickActions.js
import { FileText, Users, Briefcase, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuickActions() {
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