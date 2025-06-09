'use client';

import Stack from '@mui/material/Stack';
import { Grid, Card, CardActionArea, CardContent } from '@mui/material'; // ✅ OK
import CardMedia from '@mui/material/CardMedia';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useRequireAuth from '../lib/use-require-auth';

type Topic = {
  topics_id: string;
  subject: string;
  inst_ymdhi: string;
  ext_8: {
    url: string;
  };
};

export default function NewsClient() {
  const isLoggedIn = useRequireAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Topic[]>();
  const [pageCount, setPageCount] = useState<number>();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const currentPage = searchParams.get('page') || '1';

    fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        '/rcms-api/1/content/list?pageID=' +
        currentPage,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.errors && data.errors.length) {
          return;
        }
        setItems(data.list);
        setPageCount(data.pageInfo.totalPageCnt);
      });
  }, [isLoggedIn, searchParams]);

  if (!isLoggedIn) {
    return null;
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', String(page));
    router.push(`/news?${newParams.toString()}`);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h1">
        News
      </Typography>

      <Box>
        <Grid container spacing={3}>
  {items?.map((item) => (
    <Grid item key={item.topics_id} xs={12} sm={6} md={4}>
      <Card>
        <Link href={`/news/${item.topics_id}`} passHref>
          <CardActionArea>
            <CardContent>
              {/* 表示内容など */}
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </Grid>
  ))}
</Grid>

      </Box>

      <Pagination
        onChange={handlePageChange}
        count={pageCount || 1}
      />
    </Stack>
  );
}
