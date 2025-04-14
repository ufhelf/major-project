'use client'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import { Group, Text } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';

async function PostImages(files : any) {
    console.log('accepted', files)

    for(var i = 0; i < files.length; i++){

        const file = files[i] as File;
        const formData = new FormData();
        formData.append("file", file);  

        fetch("http://127.0.0.1:8000/api/postimage", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }
}

export default function Main() {
    return(
        <>
        <Dropzone
        onDrop={(files) => PostImages(files)}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={5 * 1024 ** 2}
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
