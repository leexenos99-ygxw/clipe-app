interface SiriLogoProps {
  size?: 'small' | 'medium' | 'large' | 'hero'
}

export function SiriLogo({ size = 'medium' }: SiriLogoProps) {
  const sizes = {
    small: 44,
    medium: 68,
    large: 110,
    hero: 280,
  }
  const s = sizes[size]
  const fontSize = s * 0.22
  const strokeWidth = s * 0.035

  return (
    <div className="clipe-logo-container">
      <svg
        width={s}
        height={s}
        viewBox="0 0 160 160"
        className="clipe-svg"
      >
        <defs>
          <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B2B5" />
            <stop offset="30%" stopColor="#63D5D6" />
            <stop offset="60%" stopColor="#A7E4E4" />
            <stop offset="100%" stopColor="#63D5D6" />
          </linearGradient>
          <linearGradient id="logoGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#028081" />
            <stop offset="50%" stopColor="#04999C" />
            <stop offset="100%" stopColor="#06B2B5" />
          </linearGradient>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#F2FCFC" />
            <stop offset="60%" stopColor="#E3F7F7" />
            <stop offset="100%" stopColor="#CFEFEF" />
          </linearGradient>
          <linearGradient id="cutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
          <filter id="logoGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="textGlow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="cutClip">
            <rect x="80" y="25" width="55" height="110" rx="10" />
          </clipPath>
        </defs>

        <g className="logo-ring">
          <circle cx="80" cy="80" r="65" fill="none" stroke="rgba(6,178,181,0.12)" strokeWidth="1" className="ring-outer" />
          <circle cx="80" cy="80" r="58" fill="none" stroke="rgba(6,178,181,0.18)" strokeWidth="1" className="ring-inner" />
          <circle cx="80" cy="80" r="52" fill="none" stroke="rgba(99,213,214,0.15)" strokeWidth="1.5" className="ring-center" />
        </g>

        <g className="logo-particles">
          <circle cx="22" cy="35" r="2.5" fill="#06B2B5" className="particle p1" />
          <circle cx="138" cy="45" r="3" fill="#63D5D6" className="particle p2" />
          <circle cx="130" cy="125" r="2.5" fill="#028081" className="particle p3" />
          <circle cx="30" cy="128" r="3" fill="#A7E4E4" className="particle p4" />
        </g>

        <g className="logo-main">
          <rect
            x="25" y="25" width="110" height="110" rx="20"
            fill="url(#logoGrad1)"
            className="logo-bg"
            filter="url(#logoGlow)"
          />

          <rect
            x="30" y="30" width="100" height="100" rx="16"
            fill="rgba(255,255,255,0.08)"
            className="logo-bg-inner"
          />

          <rect
            x="35" y="35" width="90" height="90" rx="12"
            fill="rgba(255,255,255,0.05)"
            className="logo-bg-deep"
          />

          <g clipPath="url(#cutClip)">
            <rect
              x="80" y="25" width="55" height="110" rx="10"
              fill="url(#cutGrad)"
              className="logo-cut-area"
            />
          </g>

          <path
            d="M80 35 L80 125"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="cut-line-v"
          />

          <path
            d="M68 105 L92 105"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="cut-line-h"
          />

          <path
            d="M70 102 L80 112 L90 102"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={strokeWidth * 0.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cut-arrow"
          />

          <g className="scissors-icon" transform="translate(42, 38)">
            <circle cx="14" cy="14" r="10" fill="rgba(255,255,255,0.15)" />
            <circle cx="14" cy="14" r="6" fill="white" className="scissors-pivot" />
            <path
              d="M14 5 L24 0 L28 10 L18 14"
              fill="none"
              stroke="url(#logoGrad2)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="scissors-blade-1"
            />
            <path
              d="M14 23 L24 28 L28 18 L18 14"
              fill="none"
              stroke="url(#logoGrad2)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="scissors-blade-2"
            />
          </g>

          <g className="brand-text" transform="translate(80, 95)">
            <text
              x="0" y="0"
              textAnchor="middle"
              fill="url(#textGrad)"
              fontSize={fontSize}
              fontWeight="900"
              fontFamily="'Segoe UI', 'Helvetica Neue', sans-serif"
              className="logo-text"
              filter="url(#textGlow)"
              style={{ letterSpacing: '-1.5px' }}
            >
              Clipe
            </text>
          </g>

          <g className="brand-sub" transform="translate(80, 112)">
            <text
              x="0" y="0"
              textAnchor="middle"
              fill="rgba(255,255,255,0.55)"
              fontSize={s * 0.065}
              fontWeight="500"
              fontFamily="'Segoe UI', sans-serif"
              className="logo-sub"
            >
              AI
            </text>
          </g>
        </g>
      </svg>

      <style>{`
        .clipe-logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .clipe-svg {
          animation: logo-float 10s ease-in-out infinite;
          filter: drop-shadow(0 6px 20px rgba(6, 178, 181, 0.3));
        }

        @keyframes logo-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(0.2deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(3px) rotate(-0.2deg); }
        }

        .logo-bg {
          animation: bg-pulse 6s ease-in-out infinite;
        }

        @keyframes bg-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.92; }
        }

        .logo-bg-inner {
          animation: inner-shine 5s ease-in-out infinite;
        }

        @keyframes inner-shine {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.15; }
        }

        .logo-bg-deep {
          animation: deep-shine 4s ease-in-out infinite;
        }

        @keyframes deep-shine {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.08; }
        }

        .logo-cut-area {
          animation: cut-glow 3.5s ease-in-out infinite;
        }

        @keyframes cut-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }

        .cut-line-v {
          animation: line-pulse 2.5s ease-in-out infinite;
        }

        .cut-line-h {
          animation: line-pulse 2.5s ease-in-out infinite;
          animation-delay: 0.6s;
        }

        @keyframes line-pulse {
          0%, 100% { stroke-opacity: 0.6; }
          50% { stroke-opacity: 1; }
        }

        .cut-arrow {
          animation: arrow-glow 1.8s ease-in-out infinite;
        }

        @keyframes arrow-glow {
          0%, 100% { stroke-opacity: 0.7; }
          50% { stroke-opacity: 1; }
        }

        .scissors-pivot {
          animation: pivot-glow 2.5s ease-in-out infinite;
        }

        @keyframes pivot-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; }
        }

        .scissors-blade-1 {
          animation: blade-move 2.5s ease-in-out infinite;
        }

        .scissors-blade-2 {
          animation: blade-move 2.5s ease-in-out infinite;
          animation-delay: 0.25s;
        }

        @keyframes blade-move {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          50% { transform: rotate(2.5deg) translateX(1.5px); }
        }

        .logo-text {
          animation: text-shine 5s ease-in-out infinite;
        }

        @keyframes text-shine {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.92; }
        }

        .logo-sub {
          animation: sub-fade 3.5s ease-in-out infinite;
        }

        @keyframes sub-fade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.75; }
        }

        .particle {
          animation: particle-float 12s ease-in-out infinite;
          opacity: 0.4;
        }

        .p1 { animation-delay: 0s; }
        .p2 { animation-delay: 3s; }
        .p3 { animation-delay: 6s; }
        .p4 { animation-delay: 9s; }

        @keyframes particle-float {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          25% { transform: translate(10px, -10px); opacity: 0.8; }
          50% { transform: translate(0, -18px); opacity: 0.3; }
          75% { transform: translate(-10px, -10px); opacity: 0.8; }
        }

        .ring-outer {
          animation: ring-rotate 25s linear infinite;
        }

        .ring-inner {
          animation: ring-rotate 30s linear infinite reverse;
        }

        .ring-center {
          animation: ring-rotate 20s linear infinite;
        }

        @keyframes ring-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}