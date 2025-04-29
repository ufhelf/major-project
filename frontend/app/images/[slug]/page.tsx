'use client'
import '@mantine/core/styles.css';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { 
  IconArrowLeft, 
  IconUpload, 
  IconSettings,
  IconPhoto, 
  IconX
} from '@tabler/icons-react';

import { 
  ActionIcon, 
  AppShell, 
  Burger, 
  Group, 
  Title, 
  Image, 
  AspectRatio, 
  Divider, 
  Button, 
  Modal, 
  Text,
  Overlay,
  Transition,
  Box,
  Grid,
  LoadingOverlay
} from '@mantine/core';

import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';

import { useDisclosure, useHover } from '@mantine/hooks';
import classes from './page.module.css'
import { GalleryImage } from '@/components/pagecomponents/galleryimg';

const defaultImage = "https://images.unsplash.com/photo-1739276364069-568b35ea578e?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

type PageProps = {
  params: {
    slug: string;
  };
};

export default function Home() {
  const params = useParams();
  const router = useRouter();
  const { hovered, ref } = useHover();
  const { slug } = params;

  const [isCoverLoading, setisCoverLoading] = useState(true)

  const [images, setImages] = useState([]);
  const [coverImg, setCoverImg] = useState(defaultImage)
  const [imgset, setImgset] = useState({})

  const [openedBurger, { toggle }] = useDisclosure();
  const [openedUpload, { open : openUpload, close : closeUpload }] = useDisclosure(false);

  const fetchImageSet = () => {
    fetch(`http://127.0.0.1:8000/api/getimageset/${slug}`)
    .then(res => {
      if(res.ok){
        return res.json()
      }
      router.replace("/404")
      throw new Error("Collection not found")
    })
    .then(data => {
      setImgset(data)

      if(data["coverImage"] != null) {
        setCoverImg(`${data["coverImage"]}?t=${new Date().getTime()}`);
      }
    })
  }

  const fetchImages = () => {
    fetch(`http://127.0.0.1:8000/api/getimages/${slug}`)
      .then(res => {
        if(res.ok){
          return res.json()
        }
      })
      .then(data => setImages(data));
  }

  async function ChangeCoverImage(img: File){
    const formdata = new FormData()
    formdata.append("file", img)
  
    fetch(`http://127.0.0.1:8000/api/setcoverimage/${slug}`, {
      method: "PUT",
      body: formdata,
    })

    setTimeout(() => {
      fetchImageSet();
    }, 200)
  }

  async function PostImages(files : Array<FileWithPath>) {
    console.log('accepted', files)

    for(var i = 0; i < files.length; i++){
        const file = files[i] as File;
        const formData = new FormData();
        formData.append("file", file);  

        fetch(`http://127.0.0.1:8000/api/postimage/${slug}`, {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }

    setTimeout(() => {
      fetchImages();
    }, 200)
  }

  async function DeleteImage(imgname:string) {
    const formData = new FormData();
    formData.append("name", imgname)
    fetch(`http://127.0.0.1:8000/api/deleteimage/${slug}`, {
      method:"DELETE",
      body: formData,
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

    setTimeout(() => {
      fetchImages();
    }, 200)
  }

  useEffect(() => {
    //Fetch imageset data
    fetchImageSet()

    //Fetch images
    fetchImages()
  }, []);

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !openedBurger },
      }}
        padding="md">

        <AppShell.Header style={{display:"flex"}}>
          <Group className='mx-2'>
            <ActionIcon variant='subtle' size="xl" onClick={(e) => router.back()} color='black'>
              <IconArrowLeft size={35} stroke={1.5}/>
            </ActionIcon>
            <Burger
            opened={openedBurger}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            />
            <Title order={2} style={{fontWeight:500}}>{slug}</Title>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
        
        <Dropzone
          onDrop={(files) => ChangeCoverImage(files[0] as File)}
          onReject={(files) => console.log('rejected files', files)}
          accept={IMAGE_MIME_TYPE}
        >
          <Group>
            <AspectRatio ratio={16/9}>
              <Box pos="relative" w="100%" h="100%" ref={ref}>
                <Image
                  src={coverImg}
                  alt="Cover Image"
                  onLoad={() => setisCoverLoading(false)}
                  onError={(e) => (e.currentTarget.src = defaultImage)}
                  fit="cover"
                  w="100%"
                  h="100%"
                  loading="lazy"
                />

                <Transition mounted={hovered} transition="fade">
                  {(transitionStyle) => (
                    <>
                      <Text
                        style={{
                          ...transitionStyle,
                          zIndex: 10,
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "1rem",
                        }}
                      >
                        Change Cover
                      </Text>
                      <Overlay
                        color="#000"
                        backgroundOpacity={0.2}
                        blur={2}
                        style={{ ...transitionStyle, zIndex: 0 }}
                      />
                    </>
                  )}
                </Transition>
                <LoadingOverlay visible={isCoverLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
              </Box>
            </AspectRatio>
          </Group>
        </Dropzone>

          <Divider my="md"/>

          <Group>
            <Button justify='left' fullWidth variant='subtle' color='grey' onClick={openUpload}>
              <IconUpload/>
              Upload Images
            </Button>
            <Button justify='left' fullWidth variant='subtle' color='grey'>
              <IconSettings/>
              Settings
            </Button>
          </Group>

          <Divider my="md"/>

          <Group>
            <Text>Images Count: {imgset["image_count"]}</Text><br/>
            <Text>Date: {new Date(imgset["date"]).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          </Group>
        </AppShell.Navbar>

        <AppShell.Main>
            <Grid>
              {
                images.map((item, index) => 
                    <Grid.Col span={2} key={item.filename}>
                        <GalleryImage 
                        image={item.image} 
                        title={item.filename}
                        index={index}
                        onSelect={() => console.log("select")}
                        onDeselect={() => console.log("deselect")}
                        onDelete={() => DeleteImage(item.filename)}
                        />
                    </Grid.Col>
                )
              }
            </Grid>
        </AppShell.Main>
    </AppShell>
    
    {/*For uploading images*/}
    <Modal opened={openedUpload} onClose={closeUpload} title="Upload">
      <Dropzone
        onDrop={(files) => PostImages(files)}
        onReject={(files) => console.log('rejected files', files)}
        accept={IMAGE_MIME_TYPE}
        style={{
          border: '2px dashed var(--mantine-color-gray-4)',
          borderRadius: '8px',
          padding: '2rem',
          backgroundColor: 'var(--mantine-color-gray-0)',
        }}
      >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, only accepts images
            </Text>
          </div>
        </Group>
      </Dropzone>
    </Modal>
    </>
  );
}