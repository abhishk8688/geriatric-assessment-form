# Geriatric Care Assessment Form

Take-home assignment implementation of a single-page Geriatric Care Assessment form for home-visit nurses.

## Live Demo

- Deployment URL: [https://geriatric-assessment-form.vercel.app](https://geriatric-assessment-form.vercel.app) (replace with your deployed URL)

---

## Tech Stack

- React 19
- TypeScript
- Mantine UI (@mantine/core, @mantine/dates, @mantine/form)
- Zod 4 (standard schema validation)
- Dayjs
- Vite + Vitest + React Testing Library

---

## Getting Started

### Prerequisites

- Node.js >= 20
- Corepack enabled (`corepack enable`) or Yarn 4 (`yarn --version`)

### Installation

```bash
corepack yarn install
# or if yarn is globally available:
yarn install
```

### Running Locally

```bash
yarn dev
```

The application runs at `http://localhost:5173`.

### Running Tests and Verification

To run the complete verification suite (typecheck, oxlint, stylelint, unit/integration tests, and production build):

```bash
yarn test
```

To run Vitest tests directly:

```bash
yarn vitest
```

---

## Architecture and Key Decisions

### 1. Schema and Validation (`src/features/assessment/schema.ts`)
- Implemented using Zod 4 syntax with `z.iso.date()` for strict ISO date strings (`YYYY-MM-DD`).
- Cross-field rules implemented via `.refine()`:
  - Patient must be at least 60 years old at the time of the assessment (`dateOfBirth <= minus60Years(assessmentDate)`).
  - Next review date must be strictly after the assessment date (`followUpDate > assessmentDate`).
  - Medication count of 5 or more (polypharmacy) requires `pharmacistReviewRequested === true`.
- Blank dates are guarded in the refinements so that empty submissions produce clean individual field errors without cascading cross-field noise.

### 2. Type Alignment Without Duplication
- The submission data type is derived directly from `Assessment = z.infer<typeof assessmentSchema>`.
- Form state is typed as a mapped type over `keyof Assessment` (`AssessmentFormValues`), resolving the gap between empty form inputs (`''` or `false`) and validated schema output without maintaining a second handwritten interface or resorting to `any`.

### 3. Mantine Form Wiring
- Wired through `schemaResolver(assessmentSchema)` from `@mantine/form`. No duplicate validation rules or regular expressions exist in component code.
- Configured with `validateInputOnBlur: true` so untouched fields remain quiet until interacted with or submitted.
- Submitting an empty form yields exactly 9 field errors (all required fields, while unflagged pharmacist review remains valid when medication count is under 5).

### 4. User Experience and State Handling
- Clicking "Load sample patient" pre-populates all 10 fields with the valid test fixture from Section 5.
- On valid submission, an asynchronous delay (~800ms) simulates saving while disabling the submit button and showing a Mantine loader.
- Upon completion, Mantine's `Alert` displays the parsed output returned by Zod inside a formatted `Code` block.

---

## Testing

The test suite covers both unit-level schema boundaries and end-to-end component interaction:

1. **Schema Boundary Tests (`schema.test.ts`):**
   - SafeParse verification of the 60-year age boundary on the assessment date (`1966-08-07` accepted vs `1966-08-08` rejected).
   - Polypharmacy threshold (4 medications accepted without review vs 5 medications rejected).
   - All fixture rejection variations from Section 5 (invalid MRN format, name length, invalid mobility enum, Barthel index increments and ranges, review date ordering, consent literal).
   - Validation that an empty form submission generates exactly 9 errors with zero cross-field noise.

2. **Form Integration Tests (`GeriatricAssessmentForm.test.tsx`):**
   - Full DOM render using `@test-utils`.
   - Verifies all 10 controls render with correct accessible labels and roles.
   - Tests loading the sample patient, clicking save, awaiting simulated async persistence, and asserting that the save handler receives the exact parsed payload.

---

## Time Spent Breakdown

Total time spent: approximately 1 hour 50 minutes.

- Project scaffolding and environment verification: ~15 minutes
- Zod 4 schema definition and boundary unit tests: ~25 minutes
- Assessment form component implementation and Mantine wiring: ~40 minutes
- Integration testing with React Testing Library: ~15 minutes
- Boilerplate cleanup, lint/format verification (`yarn test`), and documentation: ~15 minutes

---

## Unfinished Items and Trade-offs

All core requirements and edge cases specified in the brief have been fully satisfied.
Out-of-scope items per instructions:
- No backend integration or persistent database.
- No client-side routing or authentication.
- No third-party state libraries or toast notification systems beyond Mantine built-ins.
