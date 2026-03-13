import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MapPin, Calendar, Tag, User, MessageSquare, Clock, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SERVER_BASE_URL } from "../api";

interface Grievance {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  date: string;
  priority: string;
  location?: { lat: number; lng: number } | string;
  coordinates?: { lat: number; lng: number };
  image?: string;
  images?: string[];
  submittedBy?: string;
  comments?: Array<{
    id: number;
    user: string;
    role: string;
    message: string;
    timestamp: string;
  }>;
  file_url?: string;
  updates?: Array<{
    date: string;
    message: string;
    author: string;
  }>;
}

interface GrievanceDetailsDialogProps {
  grievance: Grievance | null;
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  isAdmin?: boolean;
  onStatusChange?: (id: string, status: string) => void;
  onAddComment?: (id: string, comment: string) => void;
}

export function GrievanceDetailsDialog({
  grievance,
  isOpen,
  open,
  onClose,
  onOpenChange,
  isAdmin = false,
  onStatusChange,
  onAddComment
}: GrievanceDetailsDialogProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Array<{
    id: number;
    user: string;
    role: string;
    message: string;
    timestamp: string;
  }>>([]);

  // Update comments when grievance changes
  useEffect(() => {
    if (grievance) {
      const initialComments = grievance.comments?.map((c: any) => ({
        id: c.id,
        user: c.username,
        role: c.role,
        message: c.comment,
        timestamp: new Date(c.created_at).toLocaleString()
      })) || grievance.updates?.map((update, index) => ({
        id: index + 1,
        user: update.author,
        role: update.author === "System" ? "System" : "Administrator",
        message: update.message,
        timestamp: update.date
      })) || [];
      setComments(initialComments);
    }
  }, [grievance]);

  if (!grievance) return null;

  const dialogIsOpen = isOpen ?? open ?? false;

  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  const statusColors = {
    Received: "bg-amber-100 text-amber-700 border-amber-300",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
    Resolved: "bg-emerald-100 text-emerald-700 border-emerald-300",
    Rejected: "bg-red-100 text-red-700 border-red-300",
  };

  const priorityColors = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-orange-100 text-orange-700",
    high: "bg-red-100 text-red-700",
  };

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(grievance.id, newComment);
      setNewComment("");
    }
  };

  return (
    <AnimatePresence>
      {dialogIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-teal-50 to-emerald-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-slate-500">{grievance.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[grievance.status as keyof typeof statusColors]
                      }`}>
                      {grievance.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${priorityColors[grievance.priority as keyof typeof priorityColors]
                      }`}>
                      {grievance.priority} Priority
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                    <h2 className="text-2xl font-bold text-slate-800 flex-1">
                      {grievance.title}
                    </h2>
                    {isAdmin && onStatusChange && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Update Status:</span>
                        <Select
                          defaultValue={grievance.status.toLowerCase().replace(" ", "-")}
                          onValueChange={(val) => {
                            const statusMap: Record<string, string> = {
                              'received': 'Received',
                              'in-progress': 'In Progress',
                              'resolved': 'Resolved',
                              'rejected': 'Rejected'
                            };
                            onStatusChange(grievance.id, statusMap[val] || val);
                          }}
                        >
                          <SelectTrigger className="w-40 h-9 bg-white border-slate-200">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="received">Received</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="p-2 rounded-xl hover:bg-white/80 transition-colors"
                >
                  <X className="size-6 text-slate-600" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  Description
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {grievance.description || "No description provided."}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                    <Tag className="size-4" />
                    <span className="font-medium">Category</span>
                  </div>
                  <p className="text-slate-800 font-semibold">{grievance.category}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                    <Calendar className="size-4" />
                    <span className="font-medium">Submitted On</span>
                  </div>
                  <p className="text-slate-800 font-semibold">{grievance.date}</p>
                </div>

                {grievance.submittedBy && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <User className="size-4" />
                      <span className="font-medium">Submitted By</span>
                    </div>
                    <p className="text-slate-800 font-semibold">{grievance.submittedBy}</p>
                  </div>
                )}

                {grievance.location && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <MapPin className="size-4" />
                      <span className="font-medium">Location</span>
                    </div>
                    <p className="text-slate-800 font-semibold text-sm">
                      {typeof grievance.location === 'object'
                        ? `${grievance.location.lat.toFixed(4)}, ${grievance.location.lng.toFixed(4)}`
                        : grievance.location}
                    </p>
                  </div>
                )}

                {grievance.coordinates && !grievance.location && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <MapPin className="size-4" />
                      <span className="font-medium">Coordinates</span>
                    </div>
                    <p className="text-slate-800 font-semibold text-sm">
                      {grievance.coordinates.lat.toFixed(4)}, {grievance.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>

              {/* Image */}
              {grievance.image && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Attached Image</h3>
                  <motion.img
                    whileHover={{ scale: 1.02 }}
                    src={grievance.image}
                    alt="Grievance"
                    className="w-full h-64 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}

              {/* Backend Image (file_url) */}
              {grievance.file_url && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Grievance Image</h3>
                  <motion.img
                    whileHover={{ scale: 1.02 }}
                    src={`${SERVER_BASE_URL}${grievance.file_url}`}
                    alt="Grievance evidence"
                    className="w-full h-64 object-cover rounded-xl border border-slate-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Images array */}
              {grievance.images && grievance.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Attached Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {grievance.images.map((img, idx) => (
                      <motion.img
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        src={img}
                        alt={`Grievance ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-xl border border-slate-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  Comments & Updates ({comments.length})
                </h3>

                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-slate-800">{comment.user}</p>
                          <p className="text-xs text-slate-500">{comment.role}</p>
                        </div>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="size-3" />
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{comment.message}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="mt-4 space-y-3">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment or update..."
                    className="resize-none bg-white"
                    rows={3}
                  />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                    >
                      <Send className="size-4 mr-2" />
                      Add Comment
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}