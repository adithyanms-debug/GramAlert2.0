import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MapPin, Calendar, Tag, User, MessageSquare, Clock, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import api, { SERVER_BASE_URL } from "../api";
import { toast } from "sonner";
import StatusBadge from "./StatusBadge";

interface Grievance {
  id: string | number;
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
  submitted_by?: string;
  comments?: Array<{
    id: number;
    user: string;
    username?: string;
    role: string;
    message?: string;
    comment?: string;
    timestamp: string;
    created_at?: string;
  }>;
  file_url?: string;
  updates?: Array<{
    date: string;
    message: string;
    author: string;
  }>;
  latitude?: number | string;
  longitude?: number | string;
  created_at?: string;
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
  grievance: initialGrievance,
  isOpen,
  open,
  onClose,
  onOpenChange,
  isAdmin = false,
  onStatusChange,
  onAddComment
}: GrievanceDetailsDialogProps) {
  const [newComment, setNewComment] = useState("");
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localGrievance, setLocalGrievance] = useState<Grievance | null>(null);
  const [comments, setComments] = useState<Array<{
    id: number;
    user: string;
    role: string;
    message: string;
    timestamp: string;
  }>>([]);

  const dialogIsOpen = isOpen ?? open ?? false;

  // Fetch full grievance details when dialog opens
  useEffect(() => {
    if (dialogIsOpen && initialGrievance) {
      const fetchGrievanceDetails = async () => {
        setLoading(true);
        try {
          const res = await api.get(`grievances/${initialGrievance.id}`);
          setLocalGrievance(res.data);
          setCommentsVisible(false); // Reset collapse state on new open
        } catch (error) {
          console.error("Failed to fetch grievance details", error);
          // Fallback to initial if fetch fails
          setLocalGrievance(initialGrievance);
        } finally {
          setLoading(false);
        }
      };
      fetchGrievanceDetails();
    } else if (!dialogIsOpen) {
      setLocalGrievance(null);
      setComments([]);
    }
  }, [dialogIsOpen, initialGrievance]);

  // Update logic to handle both initial and fetched grievance structure
  useEffect(() => {
    if (localGrievance) {
      const initialComments = localGrievance.comments?.map((c: any) => ({
        id: c.id,
        user: c.username || c.user || "Unknown User",
        role: c.role || "VILLAGER",
        message: c.comment || c.message || "",
        timestamp: c.created_at ? new Date(c.created_at).toLocaleString() : c.timestamp || "Just now"
      })) || localGrievance.updates?.map((update, index) => ({
        id: index + 1,
        user: update.author,
        role: update.author === "System" ? "System" : "Administrator",
        message: update.message,
        timestamp: update.date
      })) || [];
      setComments(initialComments);
    }
  }, [localGrievance]);

  if (!localGrievance && !loading) return null;

  // Loading state overlay or placeholder could be here
  const activeGrievance = localGrievance || initialGrievance;
  if (!activeGrievance) return null;

  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };



  const priorityColors = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-orange-100 text-orange-700",
    high: "bg-red-100 text-red-700",
  };

  const handleAddCommentInternal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(`grievances/${activeGrievance.id}/comments`, { comment: newComment });
      toast.success("Comment added successfully");
      setNewComment("");
      
      // Refresh grievance to show new comment
      const res = await api.get(`grievances/${activeGrievance.id}`);
      setLocalGrievance(res.data);
      
      // If external callback provided, call it
      if (onAddComment) {
        onAddComment(activeGrievance.id.toString(), newComment);
      }
    } catch (error) {
      console.error("Failed to add comment", error);
      toast.error("Failed to add comment");
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
                    <span className="text-sm font-mono text-slate-500">GRV-{activeGrievance.id}</span>
                    <StatusBadge status={activeGrievance.status} />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${priorityColors[activeGrievance.priority as keyof typeof priorityColors]
                      }`}>
                      {activeGrievance.priority} Priority
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                    <h2 className="text-2xl font-bold text-slate-800 flex-1">
                      {activeGrievance.title}
                    </h2>
                    {isAdmin && onStatusChange && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Update Status:</span>
                        <Select
                          defaultValue={activeGrievance.status.toLowerCase().replace(" ", "-")}
                          onValueChange={(val) => {
                            const statusMap: Record<string, string> = {
                              'received': 'Received',
                              'in-progress': 'In Progress',
                              'resolved': 'Resolved',
                              'rejected': 'Rejected'
                            };
                            onStatusChange(activeGrievance.id.toString(), statusMap[val] || val);
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
              {loading && !localGrievance ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              ) : (
                <>
                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <MessageSquare className="size-4" />
                      Description
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {activeGrievance.description || "No description provided."}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                        <Tag className="size-4" />
                        <span className="font-medium">Category</span>
                      </div>
                      <p className="text-slate-800 font-semibold">{activeGrievance.category}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                        <Calendar className="size-4" />
                        <span className="font-medium">Submitted On</span>
                      </div>
                      <p className="text-slate-800 font-semibold">
                        {activeGrievance.created_at ? new Date(activeGrievance.created_at).toLocaleDateString() : activeGrievance.date}
                      </p>
                    </div>

                    {(activeGrievance.submittedBy || activeGrievance.submitted_by) && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                          <User className="size-4" />
                          <span className="font-medium">Submitted By</span>
                        </div>
                        <p className="text-slate-800 font-semibold">{activeGrievance.submitted_by || activeGrievance.submittedBy}</p>
                      </div>
                    )}

                    {activeGrievance.location && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                          <MapPin className="size-4" />
                          <span className="font-medium">Location</span>
                        </div>
                        <p className="text-slate-800 font-semibold text-sm">
                          {typeof activeGrievance.location === 'object'
                            ? `${activeGrievance.location.lat.toFixed(4)}, ${activeGrievance.location.lng.toFixed(4)}`
                            : activeGrievance.location}
                        </p>
                      </div>
                    )}

                    {activeGrievance.coordinates && !activeGrievance.location && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                          <MapPin className="size-4" />
                          <span className="font-medium">Coordinates</span>
                        </div>
                        <p className="text-slate-800 font-semibold text-sm">
                          {activeGrievance.coordinates.lat.toFixed(4)}, {activeGrievance.coordinates.lng.toFixed(4)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Backend Image (file_url) */}
                  {activeGrievance.file_url && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 mb-2">Grievance Image</h3>
                      <motion.img
                        whileHover={{ scale: 1.02 }}
                        src={`${SERVER_BASE_URL}${activeGrievance.file_url}`}
                        alt="Grievance evidence"
                        className="w-full h-64 object-cover rounded-xl border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Images array */}
                  {activeGrievance.images && activeGrievance.images.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 mb-2">Attached Images</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {activeGrievance.images.map((img, idx) => (
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

                  {/* Location Map Preview */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <MapPin className="size-4" />
                      Location Preview
                    </h3>
                    {(activeGrievance.latitude && activeGrievance.longitude) ? (
                      <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 relative">
                        <Map
                          initialViewState={{
                            latitude: Number(activeGrievance.latitude),
                            longitude: Number(activeGrievance.longitude),
                            zoom: 14
                          }}
                          mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                          style={{ width: "100%", height: "100%" }}
                          interactive={true}
                        >
                          <Marker
                            latitude={Number(activeGrievance.latitude)}
                            longitude={Number(activeGrievance.longitude)}
                            anchor="bottom"
                          >
                            <MapPin className="size-8 text-red-600 fill-red-200 stroke-red-600 stroke-[2.5]" />
                          </Marker>
                        </Map>
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center">
                        <p className="text-slate-500 text-sm italic">No location provided.</p>
                      </div>
                    )}
                  </div>

                  {/* Collapsible Comments Section */}
                  <div className="pt-4 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      onClick={() => setCommentsVisible(!commentsVisible)}
                      className="w-full flex items-center justify-between py-6 group hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="size-5 text-teal-600" />
                        <span className="font-bold text-slate-800">
                          View Comments & Updates ({comments.length})
                        </span>
                      </div>
                      {commentsVisible ? (
                        <ChevronUp className="size-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                      ) : (
                        <ChevronDown className="size-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                      )}
                    </Button>

                    <AnimatePresence>
                      {commentsVisible && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 pt-4 pb-2 px-2">
                            {comments.length === 0 ? (
                              <p className="text-center py-6 text-slate-500 text-sm italic">
                                No comments yet. Be the first to start the conversation!
                              </p>
                            ) : (
                              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
                                {comments.map((comment, index) => (
                                  <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 rounded-xl bg-slate-50 border border-slate-200"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <p className="font-semibold text-slate-800">{comment.user}</p>
                                        <p className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-white border border-slate-200 inline-block text-slate-500 uppercase">
                                          {comment.role}
                                        </p>
                                      </div>
                                      <span className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
                                        <Clock className="size-3" />
                                        {comment.timestamp}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{comment.message}</p>
                                  </motion.div>
                                ))}
                              </div>
                            )}

                            {/* Add Comment Form */}
                            <form onSubmit={handleAddCommentInternal} className="mt-6 p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-3">
                              <h4 className="text-sm font-semibold text-teal-800 mb-1">Add a comment</h4>
                              <Textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Type your message here..."
                                className="resize-none bg-white border-teal-100 focus:border-teal-300 focus:ring-teal-200 transition-all rounded-xl"
                                rows={3}
                              />
                              <div className="flex justify-end">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                  <Button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-teal-100"
                                  >
                                    <Send className="size-4 mr-2" />
                                    Post Comment
                                  </Button>
                                </motion.div>
                              </div>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}