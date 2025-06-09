"use client";
import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent, CardMedia } from '@mui/material';
import useRequireAuth from '../../lib/use-require-auth';

type NewsDetailResponse = {
  details: {
    topics_id: number;
    ymd: string;
    subject: string;
    contents: string;
    ext_8: {
      id: string;
      url: string;
      desc: string;
      url_org: string;
    };
  };
};

export default function NewsDetailClient({ topicsId }: { topicsId: string }) {
  const isLoggedIn = useRequireAuth();
  const [detail, setDetail] = useState<NewsDetailResponse["details"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/rcms-api/1/content/details/${topicsId}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        if (!res.ok) {
          setError("エラーが発生しました。");
          return;
        }
        const data: NewsDetailResponse = await res.json();
        setDetail(data.details);
      } catch {
        setError("通信エラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [topicsId, isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return <p>読み込み中です...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!detail) {
    return <p>データが見つかりませんでした。</p>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            詳細画面サンプル
          </Typography>
          <Typography variant="body1" paragraph>
            トピックス ID: {detail.topics_id}
          </Typography>
          <Typography variant="body1" paragraph>
            日付: {detail.ymd}
          </Typography>
          <Typography variant="body1" paragraph>
            タイトル: {detail.subject}
          </Typography>
          <Typography variant="body1" paragraph>
            内容: {detail.contents}
          </Typography>

          {detail.ext_8 && (
            <CardMedia
              component="img"
              sx={{ mt: 2 }}
              image={detail.ext_8.url}
              alt={detail.ext_8.desc || 'メイン画像'}
            />
          )}
        </CardContent>
      </Card>
    </Container>
  );
}