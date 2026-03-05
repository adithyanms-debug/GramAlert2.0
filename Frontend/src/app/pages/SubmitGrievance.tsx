import { useState } from "react";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Upload, MapPin, FileText, Send, Image as ImageIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useNavigate } from "react-router";

const categories = [
  "Infrastructure",
  "Water Supply",
  "Electricity",
  "Sanitation",
  "Drainage",
  "Road Maintenance",
  "Street Lights",
  "Healthcare",
  "Education",
  "Other",
];

export default function SubmitGrievance() {
  const [selectedLocation, setSelectedLocation] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    navigate("/villager");
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Submit New Grievance
          </h2>
          <p className="text-slate-600">
            Provide detailed information to help us resolve your issue quickly
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
          >
            <Label htmlFor="title" className="text-slate-700 mb-2 block">
              Grievance Title
            </Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              className="h-12 bg-white/80 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
            />
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
          >
            <Label htmlFor="category" className="text-slate-700 mb-2 block">
              Category
            </Label>
            <Select>
              <SelectTrigger className="h-12 bg-white/80 border-slate-200">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
          >
            <Label htmlFor="description" className="text-slate-700 mb-2 block">
              Detailed Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail, including any relevant information..."
              rows={6}
              className="bg-white/80 border-slate-200 focus:border-teal-500 focus:ring-teal-500 resize-none"
            />
            <p className="text-xs text-slate-500 mt-2">
              Provide as much detail as possible to help us understand and resolve the issue
            </p>
          </motion.div>

          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
          >
            <Label className="text-slate-700 mb-3 block">Attach Images</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-teal-500 transition-colors cursor-pointer bg-white/40">
              <div className="flex flex-col items-center gap-3">
                <div className="size-16 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <ImageIcon className="size-8 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-700">
                    Drag and drop images here
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    or click to browse from your device
                  </p>
                </div>
                <Button type="button" variant="outline" className="mt-2">
                  <Upload className="size-4 mr-2" />
                  Select Images
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Supported formats: JPG, PNG, GIF (Max 5MB per image)
            </p>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
          >
            <Label className="text-slate-700 mb-3 block">Location</Label>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-64 flex items-center justify-center relative">
              {!selectedLocation ? (
                <div className="text-center">
                  <MapPin className="size-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 mb-4">
                    Select location on map
                  </p>
                  <Button
                    type="button"
                    onClick={() => setSelectedLocation(true)}
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                  >
                    <MapPin className="size-4 mr-2" />
                    Choose Location
                  </Button>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="size-16 rounded-full bg-red-500 mb-3 mx-auto animate-pulse" />
                    <p className="font-medium text-slate-700">
                      Location Selected
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Lat: 12.9716, Long: 77.5946
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedLocation(false)}
                      className="mt-3"
                    >
                      Change Location
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Pin the exact location where the issue is present
            </p>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 pt-4"
          >
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg"
            >
              <Send className="size-5 mr-2" />
              Submit Grievance
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate("/villager")}
            >
              Cancel
            </Button>
          </motion.div>
        </form>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-4 rounded-xl bg-teal-50 border border-teal-100"
        >
          <p className="text-sm text-slate-600">
            <strong className="text-teal-700">Note:</strong> Your grievance will be reviewed
            by local administrators within 24-48 hours. You'll receive updates via notifications.
          </p>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
