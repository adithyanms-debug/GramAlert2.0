import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, MapPin, Tag, MessageSquare, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { LocationPicker } from "./LocationPicker";
import api, { SERVER_BASE_URL } from "../api";
import { toast } from "sonner";
import { GRIEVANCE_CATEGORIES } from "../constants";

interface EditGrievanceDialogProps {
  grievance: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditGrievanceDialog({
  grievance,
  isOpen,
  onClose,
  onSuccess
}: EditGrievanceDialogProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (grievance && isOpen) {
      setTitle(grievance.title || "");
      setCategory(grievance.category || "");
      setDescription(grievance.description || "");
      if (grievance.file_url) {
        setImagePreview(`${SERVER_BASE_URL}${grievance.file_url}`);
      } else {
        setImagePreview(null);
      }
      setSelectedFile(null);
      if (grievance.latitude && grievance.longitude) {
        setSelectedLocation({
          lat: Number(grievance.latitude),
          lng: Number(grievance.longitude)
        });
      }
    }
  }, [grievance, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLocation) {
      toast.error("Please select a location on the map");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("latitude", selectedLocation.lat.toString());
      formData.append("longitude", selectedLocation.lng.toString());
      
      if (selectedFile) {
        formData.append("photo", selectedFile);
      }

      await api.put(`grievances/${grievance.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Grievance updated successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to update grievance:", error);
      const message = error.response?.data?.message || "Failed to update. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-teal-50 to-emerald-50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Edit Grievance</h2>
                <p className="text-sm text-slate-500">GRV-{grievance?.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/80 transition-colors"
              >
                <X className="size-6 text-slate-600" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Brief description of the issue"
                        required
                        className="bg-white/80"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger className="bg-white/80">
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
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the issue in detail..."
                        rows={6}
                        required
                        className="bg-white/80 resize-none"
                      />
                    </div>

                    {/* Image Preview and Upload */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <ImageIcon className="size-4 text-teal-600" />
                        Grievance Image
                      </Label>
                      {imagePreview && (
                        <div className="relative group rounded-xl overflow-hidden border border-slate-200 h-40">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label htmlFor="edit-image-upload" className="cursor-pointer bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors">
                              Change Image
                            </label>
                          </div>
                        </div>
                      )}
                      
                      {!imagePreview && (
                        <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50">
                          <label htmlFor="edit-image-upload" className="cursor-pointer block">
                            <Upload className="size-6 text-slate-400 mx-auto mb-2" />
                            <span className="text-sm text-slate-500">No image attached. Click to upload.</span>
                          </label>
                        </div>
                      )}

                      <input
                        type="file"
                        id="edit-image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  {/* Location Picker */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="size-4 text-teal-600" />
                      Location
                    </Label>
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-[480px] relative">
                      <LocationPicker
                        onLocationSelect={(lat, lng) => setSelectedLocation({ lat, lng })}
                        initialPosition={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : undefined}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 italic mt-1">
                      Click the map to update the exact location of the issue
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="size-4 mr-2" />
                    )}
                    {isSubmitting ? "Updating..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
