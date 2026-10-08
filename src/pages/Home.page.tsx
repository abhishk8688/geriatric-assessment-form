import { Box, Group } from '@mantine/core';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { GeriatricAssessmentForm } from '../features/assessment/GeriatricAssessmentForm';
import classes from '../App.module.css';

export function HomePage() {
  return (
    <Box py="md" className={classes.container}>
      <Group justify="flex-end" px="md">
        <ColorSchemeToggle />
      </Group>
      <GeriatricAssessmentForm />
    </Box>
  );
}
