import { describe, expect, it } from 'vitest';
import { SAMPLE_PATIENT } from './fixtures';
import { assessmentSchema, MOBILITY } from './schema';

describe('assessmentSchema boundary validation', () => {
  it('accepts a patient who turns exactly 60 on the assessment date', () => {
    const input = {
      ...SAMPLE_PATIENT,
      assessmentDate: '2026-08-07',
      dateOfBirth: '1966-08-07',
    };
    const result = assessmentSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('rejects a patient who is one day short of 60 on the assessment date', () => {
    const input = {
      ...SAMPLE_PATIENT,
      assessmentDate: '2026-08-07',
      dateOfBirth: '1966-08-08',
    };
    const result = assessmentSchema.safeParse(input);
    expect(result.success).toBe(false);
    const issues = !result.success ? result.error.issues : [];
    const dateIssue = issues.find((i) => i.path.includes('dateOfBirth'));
    expect(dateIssue?.message).toBe('This pathway is for patients aged 60 and over');
  });

  it('rejects polypharmacy (5 or more medications) when pharmacist review is unchecked', () => {
    const input = {
      ...SAMPLE_PATIENT,
      medicationCount: 5,
      pharmacistReviewRequested: false,
    };
    const result = assessmentSchema.safeParse(input);
    expect(result.success).toBe(false);
    const issues = !result.success ? result.error.issues : [];
    const reviewIssue = issues.find((i) => i.path.includes('pharmacistReviewRequested'));
    expect(reviewIssue?.message).toBe(
      'Five or more medications is polypharmacy: a pharmacist review is required'
    );
  });

  it('accepts 4 medications when pharmacist review is unchecked', () => {
    const input = {
      ...SAMPLE_PATIENT,
      medicationCount: 4,
      pharmacistReviewRequested: false,
    };
    const result = assessmentSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('produces exactly 9 errors on an empty form with no cross-field noise', async () => {
    const { schemaResolver } = await import('@mantine/form');
    const resolver = schemaResolver(assessmentSchema);
    const emptyForm = {
      mrn: '',
      patientName: '',
      dateOfBirth: '',
      assessmentDate: '',
      mobility: null,
      barthelIndex: '' as unknown as number,
      medicationCount: '' as unknown as number,
      pharmacistReviewRequested: false,
      followUpDate: '',
      consentObtained: false,
    };
    const errors = await resolver(emptyForm);
    const errorKeys = Object.keys(errors);
    expect(errorKeys).toHaveLength(9);
    expect(errorKeys).not.toContain('pharmacistReviewRequested');
  });

  it.each([
    {
      description: "invalid mrn format 'MRN-4821'",
      patch: { mrn: 'MRN-4821' },
      expectedField: 'mrn',
    },
    {
      description: "patient name too short 'S'",
      patch: { patientName: 'S' },
      expectedField: 'patientName',
    },
    {
      description: "invalid mobility option 'crutches'",
      patch: { mobility: 'crutches' as unknown as (typeof MOBILITY)[number] },
      expectedField: 'mobility',
    },
    {
      description: 'barthelIndex not a multiple of 5 (82)',
      patch: { barthelIndex: 82 },
      expectedField: 'barthelIndex',
    },
    {
      description: 'barthelIndex out of range (105)',
      patch: { barthelIndex: 105 },
      expectedField: 'barthelIndex',
    },
    {
      description: 'followUpDate same day as assessmentDate',
      patch: { followUpDate: '2026-08-07' },
      expectedField: 'followUpDate',
    },
    {
      description: 'consentObtained is false',
      patch: { consentObtained: false as unknown as true },
      expectedField: 'consentObtained',
    },
  ])('rejects fixture variation: $description', ({ patch, expectedField }) => {
    const input = { ...SAMPLE_PATIENT, ...patch };
    const result = assessmentSchema.safeParse(input);
    expect(result.success).toBe(false);
    const issues = !result.success ? result.error.issues : [];
    expect(issues.some((issue) => issue.path.includes(expectedField))).toBe(true);
  });

  it('accepts barthelIndex boundaries at 0 and 100', () => {
    expect(assessmentSchema.safeParse({ ...SAMPLE_PATIENT, barthelIndex: 0 }).success).toBe(true);
    expect(assessmentSchema.safeParse({ ...SAMPLE_PATIENT, barthelIndex: 100 }).success).toBe(true);
  });
});
