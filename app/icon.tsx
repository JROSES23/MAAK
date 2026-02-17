import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0B0F1A, #1D2957)',
          borderRadius: 120,
          color: '#F8FAFC',
          fontSize: 220,
          fontWeight: 700,
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      >
        M
      </div>
    ),
    {
      ...size
    }
  );
}
