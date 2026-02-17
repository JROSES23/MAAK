import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MAAK Productivity',
    short_name: 'MAAK',
    description: 'Productividad personal premium estilo iOS',
    start_url: '/splash',
    display: 'standalone',
    background_color: '#0B0F1A',
    theme_color: '#0B0F1A',
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png'
      }
    ]
  };
}
