'use client'

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { 
  IconArrowLeft, 
  IconUpload, 
  IconSettings,
  IconPhoto, 
  IconX,
  IconTrash,
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
  LoadingOverlay,
  TextInput,
  Affix,
  Card
} from '@mantine/core';

import { useDisclosure, useHover } from '@mantine/hooks';
import classes from './page.module.css'
import { notifications } from '@mantine/notifications';
import { GalleryImage } from '@/components/pagecomponents/galleryimg';
import { title } from 'process';

const defaultImage = "https://images.unsplash.com/photo-1739276364069-568b35ea578e?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

type PageProps = {
  params: {
    slug: string;
  };
};

async function ChangeImageSet(name: string, date: Date, currentName: string): Promise<boolean> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("date", date.toISOString().split("T")[0]);

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/changeimageset/${currentName}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      console.log("ok");
      return true;
    } else {
      notifications.show({
        title: 'Error',
        color: "red",
        message: `Imageset change failed`,
      });
      return false;
    }
  } catch (error) {
    notifications.show({
      title: 'Error',
      color: "red",
      message: `Network or server error: ${(error as Error).message}`,
    });
    return false;
  }
}



export default function Home() {
  const params = useParams();
  const router = useRouter();
  const { hovered, ref } = useHover();
  const { slug } = params;

  const [isCoverLoading, setisCoverLoading] = useState(true)

  const [images, setImages] = useState([]);
  const [coverImg, setCoverImg] = useState(defaultImage)
  const [imgset, setImgset] = useState({})

  const [name, setName] = useState('')
  const [date, setDate] = useState(new Date())

  const MotionTitle = motion(Title);
  const MotionText = motion(Text);

  //Used for select mode
  const [selected, setSelected] = useState([])
  const [isSelectMode, setSelectMode] = useState(false)

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

  async function HandleSave(){
    //Prevent reloading to changed name
    const res = await ChangeImageSet(name, date, slug)

    if(res && slug != name){
      router.replace(`/images/${name}`)
    }
    else{
      fetchImageSet()
      setDate(new Date(imgset["date"]))
    }
    closeSettings()
  }

  function HandleClose(){
    setName(slug)
    setDate(new Date(imgset["date"]))
    closeSettings()
  }

  async function DeleteImage(imgname:string) {
    const formData = new FormData();
    formData.append("name", imgname)
    fetch(`http://127.0.0.1:8000/api/deleteimage/${slug}`, {
      method:"DELETE",
      body: formData,
    })
    .then(response => response.json())
    .then(data => 
      notifications.show({
        title: 'Image successfully deleted',
        message: `Name: ${imgname}`,
    }))
    .catch(error => 
      notifications.show({
        title: 'Failed to deletefile',
        color:"red",
        message: `Name: ${imgname}`,
    }));

    //Make sure server recieved stuff, add a pause 
    //Prob wont work when server is slowwwwwwww
    setTimeout(() => {
      fetchImages();
    }, 200)
  }

  useEffect(() => {
    //Check if user is logged in first
    
    //Fetch imageset data
    fetchImageSet()

    //Fetch images
    fetchImages()
    setName(slug)
  }, []);

  useEffect(() => {
    if (imgset?.date) {
      setDate(new Date(imgset.date));
    }
  }, [imgset]);

  function handleSelectItem(name: string) {
    setSelected((prevSelected) => {
      // Avoid duplicates
      if (!prevSelected.includes(name)) {
        return [...prevSelected, name];
      }
      return prevSelected;
    });
    setSelectMode(true);
  }
  
  function handleRemoveItem(name: string) {
    setSelected((prevSelected) => {
      const updated = prevSelected.filter((item) => item !== name);
      // Turn off select mode if no items remain
      if (updated.length === 0) {
        setSelectMode(false);
      }
      return updated;
    });
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
            {name}
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
          style={{objectFit:"cover", position: "absolute"}}
        />
        <Overlay gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)" opacity={0.85} zIndex={1}/>
      </Box>
      <Grid>
        {
          images.map((item, index) => 
              <Grid.Col span={2} key={item.filename}>
                  <GalleryImage 
                  image={item.image} 
                  title={item.filename}
                  index={index}
                  isSelectMode={isSelectMode}
                  isSelected={selected.includes(item.filename)}
                  onSelect={() => handleSelectItem(item.filename)}
                  onDeselect={() => handleRemoveItem(item.filename)}
                  onDelete={() => DeleteImage(item.filename)}
                  />
              </Grid.Col>
          )
        }
      </Grid>
    </>
  );
}