import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { Classroom, Employee } from '@shared/schema';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { ColumnDef } from '@tanstack/react-table';
import FilterSelect from '@/components/ui/filter-select';
import { getSectionDisplayName } from '@/lib/utils';

const classroomFormSchema = z.object({
  name: z.string().min(1, "Classroom name is required"),
  section: z.enum(['primary', 'secondary', 'highschool']),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  teacherId: z.number().optional(),
});

type ClassroomFormValues = z.infer<typeof classroomFormSchema>;

export default function Classrooms() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    section: '',
  });

  const { data: classrooms, isLoading, error, refetch } = useQuery<Classroom[]>({
    queryKey: ['/api/classrooms'],
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });

  const teachers = employees?.filter(employee => employee.role === 'teacher') || [];

  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomFormSchema),
    defaultValues: {
      name: '',
      section: 'primary',
      capacity: 30,
      teacherId: undefined,
    },
  });

  const onSubmit = async (data: ClassroomFormValues) => {
    try {
      await apiRequest('POST', '/api/classrooms', data);
      toast({
        title: 'Success',
        description: 'Classroom added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/classrooms'] });
      setIsAddModalOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add classroom',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this classroom?')) return;
    
    try {
      await apiRequest('DELETE', `/api/classrooms/${id}`);
      toast({
        title: 'Success',
        description: 'Classroom deleted successfully',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete classroom',
        variant: 'destructive',
      });
    }
  };

  const getTeacherName = (teacherId?: number) => {
    if (!teacherId) return 'Not Assigned';
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
  };

  const columns: ColumnDef<Classroom>[] = [
    {
      accessorKey: 'name',
      header: 'Room Name',
    },
    {
      accessorKey: 'section',
      header: 'Section',
      cell: ({ row }) => getSectionDisplayName(row.original.section),
    },
    {
      accessorKey: 'capacity',
      header: 'Capacity',
    },
    {
      accessorKey: 'teacherId',
      header: 'Assigned Teacher',
      cell: ({ row }) => getTeacherName(row.original.teacherId),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue"
              onClick={() => {
                // Implement edit functionality
                toast({
                  title: 'Edit Classroom',
                  description: `Edit functionality for ${row.original.name}`,
                });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red"
              onClick={() => handleDelete(row.original.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Classrooms Management</h1>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-6">
          <div className="p-4 flex items-center justify-between border-b border-divider dark:border-gray-700">
            <div className="flex items-center">
              <h2 className="text-lg font-homenaje text-gray-800 dark:text-gray-200 mr-4">View Classrooms</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">Filter BY</span>
            </div>
            <div className="flex space-x-2">
              <FilterSelect
                label="Section"
                options={[
                  { value: '', label: 'All' },
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' },
                  { value: 'highschool', label: 'High School' },
                ]}
                value={filters.section}
                onChange={(value) => setFilters({ ...filters, section: value })}
                placeholder="Section"
              />
            </div>
            
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-blue hover:bg-blue/90 text-white"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Classroom
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Classroom</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Room 101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="section"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select section" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="primary">Primary</SelectItem>
                              <SelectItem value="secondary">Secondary</SelectItem>
                              <SelectItem value="highschool">High School</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Capacity" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="teacherId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assign Teacher</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a teacher" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Not Assigned</SelectItem>
                              {teachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                  {teacher.firstName} {teacher.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-blue hover:bg-blue/90 text-white">
                        Add Classroom
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">Loading classrooms...</div>
          ) : error ? (
            <div className="p-8 text-center text-red">Error loading classrooms. Please try again.</div>
          ) : (
            <DataTable
              columns={columns}
              data={classrooms || []}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
