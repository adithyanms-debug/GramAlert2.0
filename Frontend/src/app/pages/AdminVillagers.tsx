import { useState } from "react";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import {
  Users,
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  FileText,
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

const mockVillagers = [
  {
    id: "VIL-001",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 98765 43210",
    location: "Sector 5, Block A",
    grievances: 3,
    status: "Active",
    joinedDate: "Jan 15, 2026",
  },
  {
    id: "VIL-002",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43211",
    location: "Sector 2, Block B",
    grievances: 5,
    status: "Active",
    joinedDate: "Jan 20, 2026",
  },
  {
    id: "VIL-003",
    name: "Amit Patel",
    email: "amit@example.com",
    phone: "+91 98765 43212",
    location: "Sector 7, Block C",
    grievances: 2,
    status: "Active",
    joinedDate: "Feb 1, 2026",
  },
  {
    id: "VIL-004",
    name: "Sunita Devi",
    email: "sunita@example.com",
    phone: "+91 98765 43213",
    location: "Sector 3, Block A",
    grievances: 4,
    status: "Active",
    joinedDate: "Feb 5, 2026",
  },
  {
    id: "VIL-005",
    name: "Vijay Singh",
    email: "vijay@example.com",
    phone: "+91 98765 43214",
    location: "Sector 7, Zone A",
    grievances: 6,
    status: "Active",
    joinedDate: "Feb 10, 2026",
  },
  {
    id: "VIL-006",
    name: "Meena Kapoor",
    email: "meena@example.com",
    phone: "+91 98765 43215",
    location: "Market Street",
    grievances: 1,
    status: "Active",
    joinedDate: "Feb 15, 2026",
  },
  {
    id: "VIL-007",
    name: "Ramesh Yadav",
    email: "ramesh@example.com",
    phone: "+91 98765 43216",
    location: "Sector 4, Park Area",
    grievances: 2,
    status: "Active",
    joinedDate: "Feb 18, 2026",
  },
  {
    id: "VIL-008",
    name: "Sanjay Kumar",
    email: "sanjay@example.com",
    phone: "+91 98765 43217",
    location: "Main Market",
    grievances: 3,
    status: "Active",
    joinedDate: "Feb 22, 2026",
  },
];

export default function AdminVillagers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            {
              label: "Total Villagers",
              value: "1,234",
              change: "+45 this month",
              color: "from-blue-500 to-indigo-500",
            },
            {
              label: "Active Users",
              value: "1,156",
              change: "93.7% active",
              color: "from-emerald-500 to-teal-500",
            },
            {
              label: "Total Grievances",
              value: "156",
              change: "From all users",
              color: "from-purple-500 to-violet-500",
            },
            {
              label: "Avg. Response Time",
              value: "2.3 hrs",
              change: "↓ 15% this week",
              color: "from-amber-500 to-orange-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
            >
              <div className={`size-10 sm:size-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <Users className="size-5 sm:size-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 mb-1">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search villagers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80"
              />
            </div>
            
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="sector-1">Sector 1</SelectItem>
                <SelectItem value="sector-2">Sector 2</SelectItem>
                <SelectItem value="sector-3">Sector 3</SelectItem>
                <SelectItem value="sector-4">Sector 4</SelectItem>
                <SelectItem value="sector-5">Sector 5</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="recent">Recently Joined</SelectItem>
                <SelectItem value="grievances">Most Grievances</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Villagers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
              Registered Villagers
            </h3>
            <p className="text-sm text-slate-600">
              Showing {mockVillagers.length} villagers
            </p>
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
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden md:table-cell">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden lg:table-cell">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden sm:table-cell">
                      Grievances
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
                  {mockVillagers.map((villager, index) => (
                    <motion.tr
                      key={villager.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.03 }}
                      className="border-b border-slate-100 hover:bg-white/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs sm:text-sm text-slate-600">
                          {villager.id}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-xs sm:text-sm text-slate-800">
                            {villager.name}
                          </p>
                          <p className="text-xs text-slate-500 md:hidden">{villager.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <div className="space-y-1">
                          <p className="text-xs flex items-center gap-1 text-slate-600">
                            <Mail className="size-3" />
                            {villager.email}
                          </p>
                          <p className="text-xs flex items-center gap-1 text-slate-600">
                            <Phone className="size-3" />
                            {villager.phone}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <span className="text-xs flex items-center gap-1 text-slate-600">
                          <MapPin className="size-3" />
                          {villager.location}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <FileText className="size-3" />
                          {villager.grievances}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2">
                            <Eye className="size-4" />
                            <span className="hidden sm:inline ml-1">View</span>
                          </Button>
                        </motion.div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
