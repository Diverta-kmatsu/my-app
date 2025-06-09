'use client';

import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/auth';

type FormData = {
  email: string;
  password: string;
};

const Signin = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const { login } = useAuth();

  const submit = (data: FormData) => {
    login(data.email, data.password);
  };

  return (
    <Card
      sx={{
        p: 5,
      }}
    >
      <form onSubmit={handleSubmit(submit)}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1">
            Sign In
          </Typography>
          <TextField
            label="Email"
            required
            autoComplete="email"
            {...register('email', {
              required: true,
            })}
            variant="outlined"
          />
          <TextField
            type="password"
            label="Password"
            required
            autoComplete="new-password"
            {...register('password', {
              required: true,
            })}
            variant="outlined"
          />
          <Box>
            <Button variant="contained" type="submit">
              Sign In
            </Button>
          </Box>
        </Stack>
      </form>
    </Card>
  );
};

export default Signin;