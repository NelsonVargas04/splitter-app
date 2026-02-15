import React from 'react';

// SVG basado en el logo de la imagen adjunta
const UxIcon: React.FC<{ size?: number | string; style?: React.CSSProperties }> = ({ size = 32, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <g filter="url(#shadow)">
      <path
        d="M7 20C7 12.268 13.268 6 21 6C28.732 6 35 12.268 35 20C35 27.732 28.732 34 21 34C13.268 34 7 27.732 7 20Z"
        fill="url(#paint0_linear)"
      />
      <path
        d="M15 20L25 20M20 15L20 25"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
    <defs>
      <linearGradient id="paint0_linear" x1="7" y1="6" x2="35" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7C4DFF" />
        <stop offset="1" stopColor="#5E35B1" />
      </linearGradient>
      <filter id="shadow" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.08" />
      </filter>
    </defs>
  </svg>
);

export default UxIcon;
