/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BusinessData {
  country: "CA";
  province: string[];
  city: string;
  business_presence: string;
  legal_entity: string;
  registered: boolean;
  year_established: string;
  company_name: string;
  industry: string[];
  product_service: string;
  business_model: string;
  stage: string;
  employees: string;
  revenue: string;
  ownership: string[];
  rd_activity: boolean;
  innovation: boolean;
  ip_status: boolean;
  ip_support_needed: boolean;
  support_types: string[];
  objectives: string[];
  market_scope: string;
  export_plan: boolean;
  export_support_needed: boolean;
  hiring_plan: boolean;
  hiring_targets: string[];
  compliance_support: boolean;
  infrastructure_support: boolean;
  timeline: string;
  business_plan_ready: boolean;
  language: string;
  previous_funding: boolean;
  accelerator_interest: boolean;
  constraints: string;
  consent: boolean;
}

export interface ProgramMatch {
  name: string;
  organization: string;
  type: string;
  eligibilityReason: string;
  description: string;
  geographicScope: string;
  nextStep: string;
}

export interface MatchingResponse {
  federalPrograms: ProgramMatch[];
  provincialPrograms: ProgramMatch[];
  industrySpecific: ProgramMatch[];
  fundingFinancing: ProgramMatch[];
  hiringTalent: ProgramMatch[];
  exportExpansion: ProgramMatch[];
  complianceAdvisory: ProgramMatch[];
  summary: string;
}
