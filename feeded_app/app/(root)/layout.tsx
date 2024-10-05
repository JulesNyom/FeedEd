import Header from "@/components/shared/landing/Header"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
    <div>
    <Header />
      <main>{children}</main>
    </div>
    </body>
    </html>
  )
}