'use client'

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';


import {  
  Title, 
  Image,  
  Modal, 
  Text,
  Overlay,
  Box,
  Grid,
} from '@mantine/core';

import { useDisclosure, useHover } from '@mantine/hooks';
import classes from './page.module.css'
import { ViewImage } from '@/components/pagecomponents/viewimg';

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
  const [coverImg, setCoverImg] = useState(defaultImage);
  const [imgset, setImgset] = useState({});

  const [opened, { open, close }] = useDisclosure(false);
  const [viewImage, setViewImage] = useState('');
  const [imageName, setImageName] = useState('');

  const MotionTitle = motion(Title);
  const MotionText = motion(Text);

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
    //Fetch imageset data
    fetchImageSet();

    //Fetch images
    fetchImages();
  }, []);

  function onSelect(img){
    setViewImage(img.image)
    setImageName(img.filename)
    open();
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
            style={{ position: 'absolute'}}
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
      
      <div style={{height:50}}></div>
      <br/>

      <Grid>
        {
          images.map((item, index) => 
              <Grid.Col span={{ base: 12, md: 2, lg: 1.5, sm: 6, xs: 6 }} key={item.filename} onClick={() => onSelect(item)}>
                  <ViewImage 
                  image={item.image} 
                  title={item.filename}
                  index={index}
                  onClickFunc={open}
                  />
              </Grid.Col>
          )
        }
      </Grid>

      <Modal fullScreen opened={opened} onClose={close} title={imageName}>
        <Box style={{position: "relative"}}>
          <Image
            src={viewImage}
            style={{
              height: "90vh",
              objectFit: "contain",
            }}
          />
        </Box>
      </Modal>
    </>
  );
}