import React from 'react';
import Sidebar from '@/components/shared/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='flex flex-row'>
        <div>
      <Sidebar/>
      </div>
        <div className="">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}