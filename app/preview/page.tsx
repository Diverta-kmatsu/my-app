import React, { Suspense } from 'react';
import PreviewClient from './PreviewClient';

// Server component that wraps the client component in a Suspense boundary
export default function PreviewPage() {
  return (
    <Suspense fallback={<p>読み込み中です...</p>}>
      <PreviewClient />
    </Suspense>
  );
}