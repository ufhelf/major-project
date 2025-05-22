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
    Alert,
  } from '@mantine/core';

import classes from './AuthenticationImage.module.css';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthenticationImage() {
    const [usernameInput, setUsername] = useState("")
    const [passwordInput, setPassword] = useState("")

    const [isFailed, setFailed] = useState(false)

    const router = useRouter()

    //chatgpt gave me this
    const getCsrfToken = () => {
      return document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken=')).split('=')[1];
    };

    const tryLogin = async () => {
      await fetch("http://localhost:3000/api/get_csrf_token", {
        method: "GET",
        credentials: "include",
      });

      const formData = new FormData();
      formData.append("username", usernameInput);
      formData.append("password", passwordInput);

      const csrfToken = getCsrfToken();

      const res = await fetch("http://localhost:3000/api/authenticate_user", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken, 
        },
      });

      const parsedResponse = await res.json();

      if (!res.ok) {
        setFailed(true)
        return;
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

          {isFailed && (
            <>
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="Login failed"
                color="red"
                mt="md"
              >
                Invalid username or password.
              </Alert>
              <br/>
            </>
          )}

          <TextInput 
            name="username" 
            label="Username" 
            placeholder="e.g John Doe" 
            autoComplete="username"
            size="md" 
            onChange={(event) => setUsername(event.currentTarget.value)}
            value={usernameInput}
          />
          <PasswordInput 
            name="password" 
            label="Password" 
            placeholder="Your password" 
            autoComplete="current-password"
            mt="md" 
            size="md" 
            onChange={(event) => setPassword(event.currentTarget.value)}
            value={passwordInput}
          />

          <Checkbox label="Keep me logged in" mt="xl" size="md" />

          <Button fullWidth mt="xl" size="md" type='submit' onClick={tryLogin}>
            Login
          </Button>
  
          <Text ta="center" mt="md">
            Don&apos;t have an account?{' '}
            <Anchor<'a'> href="/register" fw={700}>
              Register
            </Anchor>
          </Text>
        </Paper>
      </div>
    );
  }