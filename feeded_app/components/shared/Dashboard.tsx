"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, GraduationCap, Users } from 'lucide-react'

const courses = [
  { id: 1, name: "Introduction to React", progress: 75 },
  { id: 2, name: "Advanced JavaScript Concepts", progress: 50 },
  { id: 3, name: "UX Design Fundamentals", progress: 30 },
]

const activities = [
  { id: 1, text: "Completed 'React Hooks' lesson", time: "2 hours ago" },
  { id: 2, text: "Submitted assignment for 'JavaScript Promises'", time: "Yesterday" },
  { id: 3, text: "Started 'Responsive Web Design' course", time: "2 days ago" },
]

const upcomingSessions = [
  { id: 1, name: "Advanced React Patterns", date: "Mon, 10:00 AM" },
  { id: 2, name: "TypeScript Workshop", date: "Wed, 2:00 PM" },
  { id: 3, name: "UI/UX Feedback Session", date: "Fri, 11:00 AM" },
]

export default function Dashboard() {
  return (
      <main className="bg-background max-w mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">256</div>
                <p className="text-xs text-muted-foreground">+23 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">+1 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Next: Mon, 10:00 AM</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ongoing Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map(course => (
                    <div key={course.id} className="flex items-center">
                      <div className="w-full">
                        <p className="text-sm font-medium">{course.name}</p>
                        <Progress value={course.progress} className="h-2 mt-2" />
                      </div>
                      <span className="ml-4 text-sm text-muted-foreground">{course.progress}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingSessions.map(session => (
                      <div key={session.id} className="flex justify-between items-center">
                        <p className="text-sm font-medium">{session.name}</p>
                        <span className="text-sm text-muted-foreground">{session.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map(activity => (
                      <div key={activity.id} className="flex justify-between items-start">
                        <p className="text-sm">{activity.text}</p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
  )
}