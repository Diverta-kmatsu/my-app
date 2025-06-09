import { use } from 'react';
import NewsDetailClient from './NewsDetailClient';

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  // Return a list of possible values for topics_id
  return [
    { topics_id: '1' },
    { topics_id: '2' },
    { topics_id: '3' },
    // Add more IDs as needed for pre-rendering
  ];
}

export default function NewsDetailPage(props: { params: Promise<{ topics_id: string }> }) {
  const params = use(props.params);
  return <NewsDetailClient topicsId={params.topics_id} />;
}     