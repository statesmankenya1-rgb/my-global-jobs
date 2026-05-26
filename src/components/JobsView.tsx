import { useState } from "react";
import { Job } from "../types";
import { Search, MapPin, Grid, Briefcase, Sparkles, Filter } from "lucide-react";

interface JobsViewProps {
  jobsList: Job[];
  searchKeyword: string;
  setSearchKeyword: (s: string) => void;
  onOpenApplyModal: (job: Job) => void;
}

export default function JobsView({
  jobsList,
  searchKeyword,
  setSearchKeyword,
  onOpenApplyModal
}: JobsViewProps) {
  const [regionFilter, setRegionFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredJobs = jobsList.filter((job) => {
    const sTerm = searchKeyword.toLowerCase();
    const matchesSearch = 
      job.title.toLowerCase().includes(sTerm) ||
      job.company.toLowerCase().includes(sTerm) ||
      job.location.toLowerCase().includes(sTerm);

    const matchesRegion = regionFilter === "all" || job.region === regionFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;

    return matchesSearch && matchesRegion && matchesType;
  });

  return (
    <div className="bg-neutral-950 min-h-screen px-4 py-8 md:px-8 max-w-5xl mx-auto w-full">
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-serif font-black text-3xl md:text-4xl text-white mb-2">
          Explore Active Vacancies
        </h1>
        <p className="text-zinc-500 text-sm md:text-md">
          Discover vetted global roles. Our AI Career Coach pre-scans your CV to calculate immediate match scoring.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 md:p-5 flex flex-col gap-4 mb-8 shadow-xl">
        <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
          <Search className="w-5 h-5 text-zinc-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Filter by title, skills keywords, or company..."
            className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder:text-zinc-600"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Region Select */}
          <div className="flex-1 flex items-center gap-2.5 bg-zinc-950 border border-zinc-800 px-3 py-2.5 rounded-xl">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              className="bg-transparent border-none text-zinc-400 text-xs focus:outline-none w-full cursor-pointer select-none"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="all" className="bg-zinc-900">All Regions</option>
              <option value="Africa" className="bg-zinc-900">Africa Hubs</option>
              <option value="UK" className="bg-zinc-900">United Kingdom</option>
              <option value="UAE" className="bg-zinc-900">United Arab Emirates</option>
              <option value="Canada" className="bg-zinc-900">Canada</option>
              <option value="USA" className="bg-zinc-900">USA</option>
              <option value="Remote" className="bg-zinc-900">Remote Only</option>
            </select>
          </div>

          {/* Type Select */}
          <div className="flex-1 flex items-center gap-2.5 bg-zinc-950 border border-zinc-800 px-3 py-2.5 rounded-xl">
            <Briefcase className="w-4 h-4 text-zinc-500" />
            <select
              className="bg-transparent border-none text-zinc-400 text-xs focus:outline-none w-full cursor-pointer"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all" className="bg-zinc-900">All Job Types</option>
              <option value="Full-time" className="bg-zinc-900">Full-time</option>
              <option value="Remote" className="bg-zinc-900">Remote</option>
              <option value="Contract" className="bg-zinc-900">Contract</option>
              <option value="Part-time" className="bg-zinc-900">Part-time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result list count */}
      <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-5">
        Showing {filteredJobs.length} matching position{filteredJobs.length !== 1 ? "s" : ""}
      </p>

      {/* Job cards stack */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onOpenApplyModal(job)}
              className="bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/30 rounded-xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer transition-all hover:translate-y-[-1px] hover:shadow-lg shadow-zinc-950/20"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 items-center">
                  <h3 className="text-md font-bold text-white group-hover:text-amber-500">{job.title}</h3>
                  {job.tag && (
                    <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-mono uppercase font-bold tracking-wider">
                      {job.tag}
                    </span>
                  )}
                </div>

                <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5 flex-wrap">
                  <span className="text-amber-500 font-semibold">{job.company}</span>
                  <span className="text-zinc-700 font-light">•</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] bg-zinc-800/50 text-zinc-400 border border-zinc-800 px-2 py-1 rounded-full font-medium">
                    {job.type}
                  </span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                     {job.match}% match
                  </span>
                  <span className="text-[10px] text-zinc-500 font-light ml-1">{job.posted}</span>
                </div>
              </div>

              {/* Action Column */}
              <div className="w-full md:w-auto flex md:flex-col items-end gap-3 border-t md:border-t-0 border-zinc-800/60 pt-4 md:pt-0 self-stretch md:self-auto justify-between">
                <div>
                  <span className="block text-right text-xs text-zinc-500 font-medium">Salary / Compensation</span>
                  <span className="block text-md font-extrabold text-amber-500 font-serif leading-none mt-1">{job.salary}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenApplyModal(job);
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-all cursor-pointer shadow-md shadow-amber-500/5 hover:shadow-amber-500/20 active:scale-95"
                >
                  Quick Apply ⚡
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-inner">
            <Briefcase className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-md font-bold text-white mb-1">No vacancies found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-4">
              Try adjusting your search query, choosing alternate job filters, or looking under broader categories.
            </p>
            <button
              onClick={() => { setSearchKeyword(""); setRegionFilter("all"); setTypeFilter("all"); }}
              className="text-xs text-amber-500 hover:underline cursor-pointer"
            >
              Clear filters and view all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
