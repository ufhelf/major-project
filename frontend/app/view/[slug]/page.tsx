'use client'

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';


import {  
  Title, 
  Image,  
  Modal, 
  Text,
  Overlay,
  Box,
  Grid,
  ActionIcon,
  Group,
} from '@mantine/core';

import{
  IconLayoutGrid,
  IconChevronLeft,
  IconChevronRight,
  IconPencil,
} from '@tabler/icons-react';

import { useDisclosure} from '@mantine/hooks';
import classes from './page.module.css'
import { ViewImage } from '@/components/pagecomponents/viewimg';

const defaultImage = "https://images.unsplash.com/photo-1739276364069-568b35ea578e?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const MotionTitle = motion(Title);
const MotionText = motion(Text);

type PageProps = {
  params: {
    slug: string;
  };
};

export default function Home() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [images, setImages] = useState([]);
  const [coverImg, setCoverImg] = useState(defaultImage);
  const [imgset, setImgset] = useState({});

  const [opened, { open, close }] = useDisclosure(false);
  const [viewImage, setViewImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [viewIndex, setViewIndex] = useState(0)

  const [gridSize, setGridsize] = useState(2)

  async function checkLoggedIn() {
      const res = await fetch("http://localhost:3000/api/whoami", {
          credentials: "include",
      });
      if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true)
      }
  }

  const fetchImageSet = () => {
    fetch(`http://127.0.0.1:8000/api/getimageset/${slug}`)
    .then(res => {
      if(res.ok){
        return res.json();
      }
      router.replace("/404");
      throw new Error("Collection not found");
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
          return res.json();
        }
      })
      .then(data => setImages(data));
  }

  useEffect(() => {
    checkLoggedIn()

    //Fetch imageset data
    fetchImageSet();

    //Fetch images
    fetchImages();
  }, []);

  function onSelect(img:any, index:number){
    setViewImage(img.image)
    setImageName(img.filename)
    setViewIndex(index)
    open();
  }

  function resize(){
    if(gridSize == 2){
      setGridsize(1);
      return;
    }else{
      setGridsize(gridSize + 1)
    }
  }

  function nextImage(){
    let nextindex = viewIndex+1;
    
    if(nextindex == images.length) nextindex=0;

    setViewIndex(nextindex);

    setViewImage(images[nextindex].image);
    setImageName(images[nextindex].filename);
  }

  function previousImage(){
    let nextindex = viewIndex-1;

    if(viewIndex == 0) nextindex=images.length-1;

    setViewIndex(nextindex);

    setViewImage(images[nextindex].image);
    setImageName(images[nextindex].filename);
  }

  return (
    <>
      <Box style={{ position: 'relative', height: '100vh', width: '100vw' }}>
          <MotionTitle
            style={{ position: 'absolute'}}
            className={classes.title}
            size={50}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          >
            {imgset["setname"]}
          </MotionTitle>

          <MotionText
            style={{ position: 'absolute', color:"white"}}
            className={classes.date}
            size="xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          >
            {new Date(imgset["date"]).toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </MotionText>    

        
        <Image
          src={coverImg}
          h={"100vh"}
          style={{objectFit:"cover", position: "absolute", maxWidth: "100vw"}}
        />
        <Overlay gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)" opacity={0.85} zIndex={1}/>
      </Box>
      
      <Box style={{height:70, display:"flex", alignItems: "center", justifyContent: "space-between", padding: "0 1vw",}}>
        <Group style={{marginLeft:"auto"}}>
          { isLoggedIn &&           
            <ActionIcon variant='subtle' size="xl" color='black' onClick={() => router.replace(`/images/${slug}`)}>
              <IconPencil/>
            </ActionIcon>

            //Only show if user is logged in 
          }

          <ActionIcon variant='subtle' size="xl" color='black' onClick={resize}>
            <IconLayoutGrid/>
          </ActionIcon>
        </Group>
      </Box>

      <br/>
    
      <Grid style={{paddingLeft:"1%", paddingRight:"1%"}}>
        <AnimatePresence mode="popLayout">
          {images.map((item, index) => (
            <Grid.Col
              span={{ base: 12, md: gridSize + 1, lg: gridSize, sm: gridSize + 2, xs: gridSize + 2 }}
              key={item.filename}
              onClick={() => onSelect(item, index)}
              component={motion.div}
              layout
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 25,
                duration: 0.4
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ViewImage
                image={item.image}
                title={item.filename}
                index={index}
                onClickFunc={open}
              />
            </Grid.Col>
          ))}
        </AnimatePresence>
      </Grid>

      <Modal fullScreen opened={opened} onClose={close} title={imageName}>
        <Box style={{ position: "relative", height: "100%", width: "100%" }}>
          <Image
            src={viewImage}
            className={classes.viewImage}
          />

          <ActionIcon variant="subtle" color='black' size="xl" onClick={previousImage}
            style={{
              marginTop:"40vh",
              position:"absolute",
              zIndex: 10,
            }}

            className={classes.arrows}
          >
            <IconChevronLeft size={32} />
          </ActionIcon>
          
          <ActionIcon variant="subtle" color='black' size="xl" onClick={nextImage}
            style={{
              marginTop:"40vh",
              right:0,
              position:"absolute",
              zIndex: 10,
            }}
          >
            <IconChevronRight size={32}/>
          </ActionIcon>
        </Box>
      </Modal>
    </>
  );
}