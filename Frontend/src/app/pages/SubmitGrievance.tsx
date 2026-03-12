import { useState } from "react";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Upload, Image as ImageIcon, X, Send } from "lucide-react";
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
import api from "../api";
import { LocationPicker } from "../components/LocationPicker";
import { toast } from "sonner";
import { GRIEVANCE_CATEGORIES } from "../constants";

export default function SubmitGrievance() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLocation) {
      toast.error("Please select a location on the map");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        title,
        category,
        description,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng
      };

      await api.post("grievances", payload);

      // Navigate on success
      toast.success("Grievance submitted successfully!");
      navigate("/villager");
    } catch (error: any) {
      console.error("Failed to submit grievance:", error);
      const message = error.response?.data?.message || "Failed to submit. Please try again.";
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue"
              className="h-12 bg-white/80 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
              required
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
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="h-12 bg-white/80 border-slate-200">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {GRIEVANCE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail, including any relevant information..."
              rows={6}
              className="bg-white/80 border-slate-200 focus:border-teal-500 focus:ring-teal-500 resize-none"
              required
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
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
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
              </label>
            </div>
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 size-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            <Label className="text-slate-700 mb-3 block">Location *</Label>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-[500px] relative">
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialPosition={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : undefined}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Search for a location, use your current location, or click on the map to pin the exact location where the issue is present
            </p>
          </motion.div>

          {/* Error Message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium"
            >
              {errorMsg}
            </motion.div>
          )}

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
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="size-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                />
              ) : (
                <Send className="size-5 mr-2" />
              )}
              {isSubmitting ? "Submitting..." : "Submit Grievance"}
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