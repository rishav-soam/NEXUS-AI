import React, { useState } from "react";
import { UserProfile } from "../types";
import { Plus, Trash, Sparkles, FileText, Download, CheckCircle, ShieldAlert } from "lucide-react";

interface ResumeBuilderProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
}

export default function ResumeBuilder({ profile, onChange }: ResumeBuilderProps) {
  const [newSkill, setNewSkill] = useState("");
  const [newRole, setNewRole] = useState("");

  const handleProfileFieldChange = (key: string, value: any) => {
    onChange({ ...profile, [key]: value });
  };

  const handleEducationChange = (key: string, value: string) => {
    onChange({
      ...profile,
      education: { ...profile.education, [key]: value }
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      onChange({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (sk: string) => {
    onChange({
      ...profile,
      skills: profile.skills.filter(s => s !== sk)
    });
  };

  const addTargetRole = () => {
    if (newRole.trim() && !profile.targetRoles.includes(newRole.trim())) {
      onChange({
        ...profile,
        targetRoles: [...profile.targetRoles, newRole.trim()]
      });
      setNewRole("");
    }
  };

  const removeTargetRole = (role: string) => {
    onChange({
      ...profile,
      targetRoles: profile.targetRoles.filter(r => r !== role)
    });
  };

  const addExperience = () => {
    onChange({
      ...profile,
      experience: [
        ...profile.experience,
        { role: "Intern / Software Engineer", company: "Company Name", duration: "Jun 2025 - Present", description: "Led development of scalable web products. Automated CI/CD deployments and configured responsive user portals." }
      ]
    });
  };

  const updateExperience = (index: number, key: string, value: string) => {
    const updatedExp = [...profile.experience];
    updatedExp[index] = { ...updatedExp[index], [key]: value };
    onChange({ ...profile, experience: updatedExp });
  };

  const removeExperience = (index: number) => {
    onChange({
      ...profile,
      experience: profile.experience.filter((_, idx) => idx !== index)
    });
  };

  const addProject = () => {
    onChange({
      ...profile,
      projects: [
        ...profile.projects,
        { title: "Personal Analytics Platform", description: "Interactive analytics dashboards tracking user workflow data and exports.", techStack: ["React", "Typescript", "Tailwind CSS"], link: "https://github.com/" }
      ]
    });
  };

  const updateProject = (index: number, key: string, value: any) => {
    const updatedProj = [...profile.projects];
    if (key === "techStack") {
      updatedProj[index] = { ...updatedProj[index], techStack: value.split(",").map((s: string) => s.trim()) };
    } else {
      updatedProj[index] = { ...updatedProj[index], [key]: value };
    }
    onChange({ ...profile, projects: updatedProj });
  };

  const removeProject = (index: number) => {
    onChange({
      ...profile,
      projects: profile.projects.filter((_, idx) => idx !== index)
    });
  };

  // Simulates printing the ATS Resume
  const triggerPrintResume = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download/print your resume.");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>${profile.fullName} - ATS Optimized Resume</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            h1 { font-size: 26px; text-transform: uppercase; margin-bottom: 5px; color: #111; border-bottom: 2px solid #333; padding-bottom: 5px; }
            .subtitle { font-size: 14px; text-align: center; margin-bottom: 30px; letter-spacing: 0.5px; }
            h2 { font-size: 18px; text-transform: uppercase; margin-top: 25px; border-bottom: 1px solid #777; padding-bottom: 3px; color: #222; }
            .item { margin-bottom: 15px; }
            .item-header { display: flex; justify-content: space-between; font-weight: bold; }
            .skills-list { font-weight: 500; }
            .italic-line { font-style: italic; color: #555; }
            .bullet { margin-left: 20px; text-align: justify; }
          </style>
        </head>
        <body>
          <h1 style="text-align: center;">${profile.fullName}</h1>
          <div class="subtitle" style="text-align: center;">
            ${profile.email} &bull; ${profile.phone} &bull; Target Roles: ${profile.targetRoles.join(", ")}
          </div>
          
          <h2>Education</h2>
          <div class="item">
            <div class="item-header">
              <span>${profile.education.institution}</span>
              <span>Graduation: ${profile.education.graduationYear}</span>
            </div>
            <div class="italic-line">${profile.education.degree} in ${profile.education.major} ${profile.education.gpa ? `(GPA: ${profile.education.gpa})` : ""}</div>
          </div>

          <h2>Key Skills & Technologies</h2>
          <p class="skills-list">${profile.skills.join(" | ")}</p>

          <h2>Professional Experience</h2>
          ${profile.experience.map(exp => `
            <div class="item">
              <div class="item-header">
                <span>${exp.role} &mdash; ${exp.company}</span>
                <span>${exp.duration}</span>
              </div>
              <p class="bullet">&bull; ${exp.description}</p>
            </div>
          `).join("")}

          <h2>Featured Projects</h2>
          ${profile.projects.map(proj => `
            <div class="item">
              <div class="item-header">
                <span>${proj.title}</span>
                <span>${proj.techStack.join(", ")}</span>
              </div>
              <p class="bullet">&bull; ${proj.description} ${proj.link ? `(Link: ${proj.link})` : ""}</p>
            </div>
          `).join("")}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="resume_builder_main">
      {/* Editor Panel */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl" id="profile_contact_card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            Personal & Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                id="profile_name"
                type="text"
                value={profile.fullName}
                onChange={e => handleProfileFieldChange("fullName", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Alex Mercer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                id="profile_email"
                type="email"
                value={profile.email}
                onChange={e => handleProfileFieldChange("email", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="alex.mercer@gmail.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Phone Number</label>
              <input
                id="profile_phone"
                type="text"
                value={profile.phone}
                onChange={e => handleProfileFieldChange("phone", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="+1 (555) 019-2834"
              />
            </div>
          </div>
        </div>

        {/* Target Roles & Academic Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl" id="profile_academic_card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </span>
            Education & Roles Target
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Institution / University</label>
              <input
                id="profile_edu_inst"
                type="text"
                value={profile.education.institution}
                onChange={e => handleEducationChange("institution", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Massachusetts Institute of Technology"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Degree & Major</label>
              <input
                id="profile_edu_degree"
                type="text"
                value={`${profile.education.degree} in ${profile.education.major}`}
                onChange={e => {
                  const parts = e.target.value.split(" in ");
                  handleEducationChange("degree", parts[0] || "Bachelor");
                  handleEducationChange("major", parts[1] || "Computer Science");
                }}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="B.Sc in Computer Science"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Grad Year / GPA</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="profile_edu_year"
                  type="text"
                  value={profile.education.graduationYear}
                  onChange={e => handleEducationChange("graduationYear", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
                  placeholder="2027"
                />
                <input
                  id="profile_edu_gpa"
                  type="text"
                  value={profile.education.gpa || ""}
                  onChange={e => handleEducationChange("gpa", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
                  placeholder="GPA (e.g. 3.9)"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Target Job Roles</label>
            <div className="flex gap-2">
              <input
                id="profile_role_input"
                type="text"
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTargetRole()}
                className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-1.5 text-sm focus:outline-none"
                placeholder="Product Engineer, UI Tester..."
              />
              <button
                id="btn_add_role"
                onClick={addTargetRole}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.targetRoles.map((role, idx) => (
                <span key={idx} className="bg-blue-950/40 text-blue-300 border border-blue-900/40 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  {role}
                  <button onClick={() => removeTargetRole(role)} className="hover:text-red-400 focus:outline-none">&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl" id="profile_experience_card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="p-1.5 bg-yellow-500/10 text-yellow-400 rounded-lg">
                <Plus className="w-5 h-5" />
              </span>
              Work & Project Experience
            </h3>
            <button
              id="btn_add_exp"
              onClick={addExperience}
              className="text-emerald-400 hover:text-emerald-300 text-xs font-medium flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
            >
              <Plus className="w-3.5 h-3.5" /> Add Experience
            </button>
          </div>

          <div className="space-y-4">
            {profile.experience.map((exp, index) => (
              <div key={index} className="bg-zinc-950 p-4 border border-zinc-800 rounded-lg space-y-3 relative group">
                <button
                  onClick={() => removeExperience(index)}
                  className="absolute top-3 right-3 text-zinc-500 hover:text-red-400 p-1 rounded-md transition-colors"
                  title="Delete Entry"
                >
                  <Trash className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-semibold mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={e => updateExperience(index, "company", e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-semibold mb-1">Role / Job Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={e => updateExperience(index, "role", e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-semibold mb-1">Duration / Date Range</label>
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={e => updateExperience(index, "duration", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded px-3 py-1.5 text-xs max-w-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-semibold mb-1">Responsibilities & Accomplishments (ATS Input)</label>
                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={e => updateExperience(index, "description", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-3 text-xs focus:outline-none resize-none font-mono"
                    placeholder="Describe your achievements..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl" id="profile_projects_card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <FileText className="w-5 h-5" />
              </span>
              Key Practical Projects
            </h3>
            <button
              id="btn_add_proj"
              onClick={addProject}
              className="text-emerald-400 hover:text-emerald-300 text-xs font-medium flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>

          <div className="space-y-4">
            {profile.projects.map((proj, index) => (
              <div key={index} className="bg-zinc-950 p-4 border border-zinc-800 rounded-lg space-y-3 relative group">
                <button
                  onClick={() => removeProject(index)}
                  className="absolute top-3 right-3 text-zinc-500 hover:text-red-400 p-1 rounded-md transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-semibold mb-1">Project Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={e => updateProject(index, "title", e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-semibold mb-1">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={proj.techStack.join(", ")}
                      onChange={e => updateProject(index, "techStack", e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-semibold mb-1">Project Description</label>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={e => updateProject(index, "description", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-3 text-xs focus:outline-none resize-none font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview & ATS Optimization Tracker */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl text-white sticky top-6" id="ats_resume_checklist_card">
          <div className="flex border-b border-zinc-800 pb-4 mb-4 justify-between items-center">
            <div>
              <h3 className="text-md font-bold tracking-tight text-white flex items-center gap-2">
                ATS Analyzer Engine
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Real-time resume compliance score</p>
            </div>
            <button
              id="btn_download_ats"
              onClick={triggerPrintResume}
              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/10"
            >
              <Download className="w-3.5 h-3.5" /> PDF/Print
            </button>
          </div>

          {/* Core Skills Pool */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Master Skills Array</label>
            <div className="flex gap-2 mb-3">
              <input
                id="new_skill_input"
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addSkill()}
                className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                placeholder="Python, AWS, Next.js..."
              />
              <button
                id="btn_add_skill"
                onClick={addSkill}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-semibold px-3 py-1.5 rounded-lg text-xs border border-emerald-500/20"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
              {profile.skills.map(sk => (
                <span key={sk} className="bg-zinc-800 text-zinc-200 border border-zinc-700/60 text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                  {sk}
                  <button onClick={() => removeSkill(sk)} className="text-zinc-400 hover:text-red-400 font-bold">&times;</button>
                </span>
              ))}
            </div>
          </div>

          {/* ATS Best Practice Checklist */}
          <div className="space-y-4">
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/80">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-zinc-300">Resume Density Score</span>
                <span className="text-xs font-black text-emerald-400">
                  {profile.skills.length >= 8 && profile.experience.length >= 2 ? "92% (Excellent)" : "68% (Needs entries)"}
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full transition-all duration-300"
                  style={{ width: profile.skills.length >= 8 && profile.experience.length >= 2 ? "92%" : "68%" }}
                />
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-200 block">Single-page ATS Layout:</strong>
                  Your contact info, skills, education, experience structure perfectly matches standard parser filters.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-200 block">Action-Oriented Language:</strong>
                  Using strong verbs like Lead, Optimize, Automated ensures parsing of clear engineering metrics.
                </div>
              </div>
              {profile.skills.length < 8 && (
                <div className="flex items-start gap-2 text-yellow-400">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-yellow-300 block">Skill Under-indexing Warning:</strong>
                    Add at least 8 specific software tools to pass modern search keyword filters.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Mini Preview Box */}
          <div className="mt-6 border-t border-zinc-800 pt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Live Document Outline</h4>
            <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 font-serif text-[11px] leading-relaxed text-zinc-300 max-h-56 overflow-y-auto space-y-3">
              <div className="text-center font-bold tracking-wide text-zinc-100 uppercase pb-1 border-b border-zinc-900">
                {profile.fullName || "Your Full Name"}
              </div>
              <div className="text-center text-[10px] text-zinc-500 italic pb-2">
                {profile.email} &bull; {profile.phone}
              </div>
              <div>
                <span className="font-bold border-b border-zinc-900 block text-zinc-200 mb-1">Education</span>
                {profile.education.institution} &bull; {profile.education.degree} ({profile.education.graduationYear})
              </div>
              <div>
                <span className="font-bold border-b border-zinc-900 block text-zinc-200 mb-1">Skills</span>
                <span className="font-mono text-[10px] text-emerald-400">{profile.skills.join(" • ")}</span>
              </div>
              <div>
                <span className="font-bold border-b border-zinc-900 block text-zinc-200 mb-1">Selected Experience</span>
                {profile.experience.map((e, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="flex justify-between font-bold text-zinc-200 text-[10px]">
                      <span>{e.role} @ {e.company}</span>
                      <span>{e.duration}</span>
                    </div>
                    <p className="text-zinc-400 mt-0.5 italic text-[10px]">{e.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
