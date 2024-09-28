import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SmileIcon, BarChart2Icon, UsersIcon, ActivityIcon } from "lucide-react"

export default function SurveyDashboard() {
  const getBadgeVariant = (score: number) => {
    if (score > 4) return "default"
    if (score > 3) return "secondary"
    return "destructive"
  }

  return (
    <div className="h-fit 2xl:my-8 2xl:mx-6 p-2 sm:p-4 bg-background flex flex-col">
      {/* Key Metrics */}
      <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-4 mb-2 sm:mb-4">
        {[
          { title: "Total Responses", value: "1,234", change: "+20.1%", icon: BarChart2Icon },
          { title: "Average Score", value: "4.2 / 5", change: "+0.3", icon: SmileIcon },
          { title: "Active Surveys", value: "12", change: "+2", icon: ActivityIcon },
          { title: "Total Participants", value: "5,678", change: "+12%", icon: UsersIcon },
        ].map((metric, index) => (
          <Card key={index} className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between py-2 px-3 lg:px-4 2xl:py-4">
              <CardTitle className="text-xs sm:text-sm lg:text-base 2xl:text-lg font-medium">{metric.title}</CardTitle>
              <metric.icon className="w-3 h-3 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="py-2 px-3 lg:px-4 2xl:py-4">
              <div className="text-lg sm:text-xl lg:text-2xl 2xl:text-3xl font-bold">{metric.value}</div>
              <p className="text-[10px] sm:text-xs 2xl:text-sm text-muted-foreground">{metric.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-1 lg:grid-cols-2 flex-grow overflow-hidden">
        {/* Survey Trend Chart */}
        <Card className="flex flex-col">
          <CardHeader className="py-2 px-3 lg:px-4 2xl:py-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg 2xl:text-xl">Survey Satisfaction Trend</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end py-2 px-3 lg:px-4 2xl:py-4">
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
            <div className="flex justify-between mt-2 text-[10px] sm:text-xs 2xl:text-sm text-muted-foreground">
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
          <CardHeader className="py-2 px-3 lg:px-4 2xl:py-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg 2xl:text-xl">Active Surveys</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto py-2 px-3 lg:px-4 2xl:py-4">
            <div className="space-y-2 sm:space-y-3 2xl:space-y-4">
              {[
                { name: "Product Feedback", responses: 234, avgScore: 4.2 },
                { name: "Customer Service Evaluation", responses: 189, avgScore: 4.5 },
                { name: "Website Usability Study", responses: 156, avgScore: 3.8 },
                { name: "Employee Satisfaction Survey", responses: 203, avgScore: 4.0 },
              ].map((survey, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-xs sm:text-sm 2xl:text-base">{survey.name}</p>
                    <p className="text-[10px] sm:text-xs 2xl:text-sm text-muted-foreground">{survey.responses} responses</p>
                  </div>
                  <Badge 
                    variant={getBadgeVariant(survey.avgScore)}
                    className="text-[10px] sm:text-xs 2xl:text-sm"
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
          <CardHeader className="py-2 px-3 lg:px-4 2xl:py-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg 2xl:text-xl">Recent Survey Responses</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto py-2 px-3 lg:px-4 2xl:py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%] text-[10px] sm:text-xs lg:text-sm 2xl:text-base">Survey</TableHead>
                  <TableHead className="w-[35%] text-[10px] sm:text-xs lg:text-sm 2xl:text-base">Respondent</TableHead>
                  <TableHead className="w-[15%] text-[10px] sm:text-xs lg:text-sm 2xl:text-base">Score</TableHead>
                  <TableHead className="w-[15%] text-[10px] sm:text-xs lg:text-sm 2xl:text-base">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { survey: "Product Feedback", respondent: "John D.", score: 4, date: "2023-09-28" },
                  { survey: "Customer Service", respondent: "Emily S.", score: 5, date: "2023-09-27" },
                  { survey: "Website Usability", respondent: "Michael R.", score: 3, date: "2023-09-26" },
                ].map((response, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-[10px] sm:text-xs lg:text-sm 2xl:text-base">{response.survey}</TableCell>
                    <TableCell className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base">{response.respondent}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getBadgeVariant(response.score)}
                        className="text-[10px] sm:text-xs 2xl:text-sm"
                      >
                        {response.score} / 5
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base">{response.date}</TableCell>
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