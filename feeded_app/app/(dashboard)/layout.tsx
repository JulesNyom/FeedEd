import Sidebar from '@/components/shared/sidebar';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className='flex flex-row'>
          <Sidebar />
        <div className="flex-1">
          <main>{children}</main>
        </div>
        </div>
      </body>
    </html>
  );
}
