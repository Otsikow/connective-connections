# Connective Admin Dashboard — AI Module Design

This document specifies the production-ready AI Admin module for Connective. It is written so an implementer can ship the experience end-to-end without additional clarification, while ensuring the admin flows remove roughly 90% of manual workload.

## Page-by-Page Structure

### 1) Dashboard (Home)
- **Mission control summary** with KPIs: active chats, resolution rate, SLA adherence, escalation count, content freshness score, and model health.
- **Live alert rail** that surfaces outages, model drift warnings, failing webhooks, and critical user feedback requiring follow-up.
- **Queue overview** showing stuck conversations, high-risk intents, and compliance-sensitive topics needing review.
- **Shortcut actions**: pause/resume automations, deploy the latest knowledge bundle, trigger a safe-mode fallback, or launch guided QA.

### 2) Conversation QA & Triage
- **Conversation list** filtered by priority, intent, risk, and satisfaction signals (CSAT, NPS, deflection probability).
- **Side-by-side replay** of the full conversation with metadata (detected intent, entities, routing decisions, guardrail outcomes, and grounding sources).
- **Inline redlining** to suggest better responses, edit grounding snippets, or flag hallucinations.
- **Batch QA** with rubric templates (tone, compliance, policy adherence) and auto-grading from the LLM.
- **Escalation actions**: re-route to human, schedule follow-up, add to regression set, or mark as training data.

### 3) Agents & Workflows
- **Agent catalog** with ownership, last deployment, latency, win rate, and degradation trend.
- **Workflow builder** (visual DAG) supporting steps: detect intent, retrieve, call function, generate, evaluate, and notify.
- **Versioning & rollout**: staged rollouts, traffic splitting, rollback, and canary guardrails with auto-disable on anomaly.
- **Testing harness**: synthetic runs, golden sets, chaos toggles, and replay from production transcripts.
- **Dependency graph** highlighting upstream knowledge packs, functions, and datasources impacted by each agent.

### 4) Content & Knowledge
- **Knowledge packs** with freshness score, last ingest, source-of-truth pointers, and confidence heatmap.
- **Content lifecycle**: draft → review → approved → scheduled → live; with reviewer assignment and SLAs.
- **Ingest pipelines**: docs, URLs, CMS, product changelog, support macros, structured APIs. Supports delta ingests and link validation.
- **Quality gates**: duplication detection, contradiction checks, PII stripping, toxicity filtering, and embedding drift alerts.
- **Grounding sets**: curated Q&A, canonical snippets, and negative examples to constrain generation.

### 5) Users, Permissions, & Audit
- **Role-based access** with least-privilege presets (Admin, Content, QA, Analyst, Operator) plus custom roles.
- **Granular scopes**: environment, agent, knowledge pack, and function-level permissions.
- **Audit trail**: immutable log of actions, approvals, deployments, and content edits with diff view.
- **Session security**: SSO/SAML, SCIM provisioning, device trust, and step-up auth for sensitive actions.

### 6) Analytics & Insights
- **Core metrics**: containment rate, first-response time, time-to-resolution, escalation rate, cost per resolution, automation coverage.
- **Quality metrics**: hallucination rate, grounding coverage, safety incident frequency, sentiment delta pre/post-response.
- **Drift & health**: embedding drift, intent distribution shift, function call error rates, latency SLAs, and vendor-specific model health.
- **Cohort analysis** by channel, segment, geography, and release version.
- **Export & BI**: scheduled exports, dbt-friendly schemas, and warehouse syncs.

### 7) Settings & Integrations
- **Channels**: web, mobile SDK, email, Slack/Teams, voice; with routing rules and availability windows.
- **Integrations**: CRM, ticketing, data warehouse, feature flagging, A/B platform, observability stack.
- **Model management**: model registry, per-feature model selection, rate limits, safety layers, and fallback trees.
- **Notification rules**: alerts via email, Slack, PagerDuty with thresholds and cooldowns.

## Features & Actions (Cross-Cutting)
- **One-click remediation** for failed guardrails: auto-open Jira ticket, attach transcript, and rollback the workflow version.
- **Regression and golden sets** linked to intents and workflows; nightly auto-runs with diff reports and Slack summaries.
- **Auto-documentation**: generate release notes and change-logs from deployments and content updates.
- **Safe-mode switch**: fall back to high-precision flows when incidents or drift thresholds are hit.
- **Human-in-the-loop surfaces**: approvals for high-risk intents, redlines that convert into training data, and reviewer queues.
- **Privacy & compliance**: configurable retention, field-level redaction, and region-aware routing.

## AI Automation Logic
- **Triage & prioritization**: LLM scores conversations for risk, urgency, and satisfaction; queues auto-sort with SLA timers.
- **Auto-QA**: rubric-based grading with explainability, suggesting fixes and generating regression cases for any failing dimension.
- **Grounding enforcement**: retrieval confidence and coverage checks; if low, fall back to safe-mode response or escalate.
- **Function orchestration**: intent → retrieve → tool-call → verify → respond loop with self-check and guardrail evaluators.
- **Learning loop**: redlines and escalations generate training data, update embeddings, and refresh golden sets weekly.
- **Incident automation**: anomaly detection triggers canary halt, opens ticket, pings on-call, and schedules postmortem template.
- **Cost optimization**: auto-selects model tiers per request based on risk and required latency; batches low-priority tasks.

## Data to Store
- **Entities**: users, roles, permissions, agents, workflows, workflow versions, knowledge packs, documents, grounding sets, test cases, conversations, messages, intents, evaluations, incidents, alerts, and deployments.
- **Key fields** (per entity):
  - Conversations: metadata (channel, locale, segment), detected intent, risk score, satisfaction score, grounding confidence, actions taken, resolution outcome, escalation flag.
  - Messages: sender, timestamp, model/version, grounding sources, tools invoked, guardrail results, cost, latency.
  - Agents/Workflows: owner, version, rollout stage, dependencies, health, win rate, and last regression score.
  - Knowledge packs: source, freshness, approval state, coverage vector, conflicts, and PII risk.
  - Tests/Evaluations: rubric, score, verdict, evidence, and linked regression case.
  - Incidents/Alerts: trigger, severity, auto-actions executed, involved components, and resolution notes.
- **Derived tables**: daily aggregates for metrics, feature flags for rollouts, and embeddings/metadata for retrieval.

## User Flow per Page
- **Dashboard**: admin lands, reviews alerts, drills into failing metric, triggers remediation or safe-mode; confirms issue resolved via refreshed KPIs.
- **Conversation QA**: filter by risk/priority → open replay → redline response or escalate → add failing turn to regression → mark as resolved; system backfills training data and re-runs QA.
- **Agents & Workflows**: open agent → view health and dependencies → edit DAG → run synthetic tests → stage rollout → monitor canary guardrails → promote or auto-rollback on anomaly.
- **Content & Knowledge**: ingest new source → automated quality gates run → assign reviewer → approve and schedule → deploy knowledge pack → system regenerates embeddings and updates grounding sets.
- **Users & Permissions**: create or adjust role → assign scopes → review audit diff → enforce step-up auth for critical actions.
- **Analytics**: select cohort → compare automation coverage and quality → export report or schedule recurring delivery to Slack/warehouse.
- **Settings**: adjust channel/integration config → update model policy or fallback tree → set alert thresholds → confirm via test ping or dry-run.

## Experience Principles
- **Progressive disclosure** keeps critical controls one click away while hiding depth until needed.
- **Explainability-first**: every automation surfaces rationale, evidence, and reversible controls.
- **Operational speed**: bulk actions everywhere, keyboard shortcuts, and saved views for on-call rotations.
- **Safety by default**: guardrails, safe-mode toggles, and auditability on every sensitive change.

