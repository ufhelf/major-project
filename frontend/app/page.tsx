'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import { Button, MantineProvider, Checkbox, Text, TextInput } from "@mantine/core"
import { Carousel, CarouselSlide } from "@mantine/carousel"
import { HeaderThing } from "@/components/pagecomponents/header";

async function getData(username : string) {
  const res = await fetch("http://127.0.0.1:8000/api/siteusers/");
  const parsedResponse = await res.json()

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const p = JSON.parse(parsedResponse)
  
  for(let i = 0; i < p.length; i++){
    if(p[i]["fields"]["username"] == username){
      return JSON.stringify(p[i]["fields"])
    }
  }
  console.log(JSON.parse(parsedResponse))
}

export default function Home() {
  const [innerText, setButtonText] = useState("Text");
  const [textfield, setTextField] = useState("")
  const changeText = (text) => setButtonText(text);
  return (
    <>
      <MantineProvider>
        <Button onClick={() => changeText(getData(textfield))}>Click me !</Button>
        <TextInput value={textfield} onChange={(event) => setTextField(event.currentTarget.value)}/>
        <Text>{innerText}</Text>
      </MantineProvider>
    </>
  );
}
