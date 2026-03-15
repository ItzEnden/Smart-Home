# Quint State Management

This directory contains the FPF (Formal-Pragmatic Framework) reasoning state for this project.

## Directory Structure

```
.quint/
├── context.md       # Bounded context definition (immutable during session)
├── L0/              # Conjectures (unverified hypotheses)
├── L1/              # Substantiated claims (logically verified)
├── L2/              # Corroborated claims (empirically validated)
├── invalid/         # Falsified claims (kept for learning)
└── knowledge/       # Project knowledge base (verified claims)
```

## Current State

**Phase:** Initialized (Phase 0 complete)
**Session Bounded Context:** Smart Home Application (IoT/Home Automation domain)

## Next Steps

To continue with FPF reasoning, run:
- `/q1-hypothesize <problem>` - Start Phase 1 (Abduction)
- `/q-status` - Show current state and next commands

## Key Files

- `.quint/context.md` - Project vocabulary, invariants, scope, constraints
- `.quint/knowledge/` - Verified claims organized by assurance level

## Concepts

- **L0**: Conjecture - Unverified hypothesis
- **L1**: Substantiated - Logically verified
- **L2**: Corroborated - Empirically tested
- **WLNK**: Weakest Link - R_eff = min(evidence_scores)
- **Scope (G)**: Where a claim applies
- **DRR**: Design Rationale Record - Persisted decision
