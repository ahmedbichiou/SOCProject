'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/YearlyBreakup';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
import Blog from '@/app/(DashboardLayout)/components/dashboard/Blog';
import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/SOC/SOAP');
  }, [router]);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        
      </Box>
    </PageContainer>
  )
}

export default Dashboard;
