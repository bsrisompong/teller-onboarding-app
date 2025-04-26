import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';

export default function HomePage() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />

      <Stack gap="xl">
        <Group justify="center" mt="xl">
          <Button variant="filled" color="blue">
            Filled Blue
          </Button>
          <Button variant="filled" color="red">
            Filled Red
          </Button>
          <Button variant="filled" color="green">
            Filled Green
          </Button>
          <Button variant="filled" color="yellow">
            Filled Yellow
          </Button>
        </Group>

        <Group justify="center">
          <Button variant="light" color="blue">
            Light Blue
          </Button>
          <Button variant="light" color="red">
            Light Red
          </Button>
          <Button variant="light" color="green">
            Light Green
          </Button>
          <Button variant="light" color="yellow">
            Light Yellow
          </Button>
        </Group>

        <Group justify="center">
          <Button variant="outline" color="blue">
            Outline Blue
          </Button>
          <Button variant="outline" color="red">
            Outline Red
          </Button>
          <Button variant="outline" color="green">
            Outline Green
          </Button>
          <Button variant="outline" color="yellow">
            Outline Yellow
          </Button>
        </Group>

        <Stack align="center" gap="md">
          <Group>
            <Badge size="lg" color="blue">
              Blue Badge
            </Badge>
            <Badge size="lg" color="red">
              Red Badge
            </Badge>
            <Badge size="lg" color="green">
              Green Badge
            </Badge>
            <Badge size="lg" color="yellow">
              Yellow Badge
            </Badge>
          </Group>
        </Stack>
      </Stack>
    </>
  );
}
