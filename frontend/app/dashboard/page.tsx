'use client'
import '@mantine/core/styles.css';
import { Container, Grid, SimpleGrid, Skeleton, Image } from '@mantine/core';

const PRIMARY_COL_HEIGHT = '150px';

export default function LeadGrid() {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  return (
    <Container my="md">
      <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
        <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} visible={true}>
          <Image src="https://cdn.iconscout.com/icon/premium/png-512-thumb/add-icon-download-in-svg-png-gif-file-formats--insert-plus-new-ui-elements-pack-user-interface-icons-470388.png?f=webp&w=512"/>
        </Skeleton>

        <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} />

        <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} />

        <Grid gutter="md">
          <Grid.Col>
            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false}/>
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
          </Grid.Col>
        </Grid>
      </SimpleGrid>
    </Container>
  );
}
