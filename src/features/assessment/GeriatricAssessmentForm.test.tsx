import { render, screen, userEvent } from '@test-utils';
import { describe, expect, it, vi } from 'vitest';
import { SAMPLE_PATIENT } from './fixtures';
import { GeriatricAssessmentForm } from './GeriatricAssessmentForm';

describe('GeriatricAssessmentForm', () => {
  it('loads sample patient, submits form, and calls save handler with parsed values', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();

    render(<GeriatricAssessmentForm onSave={handleSave} />);

    const loadSampleButton = screen.getByRole('button', { name: 'Load sample patient' });
    await user.click(loadSampleButton);

    const submitButton = screen.getByRole('button', { name: 'Save assessment' });
    await user.click(submitButton);

    const alert = await screen.findByTestId('success-alert', {}, { timeout: 3000 });
    expect(alert).toBeInTheDocument();
    expect(handleSave).toHaveBeenCalledWith(SAMPLE_PATIENT);
  });

  it('renders all required form controls', () => {
    render(<GeriatricAssessmentForm />);

    expect(screen.getByRole('heading', { name: 'Geriatric Care Assessment' })).toBeInTheDocument();
    expect(screen.getByLabelText('Medical record number')).toBeInTheDocument();
    expect(screen.getByLabelText('Patient name')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of birth')).toBeInTheDocument();
    expect(screen.getByLabelText('Assessment date')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobility', { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText('Barthel Index')).toBeInTheDocument();
    expect(screen.getByLabelText('Regular medications')).toBeInTheDocument();
    expect(screen.getByLabelText('Pharmacist review requested')).toBeInTheDocument();
    expect(screen.getByLabelText('Next review date')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Patient or representative has given consent')
    ).toBeInTheDocument();
  });
});
