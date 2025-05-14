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
import { useRouter } from 'next/navigation';

export default function AuthenticationImage() {
    const [usernameInput, setUsername] = useState("")
    const [passwordInput, setPassword] = useState("")

    const router = useRouter()

    const getCsrfToken = () => {
      return document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken=')).split('=')[1];
    };

    const tryLogin = async () => {
      await fetch("http://localhost:3000/api/get_csrf_token", {
        method: "GET",
        credentials: "include", // So the cookie is stored
      });

      const formData = new FormData();
      formData.append("username", usernameInput);
      formData.append("password", passwordInput);

      const csrfToken = getCsrfToken();

      const res = await fetch("http://localhost:3000/api/authenticate_user", {
        method: "POST",
        body: formData,
        credentials: "include",  // Ensure cookies are included
        headers: {
          "X-CSRFToken": csrfToken,  // Send the CSRF token in the header
        },
      });

      const parsedResponse = await res.json();

      if (!res.ok) {
        throw new Error("Failed to authenticate");
      }

      console.log('Login success:', parsedResponse);
      router.replace("/imagecollections")
    };


    return (
      <div className={classes.wrapper}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
            Welcome back!
          </Title>
  
          <TextInput label="Username" placeholder="e.g John Doe" size="md" onChange={(event) => setUsername(event.currentTarget.value)}/>
          <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" onChange={(event) => setPassword(event.currentTarget.value)}/>
          <Checkbox label="Keep me logged in" mt="xl" size="md" />
          <Button fullWidth mt="xl" size="md" onClick={() => tryLogin()}>
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