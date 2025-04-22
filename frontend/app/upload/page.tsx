'use client'
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import { useEffect, useState } from 'react';
import { Group, Text, Select } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';

async function PostImages(files : any, set : string) {
    console.log('accepted', files)

    for(var i = 0; i < files.length; i++){
        const file = files[i] as File;
        const formData = new FormData();
        formData.append("file", file);  

        fetch(`http://127.0.0.1:8000/api/postimage/${set}`, {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }
}

function getImageSets(data){
    let output = []
    for(var x = 0; x < data.length; x++){
        output.push(data[x]["setname"])
    }

    return output;
}

export default function Main() {
    const [imgsets, setImgSets] = useState([])
    const [targetSet, setTargetSet] = useState("")

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/getimagesets')
        .then(res => res.json())
        .then(data => setImgSets(getImageSets(data)));
    }, [])

    return(
        <>
        <Select label="Image Sets" data={imgsets} value={targetSet} onChange={setTargetSet}/>

        <Dropzone
        onDrop={(files) => PostImages(files, targetSet)}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={100 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}>
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
                <Text size="xl" inline> Drag images here or click to select files </Text>
                <Text size="sm" c="dimmed" inline mt={7}> Attach as many files as you like, each file should not exceed 5mb</Text>
            </div>
            </Group>
        </Dropzone>
        </>
    );
}
