import { Box, Group } from '@mantine/core';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { GeriatricAssessmentForm } from '../features/assessment/GeriatricAssessmentForm';

export function HomePage() {
  return (
    <Box py="md">
      <Group justify="flex-end" px="md">
        <ColorSchemeToggle />
      </Group>
      <GeriatricAssessmentForm />
    </Box>
  );
}
