'use client'
import { IconLibraryPhoto, IconPointFilled, IconPlus, IconSwitchHorizontal, IconLogout } from '@tabler/icons-react';
import { ActionIcon, Badge, Button, Card, Grid, Group, Title, Text, Box } from '@mantine/core';
import { CollectionCard } from "@/components/pagecomponents/collectionCard"
import { useEffect, useState } from "react";
import classes from './page.module.css';
import { Code} from '@mantine/core';
import '@mantine/core/styles.css';

const mockdata = {
  image:
    'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
};

const navBarData = [
    { link: '', label: 'New Imageset', icon: IconPlus},
];

function getImageSets(data){
    let output = []
    for(var x = 0; x < data.length; x++){
        output.push(data[x]["setname"])
    }

    return output;
}

export default function BadgeCard() {
    const { image } = mockdata;
    const [active, setActive] = useState('');

    const links = navBarData.map((item) => (
        <a
          className={classes.link}
          data-active={item.label === active || undefined}
          href={item.link}
          key={item.label}
          onClick={(event) => {
            event.preventDefault();
            setActive(item.label);
          }}
        >
          <item.icon className={classes.linkIcon} stroke={1.5} />
          <span>{item.label}</span>
        </a>
    ));

    const [imgsets, setImgSets] = useState([])
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/getimagesets')
        .then(res => res.json())
        .then(data => setImgSets(getImageSets(data)));
    }, [])


    return (
        <>
        <Box>
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify="space-between">
                <Title order={2}>Image Collections</Title>
                </Group>
                {links}
            </div>

            <div className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
                <span>Change account</span>
                </a>

                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                <IconLogout className={classes.linkIcon} stroke={1.5} />
                <span>Logout</span>
                </a>
            </div>
        </nav>
        </Box>

        <Box className={classes.grid}>
        <Grid className='p-8'>
        {
            imgsets.map((item) => 
                <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 6, xs: 6 }} key={item}>
                    <CollectionCard image={image} title={item}/>
                </Grid.Col>
            )
        }
        </Grid>
        </Box>
        </>
    );
}