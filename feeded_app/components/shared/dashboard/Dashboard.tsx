import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SmileIcon, MehIcon, FrownIcon, BarChart2Icon, UsersIcon, ActivityIcon } from "lucide-react"

export default function SurveyDashboard() {
  return (
    <div className="h-fit p-2 sm:p-4 bg-background flex flex-col">
      {/* Key Metrics */}
      <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-4 mb-2 sm:mb-4">
        {[
          { title: "Total Responses", value: "1,234", change: "+20.1%", icon: BarChart2Icon },
          { title: "Average Score", value: "4.2 / 5", change: "+0.3", icon: SmileIcon },
          { title: "Active Surveys", value: "12", change: "+2", icon: ActivityIcon },
          { title: "Total Participants", value: "5,678", change: "+12%", icon: UsersIcon },
        ].map((metric, index) => (
          <Card key={index} className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between py-2 px-3 lg:px-4">
              <CardTitle className="text-xs sm:text-sm lg:text-base font-medium">{metric.title}</CardTitle>
              <metric.icon className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="py-2 px-3 lg:px-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{metric.value}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{metric.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-1 lg:grid-cols-2 flex-grow overflow-hidden">
        {/* Survey Trend Chart */}
        <Card className="flex flex-col">
          <CardHeader className="py-2 px-3 lg:px-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Survey Satisfaction Trend</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end py-2 px-3 lg:px-4">
            <div className="flex-grow flex items-end justify-between">
              {[60, 45, 75, 50, 80, 65, 70].map((value, index) => (
                <div key={index} className="relative h-full w-[8%] bg-muted">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary transition-all duration-300 ease-in-out"
                    style={{ height: `${value}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-muted-foreground">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Surveys */}
        <Card className="flex flex-col">
          <CardHeader className="py-2 px-3 lg:px-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Active Surveys</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto py-2 px-3 lg:px-4">
            <div className="space-y-2 sm:space-y-3">
              {[
                { name: "Product Feedback", responses: 234, avgScore: 4.2 },
                { name: "Customer Service Evaluation", responses: 189, avgScore: 4.5 },
                { name: "Website Usability Study", responses: 156, avgScore: 3.8 },
                { name: "Employee Satisfaction Survey", responses: 203, avgScore: 4.0 },
              ].map((survey, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-xs sm:text-sm">{survey.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{survey.responses} responses</p>
                  </div>
                  <Badge 
                    variant={survey.avgScore > 4 ? "success" : "warning"}
                    className="text-[10px] sm:text-xs"
                  >
                    {survey.avgScore.toFixed(1)} / 5
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Survey Responses */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="py-2 px-3 lg:px-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Recent Survey Responses</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto py-2 px-3 lg:px-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%] text-[10px] sm:text-xs lg:text-sm">Survey</TableHead>
                  <TableHead className="w-[30%] text-[10px] sm:text-xs lg:text-sm">Respondent</TableHead>
                  <TableHead className="w-[20%] text-[10px] sm:text-xs lg:text-sm">Score</TableHead>
                  <TableHead className="w-[20%] text-[10px] sm:text-xs lg:text-sm">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { survey: "Product Feedback", respondent: "John D.", score: 4, date: "2023-09-28" },
                  { survey: "Customer Service", respondent: "Emily S.", score: 5, date: "2023-09-27" },
                  { survey: "Website Usability", respondent: "Michael R.", score: 3, date: "2023-09-26" },
                ].map((response, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-[10px] sm:text-xs lg:text-sm">{response.survey}</TableCell>
                    <TableCell className="text-[10px] sm:text-xs lg:text-sm">{response.respondent}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={response.score > 3 ? "success" : response.score === 3 ? "warning" : "destructive"}
                        className="text-[10px] sm:text-xs"
                      >
                        {response.score} / 5
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] sm:text-xs lg:text-sm">{response.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}