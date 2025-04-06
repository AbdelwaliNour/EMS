import { AnimatedSkeleton } from "@/components/ui/animated-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClassroomsGridSkeleton() {
  // Create an array of skeleton classroom cards
  const skeletonCards = Array.from({ length: 6 }).map((_, index) => (
    <Card key={index} className="overflow-hidden">
      <CardHeader className="pb-2 relative">
        <CardTitle>
          <AnimatedSkeleton className="h-5 w-32" variant="statistic" />
        </CardTitle>
        <div className="absolute top-3 right-3">
          <AnimatedSkeleton className="h-8 w-8 rounded-full" variant="statistic" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AnimatedSkeleton className="h-5 w-5" variant="statistic" />
              <AnimatedSkeleton className="h-4 w-24" variant="statistic" />
            </div>
            <AnimatedSkeleton className="h-5 w-16" variant="statistic" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AnimatedSkeleton className="h-5 w-5" variant="statistic" />
              <AnimatedSkeleton className="h-4 w-20" variant="statistic" />
            </div>
            <AnimatedSkeleton className="h-5 w-20" variant="statistic" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AnimatedSkeleton className="h-5 w-5" variant="statistic" />
              <AnimatedSkeleton className="h-4 w-28" variant="statistic" />
            </div>
            <AnimatedSkeleton className="h-5 w-12" variant="statistic" />
          </div>
          
          <div className="pt-2 flex justify-end space-x-2">
            <AnimatedSkeleton className="h-9 w-9 rounded" variant="statistic" />
            <AnimatedSkeleton className="h-9 w-9 rounded" variant="statistic" />
          </div>
        </div>
      </CardContent>
    </Card>
  ));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <AnimatedSkeleton className="h-8 w-48" variant="statistic" />
        <AnimatedSkeleton className="h-10 w-32" variant="statistic" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonCards}
      </div>
    </div>
  );
}