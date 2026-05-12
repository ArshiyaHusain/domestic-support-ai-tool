/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Users, 
  DollarSign, 
  Lightbulb, 
  Target, 
  Languages, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  Info,
  Loader2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Globe
} from 'lucide-react';
import { BusinessData, MatchingResponse } from './types';
import { 
  PROVINCES, 
  INDUSTRIES, 
  BUSINESS_STAGES, 
  EMPLOYEE_RANGES, 
  REVENUE_RANGES, 
  OWNERSHIP_CATEGORIES, 
  SUPPORT_TYPES, 
  OBJECTIVES, 
  LEGAL_ENTITIES 
} from './constants';
import { matchBusinessSupport } from './services/matchingService';

const INITIAL_DATA: BusinessData = {
  country: "CA",
  province: [],
  city: "",
  business_presence: "",
  legal_entity: "",
  registered: false,
  year_established: "",
  company_name: "",
  industry: [],
  product_service: "",
  business_model: "",
  stage: "",
  employees: "",
  revenue: "",
  ownership: [],
  rd_activity: false,
  innovation: false,
  ip_status: false,
  ip_support_needed: false,
  support_types: [],
  objectives: [],
  market_scope: "",
  export_plan: false,
  export_support_needed: false,
  hiring_plan: false,
  hiring_targets: [],
  compliance_support: false,
  infrastructure_support: false,
  timeline: "",
  business_plan_ready: false,
  language: "",
  previous_funding: false,
  accelerator_interest: false,
  constraints: "",
  consent: false
};

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BusinessData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MatchingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateData = (updates: Partial<BusinessData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const matchResults = await matchBusinessSupport(data);
      setResults(matchResults);
      setStep(100); // Result step
    } catch (err) {
      setError("Failed to generate recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentStep = useMemo(() => {
    switch(step) {
      case 0: return {
        title: "Welcome to YouCanB",
        description: "Let's find the best support programs for your Canadian business.",
        content: (
          <div className="space-y-6">
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
              <p className="text-sm text-blue-800 leading-relaxed">
                This tool analyzes your business profile to match you with grants, loans, and advisory services from federal and provincial governments. Your answers help us filter hundreds of available programs.
              </p>
            </div>
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
            >
              Start Questionnaire <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )
      };
      case 1: return {
        title: "Location & Presence",
        description: "Where is your business located?",
        content: (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Provinces/Territories</label>
              <div className="grid grid-cols-2 gap-2">
                {PROVINCES.map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      const newProvinces = data.province.includes(p) 
                        ? data.province.filter(x => x !== p)
                        : [...data.province, p];
                      updateData({ province: newProvinces });
                    }}
                    className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                      data.province.includes(p) 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City/Primary Town</label>
              <input 
                type="text" 
                value={data.city}
                onChange={e => updateData({ city: e.target.value })}
                placeholder="e.g. Toronto"
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl outline-hidden focus:border-zinc-900 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Business Presence</label>
              <select 
                value={data.business_presence}
                onChange={e => updateData({ business_presence: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl outline-hidden focus:border-zinc-900 transition-all appearance-none"
              >
                <option value="">Select presence type</option>
                <option value="Physical Office">Physical Office/Store</option>
                <option value="Remote / Virtual">Remote / Virtual</option>
                <option value="Home-based">Home-based</option>
              </select>
            </div>
          </div>
        )
      };
      case 2: return {
        title: "Legal Identity",
        description: "Tell us about your business structure.",
        content: (
          <div className="space-y-6">
             <div>
              <label className="block text-sm font-medium mb-2">Company Name (Optional)</label>
              <input 
                type="text" 
                value={data.company_name}
                onChange={e => updateData({ company_name: e.target.value })}
                placeholder="Legal or Trade Name"
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl outline-hidden focus:border-zinc-900 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Legal Entity Type</label>
              <select 
                value={data.legal_entity}
                onChange={e => updateData({ legal_entity: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl outline-hidden focus:border-zinc-900 transition-all appearance-none"
              >
                <option value="">Select structure</option>
                {LEGAL_ENTITIES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
              <div>
                <p className="font-medium text-sm">Is your business registered?</p>
                <p className="text-xs text-zinc-500">Federally or provincially</p>
              </div>
              <button 
                onClick={() => updateData({ registered: !data.registered })}
                className={`relative w-12 h-6 rounded-full transition-all ${data.registered ? 'bg-blue-600' : 'bg-zinc-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.registered ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            {data.registered && (
               <div>
                <label className="block text-sm font-medium mb-2">Year Established</label>
                <input 
                  type="number" 
                  value={data.year_established}
                  onChange={e => updateData({ year_established: e.target.value })}
                  placeholder="e.g. 2021"
                  className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl outline-hidden focus:border-zinc-900 transition-all"
                />
              </div>
            )}
          </div>
        )
      };
      case 3: return {
        title: "Industry & Product",
        description: "What does your business do?",
        content: (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Industry/Sectors</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map(i => (
                  <button
                    key={i}
                    onClick={() => {
                      const newIndustries = data.industry.includes(i) 
                        ? data.industry.filter(x => x !== i)
                        : [...data.industry, i];
                      updateData({ industry: newIndustries });
                    }}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                      data.industry.includes(i) 
                        ? 'bg-zinc-900 border-zinc-900 text-white' 
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Product/Service Description</label>
              <textarea 
                value={data.product_service}
                onChange={e => updateData({ product_service: e.target.value })}
                placeholder="What do you build or sell?"
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl outline-hidden focus:border-zinc-900 transition-all min-h-[100px]"
              />
            </div>
            <div>
               <label className="block text-sm font-medium mb-2">Business Model</label>
               <div className="grid grid-cols-2 gap-3">
                  {['B2B', 'B2C', 'B2G', 'Marketplace'].map(m => (
                    <button
                      key={m}
                      onClick={() => updateData({ business_model: m })}
                      className={`p-3 text-sm rounded-xl border text-center transition-all ${
                        data.business_model === m ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        )
      };
      case 4: return {
        title: "Size & Stage",
        description: "Current scale of your operations.",
        content: (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Business Stage</label>
              <div className="grid grid-cols-1 gap-2">
                {BUSINESS_STAGES.map(s => (
                  <button
                    key={s}
                    onClick={() => updateData({ stage: s })}
                    className={`p-4 text-sm rounded-xl border text-left transition-all ${
                      data.stage === s ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium mb-2">Employees</label>
                  <select 
                    value={data.employees}
                    onChange={e => updateData({ employees: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl outline-hidden appearance-none"
                  >
                    <option value="">Select range</option>
                    {EMPLOYEE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium mb-2">Annual Revenue</label>
                  <select 
                    value={data.revenue}
                    onChange={e => updateData({ revenue: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl outline-hidden appearance-none"
                  >
                    <option value="">Select range</option>
                    {REVENUE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
               </div>
            </div>
          </div>
        )
      };
      case 5: return {
        title: "Equity & Ownership",
        description: "Identity-based support categories.",
        content: (
          <div className="space-y-6">
             <p className="text-xs text-zinc-500 bg-zinc-50 p-4 rounded-xl leading-relaxed">
              Many Canadian programs offer targeted funding for specific ownership groups to reduce barriers. This information is used ONLY to match you with relevant programs.
            </p>
            <div className="grid grid-cols-1 gap-2">
                {OWNERSHIP_CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      const newOwn = data.ownership.includes(c) 
                        ? data.ownership.filter(x => x !== c)
                        : [...data.ownership, c];
                      updateData({ ownership: newOwn });
                    }}
                    className={`p-4 text-sm rounded-xl border text-left transition-all ${
                      data.ownership.includes(c) 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {c}
                      {data.ownership.includes(c) && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )
      };
      case 6: return {
        title: "Innovation & R&D",
        description: "Are you developing new technology?",
        content: (
          <div className="space-y-4">
             {[
               { label: "Active R&D involvement", key: "rd_activity", desc: "Developing new products or processes" },
               { label: "High Level of Innovation", key: "innovation", desc: "First-to-market or novel tech" },
               { label: "IP Ownership", key: "ip_status", desc: "Owned patents, trademarks, or trade secrets" },
               { label: "IP Support Needed", key: "ip_support_needed", desc: "Help with filings or strategy" }
             ].map((item) => (
               <div key={item.key} className="flex items-center justify-between p-4 border border-zinc-200 rounded-2xl hover:border-zinc-300 transition-all cursor-pointer" onClick={() => updateData({ [item.key]: !data[item.key as keyof BusinessData] })}>
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${data[item.key as keyof BusinessData] ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300'}`}>
                    {data[item.key as keyof BusinessData] && <CheckCircle2 className="w-4 h-4" />}
                  </div>
               </div>
             ))}
          </div>
        )
      };
      case 7: return {
        title: "Objectives & Support",
        description: "What are your top 3 goals?",
        content: (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Priority Objectives</label>
              <div className="grid grid-cols-1 gap-2">
                {OBJECTIVES.map(o => (
                  <button
                    key={o}
                    disabled={data.objectives.length >= 3 && !data.objectives.includes(o)}
                    onClick={() => {
                      const newObj = data.objectives.includes(o) 
                        ? data.objectives.filter(x => x !== o)
                        : [...data.objectives, o];
                      updateData({ objectives: newObj });
                    }}
                    className={`p-3 text-xs rounded-xl border text-left transition-all ${
                      data.objectives.includes(o) 
                        ? 'bg-zinc-900 border-zinc-900 text-white' 
                        : 'border-zinc-200 hover:border-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">Preferred Support Types</label>
              <div className="flex flex-wrap gap-2">
                {SUPPORT_TYPES.map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      const newS = data.support_types.includes(s) 
                        ? data.support_types.filter(x => x !== s)
                        : [...data.support_types, s];
                      updateData({ support_types: newS });
                    }}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                      data.support_types.includes(s) 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      };
      case 8: return {
        title: "Growth & Compliance",
        description: "Hiring, Exporting, and Facilities.",
        content: (
          <div className="space-y-4">
             {[
               { label: "Export Plans", key: "export_plan", desc: "Planning to sell outside Canada" },
               { label: "Hiring Plan", key: "hiring_plan", desc: "Plan to hire new staff in next 6-12 mo" },
               { label: "Facilities Support", key: "infrastructure_support", desc: "Need desk space or manufacturing facility" },
               { label: "Compliance Help", key: "compliance_support", desc: "Need help with certifications/licenses" }
             ].map((item) => (
               <div key={item.key} className="flex items-center justify-between p-4 border border-zinc-200 rounded-2xl hover:border-zinc-300 transition-all cursor-pointer" onClick={() => updateData({ [item.key]: !data[item.key as keyof BusinessData] })}>
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${data[item.key as keyof BusinessData] ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300'}`}>
                    {data[item.key as keyof BusinessData] && <CheckCircle2 className="w-4 h-4" />}
                  </div>
               </div>
             ))}
             {data.hiring_plan && (
                <div>
                   <label className="block text-sm font-medium mb-2">Hiring Targets</label>
                   <div className="flex flex-wrap gap-2 text-xs">
                    {['Students', 'New Graduates', 'Skilled Workers', 'International Talent'].map(t => (
                      <button
                        key={t}
                        onClick={() => {
                          const newT = data.hiring_targets.includes(t) ? data.hiring_targets.filter(x => x !== t) : [...data.hiring_targets, t];
                          updateData({ hiring_targets: newT });
                        }}
                        className={`px-3 py-1 rounded-full border ${data.hiring_targets.includes(t) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-zinc-200'}`}
                      >
                        {t}
                      </button>
                    ))}
                   </div>
                </div>
             )}
          </div>
        )
      };
       case 9: return {
        title: "Final Details",
        description: "Refining the search.",
        content: (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Timeline for Support</label>
              <select 
                value={data.timeline}
                onChange={e => updateData({ timeline: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl outline-hidden appearance-none"
              >
                <option value="">Select timeline</option>
                <option value="Urgent (ASAP)">Urgent (ASAP)</option>
                <option value="1-3 Months">1-3 Months</option>
                <option value="3-6 Months">3-6 Months</option>
                <option value="Just exploring">Just exploring</option>
              </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-2">Preferred Language</label>
               <div className="grid grid-cols-2 gap-3">
                  {['English', 'French', 'Both'].map(l => (
                    <button
                      key={l}
                      onClick={() => updateData({ language: l })}
                      className={`p-3 text-sm rounded-xl border text-center transition-all ${
                        data.language === l ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
               </div>
            </div>
            <div className="space-y-3">
               <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                  <div>
                    <p className="font-medium text-sm">Business Plan Ready?</p>
                    <p className="text-xs text-zinc-500">Do you have a written document?</p>
                  </div>
                  <button 
                    onClick={() => updateData({ business_plan_ready: !data.business_plan_ready })}
                    className={`relative w-12 h-6 rounded-full transition-all ${data.business_plan_ready ? 'bg-blue-600' : 'bg-zinc-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.business_plan_ready ? 'left-7' : 'left-1'}`} />
                  </button>
               </div>
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                  <div>
                    <p className="font-medium text-sm">Previous Funding?</p>
                    <p className="text-xs text-zinc-500">Have you received grants/loans before?</p>
                  </div>
                  <button 
                    onClick={() => updateData({ previous_funding: !data.previous_funding })}
                    className={`relative w-12 h-6 rounded-full transition-all ${data.previous_funding ? 'bg-blue-600' : 'bg-zinc-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.previous_funding ? 'left-7' : 'left-1'}`} />
                  </button>
               </div>
            </div>
          </div>
        )
      };
      case 10: return {
        title: "Confirm & Analyze",
        description: "Submit to find your matches.",
        content: (
          <div className="space-y-6">
            <div className="bg-zinc-900 text-white p-6 rounded-3xl space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Profile Complete
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We've collected {Object.keys(data).length} data points about your business. Our AI will now cross-reference this with currently active Canadian support programs.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs py-1 border-b border-zinc-800">
                  <span className="text-zinc-500">Province</span>
                  <span>{data.province.join(", ") || "None selected"}</span>
                </div>
                 <div className="flex justify-between text-xs py-1 border-b border-zinc-800">
                  <span className="text-zinc-500">Industry</span>
                  <span>{data.industry[0] + (data.industry.length > 1 ? ` +${data.industry.length - 1}` : "") || "None selected"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <input 
                type="checkbox" 
                className="mt-1" 
                checked={data.consent}
                onChange={e => updateData({ consent: e.target.checked })}
              />
              <p className="text-xs text-amber-900 leading-relaxed">
                I consent to the processing of this input to generate business support recommendations. This data is not shared with third parties.
              </p>
            </div>

            <button 
              disabled={!data.consent || isLoading}
              onClick={handleSubmit}
              className="w-full py-4 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Programs...
                </>
              ) : (
                <>
                  Generate My Matches <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )
      };
      
      case 100: return {
        title: "Your Business Support Roadmap",
        description: "Personalized matches based on your profile.",
        content: results ? (
          <div className="space-y-8 pb-12">
            <div className="bg-blue-600 text-white p-8 rounded-3xl">
              <p className="text-sm mb-4 opacity-90">{results.summary}</p>
              <div className="flex items-center gap-2 bg-white/10 w-max px-3 py-1 rounded-full text-xs">
                 <ShieldCheck className="w-3 h-3" />
                 Verified for {data.province.join(", ") || "Canada"}
              </div>
            </div>

            <ResultSection 
              title="Federal Programs" 
              icon={<Globe className="w-5 h-5" />} 
              programs={results.federalPrograms} 
            />
             <ResultSection 
              title="Provincial Supports" 
              icon={<MapPin className="w-5 h-5" />} 
              programs={results.provincialPrograms} 
            />
            <ResultSection 
              title="Funding & Financing" 
              icon={<DollarSign className="w-5 h-5" />} 
              programs={results.fundingFinancing} 
            />
            <ResultSection 
              title="Innovation & Tech" 
              icon={<Lightbulb className="w-5 h-5" />} 
              programs={results.industrySpecific} 
            />
            <ResultSection 
              title="Hiring & Talent" 
              icon={<Users className="w-5 h-5" />} 
              programs={results.hiringTalent} 
            />
             <ResultSection 
              title="Export & Market Expansion" 
              icon={<TrendingUp className="w-5 h-5" />} 
              programs={results.exportExpansion} 
            />
             <ResultSection 
              title="Advisory & Compliance" 
              icon={<Briefcase className="w-5 h-5" />} 
              programs={results.complianceAdvisory} 
            />

            <button 
              onClick={() => {
                setStep(0);
                setResults(null);
              }}
              className="w-full py-4 border-2 border-zinc-900 text-zinc-900 rounded-xl font-medium hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
            >
              Start New Search <ArrowLeft className="w-4 h-4 order-first" />
            </button>
          </div>
        ) : null
      };

      default: return { title: "", description: "", content: null };
    }
  }, [step, data, isLoading, results]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 antialiased font-sans flex flex-col items-center p-4">
      <header className="w-full max-w-2xl py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
             <Target className="text-white w-6 h-6" />
           </div>
           <div>
              <h1 className="font-bold text-lg leading-tight">YouCanB</h1>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Canada Business Matching</p>
           </div>
        </div>
        {step > 0 && step < 100 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400">STEP {step} / 10</span>
            <div className="w-12 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
               <motion.div 
                className="h-full bg-zinc-900"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 10) * 100}%` }}
               />
            </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-2xl bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
               <div className="mb-8">
                 <h2 className="text-2xl font-bold mb-2 tracking-tight">{currentStep.title}</h2>
                 <p className="text-zinc-500 text-sm">{currentStep.description}</p>
               </div>
               
               {error && (
                 <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs flex items-center gap-2">
                   <Info className="w-4 h-4" />
                   {error}
                 </div>
               )}

               {currentStep.content}
            </motion.div>
          </AnimatePresence>

          <footer className="mt-12 flex items-center justify-between border-t border-zinc-100 pt-8">
            {step > 0 && step < 100 && (
               <button 
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-all"
               >
                 <ArrowLeft className="w-4 h-4" /> Back
               </button>
            )}
            {step > 0 && step < 10 && (
              <button 
                onClick={handleNext}
                className="ml-auto bg-zinc-100 px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </footer>
        </div>
      </main>

      <div className="w-full max-w-2xl mt-6 px-4">
         <p className="text-[10px] text-center text-zinc-400 font-medium">
           © 2026 YouCanB. Data provided for informational purposes. 
           Always consult program websites for final eligibility rules.
         </p>
      </div>
    </div>
  );
}

function ResultSection({ title, icon, programs }: { title: string, icon: React.ReactNode, programs: any[] }) {
  if (!programs || programs.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-zinc-900">
        {icon}
        <h3 className="font-bold text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {programs.map((p, idx) => (
          <div key={idx} className="group p-6 bg-zinc-50 border border-zinc-200 rounded-[24px] hover:border-zinc-300 transition-all">
            <div className="flex items-start justify-between mb-3">
               <div>
                  <h4 className="font-bold text-base leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{p.name}</h4>
                  <p className="text-[10px] font-bold text-zinc-400 mt-1">{p.organization} · {p.type}</p>
               </div>
               <span className="text-[10px] bg-zinc-200 px-2 py-1 rounded-md font-bold text-zinc-600">{p.geographicScope}</span>
            </div>
            <p className="text-xs text-zinc-600 mb-4 leading-relaxed">{p.description}</p>
            <div className="bg-white p-3 rounded-xl border border-zinc-100 mb-4">
               <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Why you match</p>
               <p className="text-[11px] text-zinc-800">{p.eligibilityReason}</p>
            </div>
            <button className="w-full py-2 bg-white border border-zinc-200 text-zinc-900 rounded-lg text-xs font-bold hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all flex items-center justify-center gap-2">
              Next Step: {p.nextStep} <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

