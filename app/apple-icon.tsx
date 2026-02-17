import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0F172A, #2A1F49)',
          borderRadius: 44,
          color: '#F8FAFC',
          fontSize: 84,
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
