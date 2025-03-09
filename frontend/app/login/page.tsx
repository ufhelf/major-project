'use client'
import '@mantine/core/styles.css';
import {
    Anchor,
    Button,
    Checkbox,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
  } from '@mantine/core';

import classes from './AuthenticationImage.module.css';
import { useState } from 'react';

async function tryLogin(username : string, password : string) {
  const res = await fetch("http://127.0.0.1:8000/api/siteusers/"+username+"&"+password,{method:"GET"});
  const parsedResponse = await res.json()

  if (!res.ok) {
    //Credential error
    throw new Error("Failed to fetch data");
  }

  //Login
  alert("success!")
}

export default function AuthenticationImage() {
    const [usernameInput, setUsername] = useState("")
    const [passwordInput, setPassword] = useState("")

    return (
      <div className={classes.wrapper}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
            Welcome back to [Insert website name]!
          </Title>
  
          <TextInput label="Username" placeholder="e.g John Doe" size="md" onChange={(event) => setUsername(event.currentTarget.value)}/>
          <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" onChange={(event) => setPassword(event.currentTarget.value)}/>
          <Checkbox label="Keep me logged in" mt="xl" size="md" />
          <Button fullWidth mt="xl" size="md" onClick={() => tryLogin(usernameInput, passwordInput)}>
            Login
          </Button>
  
          <Text ta="center" mt="md">
            Don&apos;t have an account?{' '}
            <Anchor<'a'> href="#" fw={700} onClick={(event) => event.preventDefault()}>
              Register
            </Anchor>
          </Text>
        </Paper>
      </div>
    );
  }