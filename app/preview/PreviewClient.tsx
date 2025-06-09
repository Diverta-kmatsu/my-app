"use client";

import { Container, Typography, Card, CardContent } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useRequireAuth from '../lib/use-require-auth';

// Define the API response type
type PreviewResponse = {
  details: {
    subject: string;
    contents: string;
    // Add other fields that might be in the response
  };
  errors?: Array<{ message: string }>;
};

export default function PreviewClient() {
  const isLoggedIn = useRequireAuth();
  const searchParams = useSearchParams();
  
  const [topic, setTopic] = useState<PreviewResponse['details'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    
    const token = searchParams.get('preview_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        '/rcms-api/1/content/preview?preview_token=' +
        token,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((data: PreviewResponse) => {
        if (data.errors && data.errors.length) {
          setError(data.errors[0].message);
          return;
        }
        setTopic(data.details);
      })
      .catch(() => {
        setError("通信エラーが発生しました。");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchParams, isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return <p>読み込み中です...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!topic) {
    return <p>データが見つかりませんでした。</p>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            プレビュー画面サンプル
          </Typography>
          <Typography variant="body1" paragraph>
            タイトル: {topic.subject}
          </Typography>
          <Typography variant="body1" paragraph>
            内容: 
            <span
              dangerouslySetInnerHTML={{
                __html: topic.contents,
              }}
            />
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}