import React, { useState } from "react";
import { Application, Internship } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, ArrowRight, ArrowLeft, Clipboard, Copy, FileText, Download, Check, Sparkles, AlertCircle, X } from "lucide-react";

interface KanbanBoardProps {
  applications: Application[];
  internships: Internship[];
  onUpdateStatus: (id: string, newStatus: Application["status"]) => void;
  onUpdateCoverLetter: (id: string, newLetter: string) => void;
  onDeleteApplication: (id: string) => void;
}

const COLUMNS: { id: Application["status"]; label: string; color: string; bg: string; border: string }[] = [
  { id: "Matched", label: "Matched (AI Saved)", color: "text-zinc-300", bg: "bg-zinc-950/40", border: "border-zinc-800" },
  { id: "AI Tailored", label: "Tailoring Resume", color: "text-indigo-400", bg: "bg-indigo-950/10", border: "border-indigo-500/20" },
  { id: "Applying", label: "Applying", color: "text-amber-400", bg: "bg-amber-950/10", border: "border-amber-500/25" },
  { id: "Applied", label: "Submitted Application", color: "text-emerald-400", bg: "bg-emerald-950/10", border: "border-emerald-500/20" },
  { id: "Interview", label: "Interview Scheduled", color: "text-blue-400", bg: "bg-blue-950/15", border: "border-blue-500/20" },
  { id: "Offer", label: "Offers Received 🎉", color: "text-pink-400", bg: "bg-pink-950/15", border: "border-pink-500/20" }
];

export default function KanbanBoard({
  applications,
  internships,
  onUpdateStatus,
  onUpdateCoverLetter,
  onDeleteApplication,
}: KanbanBoardProps) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [copiedMap, setCopiedMap] = useState<{ [key: string]: boolean }>({});

  const selectedApp = applications.find(a => a.id === selectedAppId);
  const relatedInternship = selectedApp ? internships.find(i => i.id === selectedApp.internshipId) : null;

  const copyToClipboard = (text: string, idStr: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap({ ...copiedMap, [idStr]: true });
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [idStr]: false }));
    }, 2000);
  };

  const shiftStatus = (appId: string, currentStatus: Application["status"], direction: "left" | "right") => {
    const statusSequence: Application["status"][] = ["Matched", "AI Tailored", "Applying", "Applied", "Interview", "Offer"];
    const currIdx = statusSequence.indexOf(currentStatus);
    if (direction === "right" && currIdx < statusSequence.length - 1) {
      onUpdateStatus(appId, statusSequence[currIdx + 1]);
    } else if (direction === "left" && currIdx > 0) {
      onUpdateStatus(appId, statusSequence[currIdx - 1]);
    }
  };

  return (
    <div className="space-y-6" id="kanban_board_outer">
      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4" id="kanban_columns_container">
        {COLUMNS.map(col => {
          const colApps = applications.filter(app => app.status === col.id);
          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-xl border ${col.border} ${col.bg} p-3.5 min-h-[460px]`}
            >
              {/* Column Title */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-900">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                  {col.label}
                </span>
                <span className="bg-zinc-900 border border-zinc-800 text-[11px] font-mono font-bold text-zinc-400 px-2 py-0.5 rounded">
                  {colApps.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
                {colApps.length === 0 ? (
                  <div className="h-28 border border-dashed border-zinc-900 rounded-lg flex items-center justify-center text-zinc-650 text-[11px] text-center p-3 select-none">
                    Drop items here
                  </div>
                ) : (
                  colApps.map(app => {
                    const job = internships.find(i => i.id === app.internshipId);
                    return (
                      <motion.div
                        key={app.id}
                        layoutId={`app-card-${app.id}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedAppId(app.id)}
                        className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 p-4.5 rounded-lg shadow-sm cursor-pointer relative group transition-all"
                      >
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-sm font-semibold text-white tracking-tight line-clamp-1">
                            {app.internshipTitle}
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-400 font-medium mt-1 line-clamp-1">{app.company}</p>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {job?.stipend.hasStipend ? (
                            <span className="bg-emerald-950/55 text-[10px] text-emerald-400 font-sans border border-emerald-900/50 px-2 py-0.5 rounded">
                              {job.stipend.amount}
                            </span>
                          ) : (
                            <span className="bg-zinc-850 text-[10px] text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">
                              Unpaid / Credit
                            </span>
                          )}

                          {app.adaptedResume && (
                            <span className="bg-indigo-950/50 text-[10px] text-indigo-300 font-mono border border-indigo-900/40 px-2 py-0.5 rounded flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                              {app.adaptedResume.atsScore}% ATS
                            </span>
                          )}
                        </div>

                        {/* Interactive Status Changers for Accessibility */}
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            id={`btn_shift_left_${app.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              shiftStatus(app.id, app.status, "left");
                            }}
                            className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-850 rounded"
                            title="Move back"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            id={`btn_delete_app_${app.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteApplication(app.id);
                            }}
                            className="text-[10px] text-rose-500 hover:text-rose-400 uppercase font-black"
                          >
                            Remove
                          </button>

                          <button
                            id={`btn_shift_right_${app.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              shiftStatus(app.id, app.status, "right");
                            }}
                            className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-850 rounded"
                            title="Move forward"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Side-Drawer / Modal Overlay */}
      <AnimatePresence>
        {selectedApp && relatedInternship && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end" id="app_drawer_overlay">
            {/* Modal Canvas */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-4xl bg-zinc-950 border-l border-zinc-800 h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between"
              id="app_drawer_modal"
            >
              {/* Header */}
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-widest font-black">
                      ATS Optimization Suite
                    </span>
                    <h2 className="text-2xl font-bold text-white tracking-tight mt-2.5">
                      {selectedApp.internshipTitle}
                    </h2>
                    <p className="text-md text-zinc-400 font-medium mt-1">at {selectedApp.company}</p>
                  </div>
                  <button
                    onClick={() => setSelectedAppId(null)}
                    className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Grid layout inside drawer */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left segment (ATS Resume metrics) */}
                  <div className="space-y-6">
                    {selectedApp.adaptedResume && (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                            ATS Compliance Score
                          </h4>
                          <span className={`text-md font-extrabold font-mono ${selectedApp.adaptedResume.atsScore >= 85 ? "text-emerald-400" : "text-amber-400"}`}>
                            {selectedApp.adaptedResume.atsScore}% Match
                          </span>
                        </div>

                        {/* Description rationale */}
                        <div className="p-3 bg-zinc-950 rounded bg-indigo-500/[0.02] border border-zinc-800/80 text-[12px] text-zinc-300 leading-relaxed font-sans">
                          {selectedApp.adaptedResume.explanation}
                        </div>

                        {/* Bullet point comparisons */}
                        <div className="space-y-3">
                          <h5 className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Tailored Experience Bullet Points</h5>
                          {selectedApp.adaptedResume.bulletPoints.map((bp, idx) => (
                            <div key={idx} className="space-y-1.5 p-3.5 bg-zinc-950 border border-zinc-850 rounded">
                              <span className="text-[9px] font-mono text-rose-400 uppercase tracking-wider block">Raw Master Bullet:</span>
                              <p className="text-[11.5px] text-zinc-500 line-through leading-snug">{bp.original}</p>

                              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block pt-1.5">ATS-Optimized Bullet:</span>
                              <p className="text-[12px] text-zinc-200 leading-relaxed font-sans">{bp.customized}</p>

                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {bp.skillsAddressed.map(sk => (
                                  <span key={sk} className="text-[9.5px] text-emerald-400 font-mono bg-emerald-500/[0.04] px-1.5 py-0.5 rounded">
                                    ✓ {sk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Keyword suggestions */}
                        {selectedApp.adaptedResume.suggestedSkillsAdded.length > 0 && (
                          <div className="pt-3">
                            <h5 className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider mb-2">Recommended Keyword Tags to add</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedApp.adaptedResume.suggestedSkillsAdded.map(item => (
                                <span key={item} className="text-[10px] text-amber-300 font-mono bg-amber-500/5 px-2 py-0.5 rounded border border-amber-900/30">
                                  + {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Position Specifications</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">{relatedInternship.description}</p>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-850 text-xs">
                        <div>
                          <span className="text-zinc-500 block">Location Preference</span>
                          <span className="text-white font-medium">{relatedInternship.location} / {relatedInternship.type}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Internship Period</span>
                          <span className="text-white font-medium">{relatedInternship.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right segment (Generative Cover letter) */}
                  <div className="space-y-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col h-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          Customized AI Cover Letter
                        </h4>
                        <button
                          onClick={() => selectedApp.coverLetter && copyToClipboard(selectedApp.coverLetter, "cover")}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                        >
                          {copiedMap["cover"] ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Text
                            </>
                          )}
                        </button>
                      </div>

                      {/* Letter Textarea for custom touchups */}
                      <textarea
                        rows={16}
                        value={selectedApp.coverLetter || ""}
                        onChange={e => onUpdateCoverLetter(selectedApp.id, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded p-4 text-[12.5px] leading-relaxed font-mono focus:outline-none text-zinc-200 resize-none flex-1"
                        placeholder="AI Cover Letter generating..."
                      />
                      <p className="text-[10px] text-zinc-500 mt-2 italic font-sans">
                        Tip: You can edit or fine-tune this generate letter directly before printing or copy-pasting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status footer controllers */}
              <div className="border-t border-zinc-800 pt-6 mt-8 flex flex-col sm:flex-row justify-between gap-4 items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">Fast Status Selector:</span>
                  <div className="bg-zinc-900 p-1.5 border border-zinc-800 rounded-lg flex gap-1.5">
                    {["Matched", "AI Tailored", "Applying", "Applied", "Interview", "Offer"].map((colId) => (
                      <button
                        key={colId}
                        onClick={() => onUpdateStatus(selectedApp.id, colId as Application["status"])}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${selectedApp.status === colId ? "bg-emerald-500 text-zinc-950 font-black" : "text-zinc-400 hover:text-zinc-200"}`}
                      >
                        {colId}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const printWindow = window.open("", "_blank");
                      if (printWindow && selectedApp.coverLetter) {
                        printWindow.document.write(`
                          <html>
                            <head><title>Cover Letter - ${selectedApp.internshipTitle}</title></head>
                            <body style="font-family: Arial, sans-serif; padding: 50px; line-height: 1.6; max-width: 700px; margin: 0 auto; color: #333;">
                              <p style="white-space: pre-wrap;">${selectedApp.coverLetter}</p>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }}
                    className="flex-1 sm:flex-none border border-zinc-800 text-white font-semibold px-4 py-2 rounded-lg text-xs hover:bg-zinc-900 transition-colors"
                  >
                    Print Cover Letter
                  </button>
                  <button
                    onClick={() => setSelectedAppId(null)}
                    className="flex-1 sm:flex-none bg-emerald-500 text-zinc-950 font-black px-5 py-2 rounded-lg text-xs hover:bg-emerald-600 transition-colors"
                  >
                    Close Console
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
