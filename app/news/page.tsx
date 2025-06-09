import React, { Suspense } from 'react';
import NewsClient from './NewsClient';

// Server component that wraps the client component in a Suspense boundary
export default function NewsPage() {
  return (
    <Suspense fallback={<p>読み込み中です...</p>}>
      <NewsClient />
    </Suspense>
  );
}