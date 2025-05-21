'use client'

import { 
    IconPlus, 
    IconSwitchHorizontal, 
    IconLogout 
} from '@tabler/icons-react';

import { 
    Modal, 
    Grid, 
    Group, 
    Title, 
    TextInput, 
    Box, 
    Button, 
    Text 
} from '@mantine/core';

import { notifications } from '@mantine/notifications';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { CollectionCard } from "@/components/pagecomponents/collectionCard"
import { useEffect, useState } from "react";
import classes from './page.module.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { useRouter } from 'next/navigation';

const defaultImage = "https://images.unsplash.com/photo-1739276364069-568b35ea578e?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const navBarData = [
    { link: '', label: 'New Imageset', icon: IconPlus},
];

function getImageSets(data){
    let output = []
    for(var x = 0; x < data.length; x++){
        let i = data[x];
        i["date"] = new Date(i["date"])
        if (i["coverImage"] == null) i["coverImage"] = defaultImage;
        output.push(i);
    }

    return output;
}

async function PostImageSet(name: string, date: Date) {
    let formdata = new FormData();
    formdata.append('name', name);
    formdata.append('date', date.toISOString().split("T")[0]);

    try {
        const response = await fetch('http://127.0.0.1:8000/api/postimageset', {
            method: 'POST',
            body: formdata,
        });

        if(response.status == 409){
            notifications.show({
                title: 'An imageset already exists with that name',
                color: "red",
                message: `Name: ${name}`,
            })

            console.log("Error: Requested name already exists")
            return;
        }
        
        if (!response.ok) {
            throw new Error('Failed to create imageset');
        }

        const data = await response.json();
        console.log(data);

        notifications.show({
            title: 'Imageset successfully created',
            message: `Name: ${name}`,
        })
    } catch (error) {
        console.error('Error:', error);

        notifications.show({
            title: 'Imageset creation failed',
            color: "red",
            message: `Name: ${name}`,
        })
    }
}

export default function BadgeCard() {
    const [active, setActive] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');

    //This stuff has no use rn
    const [selected, setSelected] = useState([])
    const [isSelectMode, setSelectMode] = useState(false)
    const [date, setDate] = useState<Date | null>(null);

    const [opened, { open, close }] = useDisclosure(false);
    const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
    const [deleteTarget, setDeleteTarget] = useState('')

    //Errors
    const [nameError, setNameError] = useState('')
    const [dateError, setDateError] = useState('')

    const router = useRouter()

    const getCsrfToken = () => {
      return document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken=')).split('=')[1];
    };

    async function checkLoggedIn() {
        const res = await fetch("http://localhost:3000/api/whoami", {
            credentials: "include",
        });
        if (res.ok) {
            const data = await res.json();
            setUsername(data["username"])
        } else {
            router.replace("/login")
        }
    }

    async function logout(){
        const csrfToken = getCsrfToken();
        const res = await fetch("http://localhost:3000/api/logout_user", {
            method: "POST",
            credentials: "include", 
            headers: {
                "X-CSRFToken": csrfToken,
            },
        });

        if (!res.ok) {
            return;
        }

        router.replace("/login")
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.currentTarget.value;
        console.log(rawValue.length)

        if (rawValue.length > 50){
            setNameError('Max 50 Characters');
            return;
        } else {
            setNameError('');
        }

        const sanitizedValue = rawValue.replace(/[^a-zA-Z0-9 _-]/g, '');
      
        if (sanitizedValue !== rawValue) {
          setNameError('Invalid characters. Only letters, numbers, spaces, underscores, and dashes are allowed.');
        } else {
          setNameError('');
        }
      
        setName(sanitizedValue);
      };

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

    const fetchImageSets = () => {
        fetch('http://127.0.0.1:8000/api/getimagesets')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Server error: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setImgSets(getImageSets(data));
            })
            .catch((error) => {
                console.error("Failed to fetch image sets:", error);
    
                notifications.show({
                    color: 'red',
                    title: 'Failed to fetch imagesets',
                    message: 'There was a problem connecting to the server.',
                });
            });
    };
    

    function confirmDeletion(name:string){
        setDeleteTarget(name)
        openDelete()
    }

    function DeleteSet() {
        fetch(`http://127.0.0.1:8000/api/deleteimageset/${deleteTarget}`, {
            method: "DELETE",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
    
            fetchImageSets();
    
            notifications.show({
                title: '🗑️ Imageset successfully deleted',
                message: `Name: ${deleteTarget}`,
            });
    
            setDeleteTarget('');
            closeDelete();
        })
        .catch((error) => {
            console.error("Delete failed:", error);
    
            notifications.show({
                color: 'red',
                title: 'Delete failed',
                message: 'Unable to delete the imageset. Please try again later.',
            });
        });
    }
    

    useEffect(() => {
        checkLoggedIn()
        fetchImageSets();
    }, []);

    const OnCreate = async () =>{
        //Error checking
        var error = false;
        if (!name.trim()) {
            setNameError('Name is required');
            error=true;
        }

        if(nameError) error=true;

        if(!date){
            setDateError('Date is required')
            error=true;
        }

        if(error) return;
        
        //Check if name is valid
        await PostImageSet(name, date);

        //Update imagesets
        setTimeout(() => {
            fetchImageSets();
        }, 300);

        close();
        setDate(null);
        setName('');
    }

    const handleRemoveItem = name => {
        setSelected(selected.filter(item => item.name !== name))

        if(selected.length == 0){
            setSelectMode(false)
        }
    }

    const handleSelectItem = name =>{
        setSelected(old => [...old, name])
        setSelectMode(true)
    }

    return (
        <>
        <Box>
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify="space-between">
                <Title order={2}>Imagesets</Title>
                </Group>
                <button className={classes.link} style={{width:"100%"}} key="New Imageset" onClick={open}>
                    <IconPlus className={classes.linkIcon} stroke={1.5} />
                    <span>New Imageset</span>
                </button>
            </div>

            <div className={classes.footer}>
                <Title className={classes.link} order={4}>Logged in as: {username}</Title>

                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
                <span>Change account</span>
                </a>

                <a href="#" className={classes.link} onClick={(event) => logout()}>
                <IconLogout className={classes.linkIcon} stroke={1.5} />
                <span>Logout</span>
                </a>
            </div>
        </nav>
        </Box>

        {/*Create imageset popup*/}
        <Modal opened={opened} onClose={() => { setNameError(''); setDateError(''); close(); }} title="Create New Imageset">
            <TextInput label="Name" value={name} 
            onChange={handleNameChange}
            error={nameError} 
            withAsterisk/><br/>

            <DatePickerInput label="Pick date" value={date} 
            onChange={(event) => {
                setDate(event);
                if(dateError) setDateError('');
            }}
            error={dateError}
            withAsterisk/><br/>

            <Group>
                <Button onClick={OnCreate}>Create</Button>
            </Group>
        </Modal>

        {/*Model to confirm imageset deletion*/}
        <Modal opened={deleteOpened} onClose={closeDelete} 
            title="Delete Imageset">

            <Title order={5}>Are your sure you want to delete this imageset?</Title><br/>
            <Text style={{color:"red"}} fs="bold">Warning: This action cannot be undone</Text><br/>
            <Button color='red' onClick={DeleteSet}>Delete</Button>
        </Modal>

        <Box className={classes.grid}>
        <Grid className='p-8'>
        {
            imgsets.map((item) => 
                <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 6, xs: 6 }} key={item["setname"]}>
                    <CollectionCard 
                    image={item["coverImage"]} 
                    title={item["setname"]} 
                    date={item["date"]}
                    imageCount={item["image_count"].toString()}
                    onSelect={() => handleSelectItem(item)}
                    onDeselect={() => handleRemoveItem(item)}
                    onDelete={confirmDeletion}/>
                </Grid.Col>
            )
        }
        </Grid>
        </Box>
        </>
    );
}