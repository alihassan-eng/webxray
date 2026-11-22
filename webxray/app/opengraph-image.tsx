import { ImageResponse } from 'next/og';

export const alt = 'WebXray — 30s Mobile Website & Code Diagnostics';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#020617',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.28), transparent 55%)',
          padding: '72px',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              height: '28px',
              width: '28px',
              borderRadius: '9999px',
              backgroundColor: '#34d399',
            }}
          />
          <span style={{ fontSize: '46px', fontWeight: 900, letterSpacing: '-0.02em' }}>
            WebXray
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              fontSize: '74px',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
            }}
          >
            Fix Why Visitors Leave Your Site in 30s.
          </div>
          <div style={{ display: 'flex', fontSize: '34px', fontWeight: 600, color: '#34d399' }}>
            Mobile Speed • Security • SEO • Code Fixes
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid #1e293b',
            paddingTop: '28px',
            fontSize: '30px',
            fontWeight: 700,
            color: '#94a3b8',
          }}
        >
          <span>webxray-virid.vercel.app</span>
          <span style={{ color: '#34d399' }}>Free X-Ray Audit →</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
