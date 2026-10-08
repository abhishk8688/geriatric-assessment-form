import dayjs from 'dayjs';
import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { SAMPLE_PATIENT } from './fixtures';
import { Assessment, assessmentSchema, MOBILITY } from './schema';

export type AssessmentFormValues = {
  [K in keyof Assessment]: Assessment[K] extends boolean
    ? boolean
    : Assessment[K] extends number
      ? number | ''
      : Assessment[K] | '';
};

const initialValues: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: '',
  assessmentDate: '',
  mobility: '',
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: '',
  consentObtained: false,
};

function formatMobilityLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const mobilityOptions = MOBILITY.map((value) => ({
  value,
  label: formatMobilityLabel(value),
}));

export interface GeriatricAssessmentFormProps {
  onSave?: (data: Assessment) => void;
}

export function GeriatricAssessmentForm({ onSave }: GeriatricAssessmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAssessment, setSavedAssessment] = useState<Assessment | null>(null);

  const form = useForm<AssessmentFormValues>({
    mode: 'uncontrolled',
    initialValues,
    validateInputOnBlur: true,
    validate: schemaResolver(assessmentSchema),
  });

  const handleSubmit = async (values: AssessmentFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const parsed = assessmentSchema.parse(values);
    setSavedAssessment(parsed);
    setIsSubmitting(false);
    onSave?.(parsed);
  };

  const handleLoadSample = () => {
    form.setValues(SAMPLE_PATIENT);
    form.clearErrors();
  };

  const today = dayjs().format('YYYY-MM-DD');

  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <Title order={2} mb="lg">
          Geriatric Care Assessment
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
          <Stack gap="md">
            <TextInput
              label="Medical record number"
              placeholder="MRN-004821"
              key={form.key('mrn')}
              {...form.getInputProps('mrn')}
            />

            <TextInput
              label="Patient name"
              key={form.key('patientName')}
              {...form.getInputProps('patientName')}
            />

            <DateInput
              label="Date of birth"
              valueFormat="YYYY-MM-DD"
              key={form.key('dateOfBirth')}
              {...form.getInputProps('dateOfBirth')}
            />

            <DateInput
              label="Assessment date"
              valueFormat="YYYY-MM-DD"
              maxDate={today}
              key={form.key('assessmentDate')}
              {...form.getInputProps('assessmentDate')}
            />

            <Select
              label="Mobility"
              placeholder="Select mobility status"
              data={mobilityOptions}
              key={form.key('mobility')}
              {...form.getInputProps('mobility')}
            />

            <NumberInput
              label="Barthel Index"
              step={5}
              min={0}
              max={100}
              key={form.key('barthelIndex')}
              {...form.getInputProps('barthelIndex')}
            />

            <NumberInput
              label="Regular medications"
              min={0}
              max={30}
              key={form.key('medicationCount')}
              {...form.getInputProps('medicationCount')}
            />

            <Checkbox
              label="Pharmacist review requested"
              key={form.key('pharmacistReviewRequested')}
              {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
            />

            <DateInput
              label="Next review date"
              valueFormat="YYYY-MM-DD"
              key={form.key('followUpDate')}
              {...form.getInputProps('followUpDate')}
            />

            <Checkbox
              label="Patient or representative has given consent"
              key={form.key('consentObtained')}
              {...form.getInputProps('consentObtained', { type: 'checkbox' })}
            />

            <Group justify="space-between" mt="md">
              <Button type="button" variant="default" onClick={handleLoadSample}>
                Load sample patient
              </Button>

              <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                Save assessment
              </Button>
            </Group>
          </Stack>
        </form>

        {savedAssessment && (
          <Alert
            color="green"
            title="Assessment saved successfully"
            mt="lg"
            data-testid="success-alert"
          >
            <Code block mt="xs">
              {JSON.stringify(savedAssessment, null, 2)}
            </Code>
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
