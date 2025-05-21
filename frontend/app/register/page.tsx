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

    const Register = async () => {
      const formData = new FormData();
      formData.append("username", usernameInput);
      formData.append("password", passwordInput);

      const res = await fetch("http://localhost:3000/api/register_user", {
        method: "POST",
        body: formData,
      });

      const parsedResponse = await res.json();

      if (!res.ok) {
        throw new Error("Failed to authenticate");
      }

      console.log('Login success:', parsedResponse);
      router.replace("/login")
    };


    return (
      <div>
        <Paper className={classes.form} radius={0} p={30}>
          <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
            Create a new account
          </Title>

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
          <Button fullWidth mt="xl" size="md" type='submit' onClick={Register}>
            Register
          </Button>
        </Paper>
      </div>
    );
  }