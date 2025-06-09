'use client';

import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { RegistFormData, useAuth } from '../context/auth';

const Signup = () => {
  const { register, handleSubmit } = useForm<RegistFormData>();
  const { regist } = useAuth();

  const submit = (data: RegistFormData) => {
    regist(data);
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
            Sign Up
          </Typography>
          <TextField
            label="First Name"
            required
            autoComplete="given-name"
            {...register('name1', {
              required: true,
            })}
            variant="outlined"
          />
          <TextField
            label="Last Name"
            required
            autoComplete="family-name"
            {...register('name2', {
              required: true,
            })}
            variant="outlined"
          />
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
            {...register('login_pwd', {
              required: true,
            })}
            variant="outlined"
          />
          <Box>
            <Button variant="contained" type="submit">
              Sign Up
            </Button>
          </Box>
        </Stack>
      </form>
    </Card>
  );
};

export default Signup; 