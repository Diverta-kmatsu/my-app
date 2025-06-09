'use client';

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Control, Controller, useForm, UseFormRegister } from 'react-hook-form';
import useRequireAuth from '../lib/use-require-auth';

type FormOption = {
  key: string;
  value: string;
  default?: boolean;
};

type FormField = {
  type: number;
  title: string;
  required?: number;
  contents?: FormOption[];
  order_no?: number;
};

type Form = {
  cols: {
    [key: string]: FormField;
  };
};

type FormData = {
  [key: string]: string | string[];
};

type ErrorResponse = {
  message: string;
};

const getField = (
  register: UseFormRegister<FormData>,
  name: string,
  field: FormField,
  control: Control<FormData>
) => {
  switch (field.type) {
    case 1:
    case 2:
    case 4:
      return (
        <TextField
          sx={{
            width: '100%',
          }}
          label={field.title}
          multiline={field.type === 2}
          minRows={4}
          select={field.type === 4}
          required={field.required === 2}
          autoComplete={name}
          defaultValue=""
          {...register(name, {
            required: field.required === 2,
          })}
          variant="outlined"
        >
          {field.type === 4 &&
            field.contents?.map((option: FormOption) => (
              <MenuItem value={option.key} key={option.key}>
                {option.value || '-'}
              </MenuItem>
            ))}
        </TextField>
      );
    case 3:
      return (
        <FormControl>
          <FormLabel>{field.title}</FormLabel>
          <RadioGroup>
            {field.contents?.map((option: FormOption) => (
              <FormControlLabel
                key={option.key}
                control={<Radio {...register(name)} />}
                value={option.key}
                label={option.value}
                defaultChecked={option.default}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    case 5:
      return (
        <FormControl>
          <FormLabel>{field.title}</FormLabel>
          <FormGroup>
            <Controller
              name={name}
              control={control}
              defaultValue={field.contents?.filter((o: FormOption) => o.default).map(o => o.key) || []}
              render={({ field: rfField }) => (
                <>
                  {field.contents?.map((option: FormOption) => (
                    <FormControlLabel
                      key={option.key}
                      control={
                        <Checkbox
                          checked={Array.isArray(rfField.value) && rfField.value.some(
                            (f: string) => f === option.key
                          )}
                        />
                      }
                      onChange={(_, checked) => {
                        if (checked) {
                          rfField.onChange([...rfField.value, option.key]);
                        } else {
                          rfField.onChange(
                            Array.isArray(rfField.value) ? rfField.value.filter(
                              (value: string) => value !== option.key
                            ) : []
                          );
                        }
                      }}
                      value={option.key}
                      label={option.value}
                    />
                  ))}
                </>
              )}
            />
          </FormGroup>
        </FormControl>
      );
    default:
      return null;
  }
};

const Contact = () => {
  const isLoggedIn = useRequireAuth();
  const [form, setForm] = useState<Form>();
  const { register, handleSubmit, control } = useForm<FormData>();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/rcms-api/1/inquiry/1', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setForm(data?.details);
      });
  }, [isLoggedIn]);

  const submit = (data: FormData) => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/rcms-api/1/inquiry/1', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.errors && res.errors.length) {
          res.errors.map((e: ErrorResponse) => alert(e.message));
        } else {
          alert('success');
        }
      });
  };

  if (!form || !isLoggedIn) {
    return null;
  }

  return (
    <Stack
      spacing={2}
      sx={{
        mb: 5,
      }}
    >
      <Typography variant="h5" component="h1">
        Contact
      </Typography>

      <form onSubmit={handleSubmit(submit)}>
        <Stack spacing={2}>
          {Object.entries(form.cols)
            .sort((a, b) => (b[1].order_no || 0) - (a[1].order_no || 0))
            .map(([name, field]) => (
              <Box key={name}>{getField(register, name, field, control)}</Box>
            ))}
          <Box>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </Stack>
      </form>
    </Stack>
  );
};

export default Contact;