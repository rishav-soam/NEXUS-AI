import React, { useState } from "react";
import { Internship } from "../types";
import { Search, MapPin, DollarSign, Briefcase, Zap, Sparkles, Filter, CheckCircle2, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";

interface InternshipSearchProps {
  internships: Internship[];
  isLoading: boolean;
  onSearch: (query: string, location: string, stipendsOnly: boolean) => void;
  onApplySingle: (internship: Internship) => void;
  onBatchApply: (items: Internship[]) => void;
  onScrapeTrigger: () => void;
}

export default function InternshipSearch({
  internships,
  isLoading,
  onSearch,
  onApplySingle,
  onBatchApply,
  onScrapeTrigger
}: InternshipSearchProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [stipendsOnly, setStipendsOnly] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("All");
  
  // Selected checkboxes for batch applying
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location, stipendsOnly);
  };

  const toggleSelectAll = () => {
    const visibleIds = filteredInternships.map(i => i.id);
    const allSelected = visibleIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(selectedIds.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedIds([...new Set([...selectedIds, ...visibleIds])]);
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Filter internships on client client-side on top of API queries
  const filteredInternships = internships.filter(item => {
    if (selectedType !== "All" && item.type !== selectedType) return false;
    return true;
  });

  const handleBatchClick = () => {
    const toApply = internships.filter(i => selectedIds.includes(i.id) && !i.applied);
    if (toApply.length === 0) return;
    onBatchApply(toApply);
    // clear select
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6" id="internship_search_and_scrapes">
      {/* Search Bar Container */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden" id="search_hero_form">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-[60px]"></div>
        
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Keyword Input */}
            <div className="md:col-span-5 relative">
              <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">What role are you targeting?</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  id="search_query_input"
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="e.g. Software Engineer, React, Frontend..."
                  className="w-full bg-slate-950/80 border border-white/10 hover:border-white/15 focus:border-cyan-400 text-sm text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all"
                />
              </div>
            </div>

            {/* Location Selector */}
            <div className="md:col-span-4 relative">
              <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Geographic Filter</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  id="search_location_input"
                  type="text"
                  placeholder="e.g. Remote, Austin, New York"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 hover:border-white/15 focus:border-cyan-400 text-sm text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="md:col-span-3 flex items-end gap-2">
              <button
                id="btn_submit_search"
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-xs font-bold text-white shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                SCAN INTERNSHIPS
              </button>

              <button
                id="btn_trigger_manual_scrape"
                type="button"
                onClick={onScrapeTrigger}
                className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all flex items-center justify-center"
                title="Force scraper crawl"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stipends toggles & Types selectors */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5 text-xs">
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="toggle_stipend_has"
                  type="checkbox"
                  checked={stipendsOnly}
                  onChange={e => setStipendsOnly(e.target.checked)}
                  className="rounded border-white/20 bg-slate-950 text-cyan-500 focus:outline-none w-4 h-4 accent-cyan-400"
                />
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Stipend Roles Only (Exclude unpaid/academic credit)
                </span>
              </label>

              <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Filters:</span>
                <div className="flex bg-slate-950/60 p-1 border border-white/5 rounded-lg gap-1">
                  {["All", "Remote", "Hybrid", "Onsite"].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${selectedType === type ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              AUTOMATED ONLINE SEARCH READY
            </div>
          </div>
        </form>
      </div>

      {/* Sourced Postings Header & Batch action menu */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden" id="search_results_container">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px]"></div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Application Control Center
              <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs px-2 py-0.5 rounded-full">
                {filteredInternships.length} Sourced
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">Automated sourcing and smart-tailoring active</p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {selectedIds.length > 0 && (
              <button
                id="btn_batch_apply_selected"
                onClick={handleBatchClick}
                className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 animate-bounce" />
                BATCH ONE-CLICK APPLY ({selectedIds.length} SELECTED)
              </button>
            )}
            <button
              onClick={toggleSelectAll}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-slate-350 transition-colors"
            >
              {selectedIds.length === filteredInternships.length ? "Deselect All" : "Select All Filters"}
            </button>
          </div>
        </div>

        {/* Listings Display Grid / Queue */}
        <div className="space-y-4" id="scraped_listings_grid">
          {isLoading ? (
            <div className="p-16 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-slate-400 text-sm font-semibold">Performing web diagnostics & indexing matching internships...</p>
              <p className="text-slate-500 text-[11px]">Connecting sandbox scraper pipeline & fetching stipends</p>
            </div>
          ) : filteredInternships.length === 0 ? (
            <div className="p-16 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-400" />
              <p className="text-slate-350 text-sm font-bold">No matching internship listings indexed.</p>
              <p className="text-slate-500 text-xs">Try clearing search filters or press the scan button to simulation-scrawl fresh roles.</p>
            </div>
          ) : (
            filteredInternships.map(item => {
              const isChecked = selectedIds.includes(item.id);
              
              return (
                <div
                  key={item.id}
                  className={`bg-white/5 border transition-all rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${item.applied ? "border-emerald-500/20 bg-emerald-500/[0.01] opacity-75" : isChecked ? "border-cyan-500/50 bg-cyan-500/[0.02]" : "border-white/5 hover:border-cyan-500/30"}`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox trigger for bulk operation */}
                    {!item.applied && (
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOne(item.id)}
                        className="mt-1 rounded bg-slate-950 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer w-4 h-4 shrink-0 accent-cyan-400"
                      />
                    )}
                    
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-100 text-sm md:text-base tracking-tight">{item.title}</span>
                        <span className="bg-slate-900 border border-white/5 text-[10px] text-slate-400 px-2 py-0.5 rounded">
                          {item.source}
                        </span>
                        
                        {item.stipend.hasStipend ? (
                          <span className="bg-emerald-950/40 text-[10.5px] text-emerald-400 border border-emerald-900/40 px-2.5 py-0.5 rounded font-medium">
                            {item.stipend.amount}
                          </span>
                        ) : (
                          <span className="bg-slate-900/60 text-[10.5px] text-slate-400 border border-zinc-800 px-2.5 py-0.5 rounded">
                            Unpaid / Academic Credit
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 font-medium">
                        {item.company} &bull; <MapPin className="inline w-3 h-3 text-slate-500" /> {item.location} &bull; {item.type} &bull; Duration: {item.duration}
                      </div>

                      <p className="text-xs text-slate-350 line-clamp-2 md:line-clamp-1 max-w-4xl pt-1">
                        {item.description}
                      </p>

                      {/* Overlapping skills tags */}
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {item.requirements.map(req => (
                          <span key={req} className="bg-slate-950 text-[10px] text-cyan-400 border border-white/[0.06] font-mono px-2 py-0.5 rounded">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto self-end md:self-center shrink-0 border-t border-white/5 md:border-t-0 pt-3 md:pt-0">
                    <div className="hidden lg:block text-right">
                      {item.applied ? (
                        <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ADDED TO KANBAN BOARD
                        </div>
                      ) : (
                        <>
                          <div className="text-xs text-cyan-400 font-semibold tracking-tight">AI Pipeline Configured</div>
                          <div className="text-[10px] text-slate-500">Auto-Formats ATS resume & cover letter</div>
                        </>
                      )}
                    </div>

                    {item.applied ? (
                      <button
                        disabled
                        className="w-full md:w-auto px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold"
                      >
                        SUBMITTED
                      </button>
                    ) : (
                      <button
                        id={`btn_one_click_apply_${item.id}`}
                        onClick={() => onApplySingle(item)}
                        className="w-full md:w-auto px-4.5 py-2.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/35 rounded-xl text-xs font-bold tracking-wide hover:shadow-[0_0_12px_rgba(34,211,238,0.18)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" /> ONE-CLICK APPLY
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
