import { ImageResponse } from 'next/og';

export const alt = 'WebXray — 30-Second Mobile Website & Code Diagnostics';
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
            'radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.22), transparent 50%)',
          padding: '64px',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              height: '20px',
              width: '20px',
              borderRadius: '9999px',
              backgroundColor: '#34d399',
            }}
          />
          <span style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            WebXray
          </span>
          <span
            style={{
              marginLeft: '16px',
              borderRadius: '9999px',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              padding: '6px 18px',
              fontSize: '18px',
              color: '#6ee7b7',
            }}
          >
            Free 30s Mobile &amp; Code Audit
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '940px' }}>
          <div style={{ fontSize: '62px', fontWeight: 800, lineHeight: 1.1 }}>
            Find out why visitors are{' '}
            <span style={{ color: '#34d399' }}>leaving your website</span> in 30 seconds.
          </div>
          <div style={{ fontSize: '26px', color: '#94a3b8', lineHeight: 1.4 }}>
            Real iPhone 14 Viewport • Speed &amp; TTFB • Security Headers • Copy-Paste Code Fixes
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #1e293b',
            paddingTop: '24px',
            fontSize: '22px',
            color: '#64748b',
          }}
        >
          <span>webxray-virid.vercel.app</span>
          <span style={{ color: '#34d399', fontWeight: 700 }}>Instant Diagnostic X-Ray →</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
