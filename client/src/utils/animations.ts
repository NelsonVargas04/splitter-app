import { keyframes } from '@mui/material/styles';

// Fade in desde abajo
export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Fade in simple
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Scale in (para modales y elementos que aparecen)
export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Pulse suave (para elementos destacados)
export const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Shake (para errores)
export const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-4px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(4px);
  }
`;

// Slide in desde la derecha
export const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Slide in desde la izquierda
export const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Bounce suave
export const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Glow pulsante (para QR scanner)
export const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(124, 77, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(124, 77, 255, 0.6);
  }
`;

// Scan line (para QR)
export const scanLine = keyframes`
  0% {
    top: 0;
  }
  50% {
    top: calc(100% - 4px);
  }
  100% {
    top: 0;
  }
`;

// Stagger delay helper
export const getStaggerDelay = (index: number, baseDelay = 0.05) => 
  `${index * baseDelay}s`;

// Animación de check/success
export const checkmark = keyframes`
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

// Ripple effect
export const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;
