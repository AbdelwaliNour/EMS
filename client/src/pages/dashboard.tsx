
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Bell, Users, GraduationCap, School, TrendingUp } from 'lucide-react';
import StudentsTable from '@/components/students/StudentsTable';

export default function Dashboard() {
  const [, navigate] = useLocation();
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['/api/stats'],
  });

  const goToAddStudent = () => {
    navigate('/add-student');
  };

  if (isLoading) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4 border border-red/20 bg-red/5 rounded-lg text-red mb-6">
          <h3 className="text-lg font-medium">Error Loading Dashboard Data</h3>
          <p>There was a problem loading the dashboard data. Please try refreshing the page.</p>
        </div>
        <StudentsTable onAddStudent={goToAddStudent} />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-aldrich mb-2">Welcome Back!</h1>
            <p className="text-gray-600 dark:text-gray-400">Here's what's happening in your school today</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-12 w-12" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Users className="h-5 w-5 text-blue" />
              <TrendingUp className="h-4 w-4 text-green" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{stats?.students?.total || 0}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <GraduationCap className="h-5 w-5 text-green" />
              <TrendingUp className="h-4 w-4 text-green" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{stats?.students?.present || 0}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Present Today</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <School className="h-5 w-5 text-yellow" />
              <TrendingUp className="h-4 w-4 text-green" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{stats?.classrooms?.total || 0}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Classes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Users className="h-5 w-5 text-red" />
              <TrendingUp className="h-4 w-4 text-green" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{stats?.employees?.total || 0}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Staff</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-aldrich text-xl">Recent Students</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentsTable onAddStudent={goToAddStudent} />
        </CardContent>
      </Card>
    </Layout>
  );
}
