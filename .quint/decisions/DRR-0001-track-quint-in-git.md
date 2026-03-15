# DRR-0001: Track .quint Directory in Git

**Date:** 2026-03-15
**Status:** Adopted
**Type:** Practice Decision (Episteme)

## Context

The user's project uses the FPF (First-Principles Framework) for structured reasoning, with knowledge artifacts stored in `.quint/`. This is a single-user project, but the user wants to maintain version control over documentation and reasoning history.

## Decision

Track the `.quint/` directory in the git repository to maintain versioned documentation.

## Rationale

**Selected Hypothesis:** H-0001 (.quint Directory Git Tracking)

**Why this won:**
1. **Logical Consistency (L1 Verified):** Git tracking is a well-established mechanism that directly provides version history and audit trails
2. **No Dependencies:** Standalone practice decision with no conflicting constraints
3. **User Intent:** Explicit user requirement for documentation versioning
4. **Cost-Benefit:** Low cost (git already in use) with clear value (auditability, time-travel through reasoning)

**Evidence Level:** L1 (Substantiated - logical verification only; empirical validation not required for practice decisions)

## Consequences

### Positive
- Full version history of all reasoning artifacts
- Ability to review past decisions and their context
- Audit trail of project knowledge evolution
- No loss of epistemic context over time

### Trade-offs
- Git repository size increases with documentation
- No real privacy concern (single-user project)
- No overhead beyond normal git workflow

### Next Steps
- Add `.quint/` to git tracking
- Commit current state of `.quint/` directory

## Validity

Revisit this decision if:
- Repository size becomes problematic
- Multi-user collaboration is introduced (may need access controls)
- Alternative knowledge management system is considered

---

## Relations

```
DRR-0001 --selects--> H-0001 (.quint Git Tracking)
```
