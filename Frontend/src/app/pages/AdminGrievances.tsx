import { useState } from "react";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import {
  Eye,
  MessageSquare,
  Filter,
  Download,
  Search,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { GrievanceDetailsDialog } from "../components/GrievanceDetailsDialog";
import { toast } from "sonner";
//import exampleImage from "figma:asset/c087eb43923d0c0c10d8bd27b31197157acdba2e.png";

const mockGrievances = [
  {
    id: "GRV-001",
    title: "Broken Street Light on Main Road",
    category: "Infrastructure",
    status: "In Progress",
    date: "Feb 25, 2026",
    submittedBy: "Rajesh Kumar",
    priority: "medium",
    location: "Main Road, Sector 5",
    description: "The street light near the community center has been broken for 3 days causing safety concerns for pedestrians during night time.",
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
    submittedBy: "Priya Sharma",
    priority: "high",
    location: "School Area, Sector 2",
    description: "Heavy water logging during rain causes difficulty for children and creates unhygienic conditions.",
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
    submittedBy: "Amit Patel",
    priority: "low",
    location: "Residential Block A",
    description: "Garbage collection was delayed by 2 days last week causing bad smell in the area.",
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
    submittedBy: "Sunita Devi",
    priority: "high",
    location: "Village Road, Sector 3",
    description: "Large pothole causing accidents near the temple. Multiple vehicles have been damaged.",
    coordinates: { lat: 28.6119, lng: 77.2210 },
  },
  {
    id: "GRV-005",
    title: "Water Supply Interruption",
    category: "Water Supply",
    status: "In Progress",
    date: "Feb 24, 2026",
    submittedBy: "Vijay Singh",
    priority: "high",
    location: "Sector 7, Zone A",
    description: "No water supply for 2 days in sector B affecting over 200 families.",
    coordinates: { lat: 28.6159, lng: 77.2150 },
    updates: [
      { date: "Feb 24, 2026", message: "Grievance registered", author: "System" },
      { date: "Feb 25, 2026", message: "Water department inspecting pipeline", author: "Admin Patel" },
    ],
  },
  {
    id: "GRV-006",
    title: "Street Vendor Encroachment",
    category: "Public Order",
    status: "Received",
    date: "Feb 28, 2026",
    submittedBy: "Meena Kapoor",
    priority: "medium",
    location: "Market Street",
    description: "Street vendors blocking the main walkway causing inconvenience to pedestrians.",
    coordinates: { lat: 28.6109, lng: 77.2200 },
  },
  {
    id: "GRV-007",
    title: "Stray Animals Issue",
    category: "Public Safety",
    status: "In Progress",
    date: "Feb 23, 2026",
    submittedBy: "Ramesh Yadav",
    priority: "medium",
    location: "Park Area, Sector 4",
    description: "Multiple stray animals in the park area causing safety concerns for children.",
    coordinates: { lat: 28.6099, lng: 77.2190 },
  },
  {
    id: "GRV-008",
    title: "Illegal Parking",
    category: "Traffic",
    status: "Resolved",
    date: "Feb 19, 2026",
    submittedBy: "Sanjay Kumar",
    priority: "low",
    location: "Main Market",
    description: "Vehicles parked illegally blocking emergency access routes.",
    coordinates: { lat: 28.6089, lng: 77.2180 },
    updates: [
      { date: "Feb 19, 2026", message: "Grievance received", author: "System" },
      { date: "Feb 20, 2026", message: "Traffic police deployed to the area", author: "Admin Singh" },
      { date: "Feb 21, 2026", message: "Issue resolved - No parking signs installed", author: "Admin Singh" },
    ],
  },
];

export default function AdminGrievances() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedGrievance, setSelectedGrievance] = useState<typeof mockGrievances[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [grievances, setGrievances] = useState(mockGrievances);

  const handleViewDetails = (grievance: typeof mockGrievances[0]) => {
    setSelectedGrievance(grievance);
    setDialogOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setGrievances(prev => 
      prev.map(g => g.id === id ? { ...g, status: newStatus } : g)
    );
    toast.success(`Grievance ${id} status updated to ${newStatus}`);
  };

  const handleAddComment = (id: string, comment: string) => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setGrievances(prev =>
      prev.map(g =>
        g.id === id
          ? {
              ...g,
              updates: [
                ...(g.updates || []),
                { date: currentDate, message: comment, author: "Admin" },
              ],
            }
          : g
      )
    );
    toast.success("Comment added successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search grievances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="drainage">Drainage</SelectItem>
                <SelectItem value="sanitation">Sanitation</SelectItem>
                <SelectItem value="water">Water Supply</SelectItem>
                <SelectItem value="road">Road Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="bg-white/80">
              <Download className="size-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Grievances Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
                All Grievances
              </h3>
              <p className="text-sm text-slate-600">
                Showing {grievances.length} grievances
              </p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden lg:table-cell">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden xl:table-cell">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden md:table-cell">
                      Submitted By
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden sm:table-cell">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {grievances.map((grievance, index) => (
                    <motion.tr
                      key={grievance.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.03 }}
                      className="border-b border-slate-100 hover:bg-white/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs sm:text-sm text-slate-600">
                          {grievance.id}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-xs sm:text-sm text-slate-800 line-clamp-2">
                          {grievance.title}
                        </p>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <span className="text-xs sm:text-sm text-slate-600">
                          {grievance.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden xl:table-cell">
                        <span className="text-xs sm:text-sm text-slate-600">
                          {grievance.location}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-xs sm:text-sm text-slate-600">
                          {grievance.submittedBy}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <span className="text-xs sm:text-sm text-slate-600">
                          {grievance.date}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          grievance.status === "Received"
                            ? "bg-amber-100 text-amber-700"
                            : grievance.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {grievance.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2"
                              onClick={() => handleViewDetails(grievance)}
                            >
                              <Eye className="size-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 h-8 px-2"
                              onClick={() => handleViewDetails(grievance)}
                            >
                              <MessageSquare className="size-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      <GrievanceDetailsDialog
        grievance={selectedGrievance}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isAdmin={true}
        onStatusChange={handleStatusChange}
        onAddComment={handleAddComment}
      />
    </DashboardLayout>
  );
}