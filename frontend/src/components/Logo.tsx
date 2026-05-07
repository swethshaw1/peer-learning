import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Reusable Gradient for special fills if needed */}
      <defs>
        <linearGradient id="peerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Graduation Cap Main Base */}
      <path
        d="M22 10V16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 10L12 5L22 10L12 15L2 10Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 12V17C6 19.2091 8.68629 21 12 21C15.3137 21 18 19.2091 18 17V12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Interconnected Peer Network Lines */}
      <line
        x1="2"
        y1="10"
        x2="6"
        y2="17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 3"
        className="opacity-60"
      />
      <line
        x1="22"
        y1="10"
        x2="18"
        y2="17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 3"
        className="opacity-60"
      />

      {/* Node Dots */}
      <circle cx="2" cy="10" r="1.5" fill="currentColor" />
      <circle cx="22" cy="10" r="1.5" fill="currentColor" />
      <circle cx="6" cy="17" r="1.5" fill="currentColor" />
      <circle cx="18" cy="17" r="1.5" fill="currentColor" />
      <circle cx="12" cy="5" r="2" fill="currentColor" className="animate-pulse" />
    </svg>
  );
};

export default Logo;
