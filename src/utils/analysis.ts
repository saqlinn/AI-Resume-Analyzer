export interface Recommendation {
  issue?: string;
  evidence?: string;
  why?: string;
  suggestion?: string;
  priority?: string;
  expected_benefit?: string;
  example?: string;
  text?: string;
}

export interface SecondaryRole {
  role: string;
  percentage?: number;
}

export interface StrongSkillEvidence {
  skill: string;
  evidence: string;
}

export interface NormalizedAnalysis {
  id: string;
  category: string;
  ats_score: number;
  keyword_score: number;
  role_relevancy_score: number;
  classification_confidence_pct?: number;
  technical_skills: string[];
  soft_skills: string[];
  tools_technologies: string[];
  certifications: string[];
  missing_skills: string[];
  improvement_areas: string[];
  strong_skills: string[];
  strong_skill_evidence: StrongSkillEvidence[];
  recommendations: Recommendation[];
  why_missing?: string;
  top_keywords: string[];
  required_skills_for_role: string[];
  secondary_roles: SecondaryRole[];
  issues: string[];
  warnings: string[];
}

type RecordValue = Record<string, unknown>;

const isRecord = (value: unknown): value is RecordValue =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const toDisplayText = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(toDisplayText).filter(Boolean).join(", ");
  }
  if (isRecord(value)) {
    const preferredKeys = ["name", "label", "title", "text", "value", "skill", "role", "issue"];
    for (const key of preferredKeys) {
      const text = toDisplayText(value[key]);
      if (text) return text;
    }
  }
  return "";
};

const toStringList = (value: unknown): string[] => {
  const values = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  return values.map(toDisplayText).filter(Boolean);
};

const firstValue = (source: RecordValue, ...keys: string[]): unknown => {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) return source[key];
  }
  return undefined;
};

const normalizeRecommendation = (value: unknown): Recommendation | null => {
  if (!isRecord(value)) {
    const text = toDisplayText(value);
    return text ? { text } : null;
  }

  const recommendation: Recommendation = {};
  for (const key of ["issue", "evidence", "why", "suggestion", "priority", "expected_benefit", "example"]) {
    const text = toDisplayText(value[key]);
    if (text) recommendation[key as keyof Recommendation] = text;
  }
  return Object.keys(recommendation).length > 0 ? recommendation : null;
};

const normalizeRecommendations = (value: unknown): Recommendation[] => {
  const values = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  return values.map(normalizeRecommendation).filter((value): value is Recommendation => value !== null);
};

const normalizeRoles = (value: unknown): SecondaryRole[] => {
  const values = Array.isArray(value) ? value : [];
  return values.reduce<SecondaryRole[]>((roles, item) => {
    if (isRecord(item)) {
      const role = toDisplayText(firstValue(item, "role", "role_name", "job_title", "title", "name"));
      if (role) {
        const percentageValue = firstValue(item, "score_pct", "percentage", "match_score", "score");
        const percentage = typeof percentageValue === "number" ? percentageValue : Number(percentageValue);
        roles.push({ role, ...(Number.isFinite(percentage) ? { percentage } : {}) });
      }
    } else {
      const role = toDisplayText(item);
      if (role) roles.push({ role });
    }
    return roles;
  }, []);
};

const normalizeStrongSkillEvidence = (value: unknown, skills: string[]): StrongSkillEvidence[] => {
  if (Array.isArray(value)) {
    return value.reduce<StrongSkillEvidence[]>((result, item, index) => {
      if (isRecord(item)) {
        const skill = toDisplayText(firstValue(item, "skill", "name", "label", "title")) || skills[index] || "";
        const evidence = toDisplayText(firstValue(item, "evidence", "supporting_evidence", "reason", "why"));
        if (skill && evidence) result.push({ skill, evidence });
      } else {
        const evidence = toDisplayText(item);
        if (skills[index] && evidence) result.push({ skill: skills[index], evidence });
      }
      return result;
    }, []);
  }

  if (isRecord(value)) {
    return Object.entries(value).reduce<StrongSkillEvidence[]>((result, [skill, evidence]) => {
      const evidenceText = toDisplayText(evidence);
      if (skill && evidenceText) result.push({ skill, evidence: evidenceText });
      return result;
    }, []);
  }

  return [];
};

const toScore = (value: unknown): number => {
  const score = Number(value);
  return Number.isFinite(score) ? score : 0;
};

export const normalizeAnalysis = (response: unknown, id = "backend-result"): NormalizedAnalysis | null => {
  if (!isRecord(response)) return null;

  const source = isRecord(response.analysis) ? response.analysis : response;
  const legacyAnalysisData = isRecord(source.analysis_data) ? source.analysis_data : {};
  const rawResponse = isRecord(response.rawResponse)
    ? response.rawResponse
    : isRecord(legacyAnalysisData.rawResponse)
      ? legacyAnalysisData.rawResponse
      : source;
  const skills = isRecord(source.skills) ? source.skills : isRecord(rawResponse.skills) ? rawResponse.skills : {};
  const explanations = isRecord(source.explanations)
    ? source.explanations
    : isRecord(rawResponse.explanations)
      ? rawResponse.explanations
      : {};
  const bestJob = isRecord(source.best_job)
    ? source.best_job
    : isRecord(rawResponse.best_job)
      ? rawResponse.best_job
      : {};
  const scoreBreakdown = isRecord(source.score_breakdown) ? source.score_breakdown : {};
  const classification = isRecord(source.classification) ? source.classification : {};
  const category = toDisplayText(firstValue(source, "primary_role", "category", "job_title", "stated_job_title"));
  const hasAnalysisFields = Boolean(category) || ["status", "analysis_id", "ats_score", "score_breakdown", "skills", "strong_skills", "recommendations", "improvement_areas", "missing_skills"].some((key) => key in source);
  const strongSkills = toStringList(source.strong_skills);
  if (!hasAnalysisFields) return null;

  return {
    id: toDisplayText(firstValue(source, "analysis_id", "id")) || id,
    category: category || "Not Specified",
    ats_score: toScore(firstValue(source, "ats_score", "score") ?? firstValue(scoreBreakdown, "ats_score", "ats")),
    keyword_score: toScore(firstValue(source, "keyword_score", "match_score") ?? firstValue(scoreBreakdown, "keyword_score", "keyword_match", "match_score")),
    role_relevancy_score: toScore(firstValue(source, "role_relevancy_score") ?? firstValue(scoreBreakdown, "role_relevancy_score", "role_relevance", "relevance") ?? firstValue(source, "match_score")),
    classification_confidence_pct: toScore(firstValue(classification, "confidence_pct", "confidence")),
    technical_skills: toStringList(firstValue(source, "technical_skills", "skills" in source ? skills.present : undefined)),
    soft_skills: toStringList(source.soft_skills),
    tools_technologies: toStringList(source.tools_technologies),
    certifications: toStringList(source.certifications),
    missing_skills: toStringList(source.missing_skills),
    improvement_areas: toStringList(source.improvement_areas),
    strong_skills: strongSkills,
    strong_skill_evidence: normalizeStrongSkillEvidence(source.strong_skill_evidence, strongSkills),
    recommendations: normalizeRecommendations(source.recommendations ?? legacyAnalysisData.recommendations),
    why_missing: toDisplayText(explanations.why_missing),
    top_keywords: toStringList(firstValue(source, "top_keywords", "topKeywords") ?? explanations.top_keywords),
    required_skills_for_role: toStringList(firstValue(source, "required_skills_for_role") ?? bestJob.required_skills),
    secondary_roles: normalizeRoles(firstValue(source, "secondary_roles", "secondaryRoles", "other_roles")),
    issues: toStringList(source.issues),
    warnings: toStringList(firstValue(source, "warnings", "extraction_warnings", "limitations")),
  };
};