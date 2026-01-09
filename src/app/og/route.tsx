import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const title = searchParams.get('title') || 'Therefor Bitcoin';
  const subtitle = searchParams.get('subtitle') || 'Clear answers. Fair objections. Primary sources.';
  const topic = searchParams.get('topic') || '';

  // Topic colors
  const topicColors: Record<string, string> = {
    basics: '#F7931A',
    security: '#4CAF50',
    mining: '#FF9800',
    lightning: '#9C27B0',
    economics: '#2196F3',
    criticism: '#F44336',
    money: '#FFD700',
    dev: '#607D8B',
  };

  const accentColor = topic ? (topicColors[topic] || '#F7931A') : '#F7931A';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#0a0a0a',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 30% 20%, ${accentColor}15 0%, transparent 50%)`,
          }}
        />
        
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#0a0a0a',
            }}
          >
            ₿
          </div>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Therefor Bitcoin
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxWidth: '900px',
          }}
        >
          {topic && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: `${accentColor}20`,
                borderRadius: '8px',
                border: `1px solid ${accentColor}40`,
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: accentColor,
                  textTransform: 'capitalize',
                }}
              >
                {topic.replace('-', ' ')}
              </span>
            </div>
          )}
          
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            {title}
          </h1>
          
          <p
            style={{
              fontSize: '28px',
              color: '#a0a0a0',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <span
            style={{
              fontSize: '20px',
              color: '#666666',
            }}
          >
            thereforbitcoin.com
          </span>
          
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            {['Clear answers', 'Fair objections', 'Primary sources'].map((tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: '14px',
                  color: '#888888',
                  padding: '6px 12px',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '6px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
