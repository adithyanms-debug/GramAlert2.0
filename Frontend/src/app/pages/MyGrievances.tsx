import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Filter, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useState } from "react";
import { GrievanceDetailsDialog } from "../components/GrievanceDetailsDialog";
//import exampleImage from "figma:asset/c087eb43923d0c0c10d8bd27b31197157acdba2e.png";

const mockGrievances = [
  {
    id: "GRV-001",
    title: "Broken Street Light on Main Road",
    category: "Infrastructure",
    status: "In Progress",
    date: "Feb 25, 2026",
    priority: "medium",
    description: "The street light near the community center has been broken for 3 days causing safety concerns for pedestrians during night time.",
    location: "Main Road, Sector 5",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    images: [],
    updates: [
      { date: "Feb 25, 2026", message: "Grievance submitted and registered", author: "System" },
      { date: "Feb 26, 2026", message: "Assigned to maintenance team for inspection", author: "Admin Kumar" },
    ],
  },
  {
    id: "GRV-002",
    title: "Water Logging Issue near School",
    category: "Drainage",
    status: "Received",
    date: "Feb 26, 2026",
    priority: "high",
    description: "Heavy water logging during rain causes difficulty for children and creates unhygienic conditions.",
    location: "School Area, Sector 2",
    coordinates: { lat: 28.6129, lng: 77.2295 },
    updates: [
      { date: "Feb 26, 2026", message: "Grievance received and under review", author: "System" },
    ],
  },
  {
    id: "GRV-003",
    title: "Garbage Collection Delayed",
    category: "Sanitation",
    status: "Resolved",
    date: "Feb 20, 2026",
    priority: "low",
    description: "Garbage collection was delayed by 2 days last week causing bad smell in the area.",
    location: "Residential Block A",
    coordinates: { lat: 28.6149, lng: 77.2170 },
    updates: [
      { date: "Feb 20, 2026", message: "Grievance submitted", author: "System" },
      { date: "Feb 21, 2026", message: "Issue escalated to sanitation department", author: "Admin Sharma" },
      { date: "Feb 22, 2026", message: "Resolved - Regular schedule restored", author: "Admin Sharma" },
    ],
  },
  {
    id: "GRV-004",
    title: "Pothole on Village Road",
    category: "Road Maintenance",
    status: "Received",
    date: "Feb 27, 2026",
    priority: "high",
    description: "Large pothole causing accidents near the temple. Multiple vehicles have been damaged.",
    location: "Village Road, Sector 3",
    coordinates: { lat: 28.6119, lng: 77.2210 },
  },
  {
    id: "GRV-005",
    title: "Water Supply Interruption",
    category: "Water Supply",
    status: "In Progress",
    date: "Feb 24, 2026",
    priority: "high",
    description: "No water supply for 2 days in sector B affecting over 200 families.",
    location: "Sector 7, Zone A",
    coordinates: { lat: 28.6159, lng: 77.2150 },
    updates: [
      { date: "Feb 24, 2026", message: "Grievance registered", author: "System" },
      { date: "Feb 25, 2026", message: "Water department inspecting pipeline", author: "Admin Patel" },
    ],
  },
  {
    id: "GRV-006",
    title: "Stray Dogs in Residential Area",
    category: "Public Safety",
    status: "Received",
    date: "Feb 28, 2026",
    priority: "medium",
    description: "Multiple stray dogs causing safety concerns for children and elderly residents.",
    location: "Park Area, Sector 4",
    coordinates: { lat: 28.6099, lng: 77.2190 },
  },
];

export default function MyGrievances() {
  const [selectedGrievance, setSelectedGrievance] = useState<typeof mockGrievances[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const statusColors = {
    Received: "bg-amber-100 text-amber-700 border-amber-200",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
    Resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  const handleViewDetails = (grievance: typeof mockGrievances[0]) => {
    setSelectedGrievance(grievance);
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <Input
                placeholder="Search grievances..."
                className="pl-11 bg-white/80 border-slate-200"
              />
            </div>
            <Select>
              <SelectTrigger className="w-48 bg-white/80">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              More Filters
            </Button>
          </div>
        </motion.div>

        {/* Grievances List */}
        <div className="grid gap-4">
          {mockGrievances.map((grievance, index) => (
            <motion.div
              key={grievance.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ x: 4 }}
              className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-slate-500">
                      {grievance.id}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        statusColors[grievance.status as keyof typeof statusColors]
                      }`}
                    >
                      {grievance.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {grievance.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-3 line-clamp-2">
                    {grievance.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="font-medium">{grievance.category}</span>
                    <span>•</span>
                    <span>{grievance.date}</span>
                    <span>•</span>
                    <span className="capitalize">Priority: {grievance.priority}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleViewDetails(grievance)}
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                >
                  View Details
                </Button>
              </div>

              {/* Timeline */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="size-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-600">Submitted</span>
                  </div>
                  {grievance.status !== "Received" && (
                    <>
                      <div className="h-px flex-1 bg-slate-200" />
                      <div className="flex items-center gap-2 text-sm">
                        <div className="size-2 rounded-full bg-blue-500" />
                        <span className="text-slate-600">Under Review</span>
                      </div>
                    </>
                  )}
                  {grievance.status === "Resolved" && (
                    <>
                      <div className="h-px flex-1 bg-slate-200" />
                      <div className="flex items-center gap-2 text-sm">
                        <div className="size-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-600">Resolved</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <GrievanceDetailsDialog
        grievance={selectedGrievance}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </DashboardLayout>
  );
}