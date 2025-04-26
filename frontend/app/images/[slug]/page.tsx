'use client'
import '@mantine/core/styles.css';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { AppShell, Burger, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './page.module.css'

const defaultImage = "https://images.unsplash.com/photo-1739276364069-568b35ea578e?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

type PageProps = {
  params: {
    slug: string;
  };
};

export default function Home() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const [images, setImages] = useState([]);
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/getimages/${slug}`)
      .then(res => {
        if(res.ok){
          return res.json()
        }
        router.replace("/404")
        throw new Error("Collection not found")
      })
      .then(data => setImages(data));
  }, []);

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
        padding="md">

        <AppShell.Header style={{display:"flex"}}>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <div className={classes.header}>
            <Title order={3}>{slug}</Title>
          </div>
        </AppShell.Header>

        <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

        <AppShell.Main>Main</AppShell.Main>
    </AppShell>

    {/*<br/><br/><br/><br/>
    <div>
      <h1>Uploaded Images from {slug}</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {images.map((image) => (
          <div key={image.filename}>
            <img
              src={image.image}
              alt={image.filename}
              style={{ width: '200px', borderRadius: '8px' }}
            />
            <p>{image.filename}</p>
          </div>
        ))}
      </div>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </div>*/}
    </>
  );
}