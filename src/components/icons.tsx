import type { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Kohärente Line-Icon-Familie auf 24er-Grid: einheitliche Strichstärke,
 * runde Enden/Ecken, currentColor. Eine Quelle für alle Icons.
 */
function Icon({
  size = 22,
  strokeWidth = 1.8,
  children,
  ...rest
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconToday = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.6V12l3 1.8" />
  </Icon>
);

export const IconPlan = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.6" />
    <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
  </Icon>
);

export const IconHistory = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.2 12a7.8 7.8 0 1 0 2.4-5.6M4 4v3.5h3.5" />
    <path d="M12 8.2v4.1l2.7 1.6" />
  </Icon>
);

export const IconCheck = (p: IconProps) => (
  <Icon strokeWidth={2.1} {...p}>
    <path d="M5 12.5l4.4 4.3L19 7.2" />
  </Icon>
);

export const IconSkip = (p: IconProps) => (
  <Icon strokeWidth={2.1} {...p}>
    <path d="M6 12h12" />
  </Icon>
);

export const IconChevron = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 9.5l6 6 6-6" />
  </Icon>
);

export const IconEdit = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14.5 5.6l3.9 3.9M4 20h4L19 9a2.05 2.05 0 0 0-2.9-2.9L5 17v3Z" />
  </Icon>
);

export const IconPlus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const IconClose = (p: IconProps) => (
  <Icon strokeWidth={2} {...p}>
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </Icon>
);

export const IconNote = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 4.5h12a1.5 1.5 0 0 1 1.5 1.5v8l-4 4.5H6A1.5 1.5 0 0 1 4.5 17V6A1.5 1.5 0 0 1 6 4.5Z" />
    <path d="M8 9h8M8 12.5h5M19.4 13.8h-3a1.4 1.4 0 0 0-1.4 1.4v3.3" />
  </Icon>
);

export const IconRest = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 13.6A7.2 7.2 0 1 1 10.4 5a5.6 5.6 0 0 0 8.6 8.6Z" />
  </Icon>
);

export const IconFlame = ({ size = 22, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...rest}
  >
    <path d="M13.4 2.2c.6 3-1.4 4.4-2.8 6-1.3 1.5-2.4 3.1-2.4 5.2a4.2 4.2 0 0 0 8.4.2c0-1.3-.4-2.2-1-3 1 .3 1.8 1 2.3 2 .6 1.3.7 2.9.1 4.3-1 2.6-3.5 4.3-6.3 4.3-3.5 0-6.4-2.7-6.4-6.2 0-2.6 1.4-4.5 3-6.2 1.8-1.9 4-3.4 5.1-6.4Z" />
  </svg>
);

export const IconSun = (p: IconProps) => (
  <Icon size={20} {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
  </Icon>
);

export const IconMoon = (p: IconProps) => (
  <Icon size={20} {...p}>
    <path d="M20 13.5A8 8 0 0 1 10.5 4 7 7 0 1 0 20 13.5Z" />
  </Icon>
);

export const IconMonitor = (p: IconProps) => (
  <Icon size={20} {...p}>
    <rect x="3" y="4.5" width="18" height="12" rx="2" />
    <path d="M8.5 20h7M12 16.5V20" />
  </Icon>
);

/** Wortbild-Marke (Herz mit Pulslinie) — passt zu app-icon.svg / favicon.svg. */
export const LogoMark = (p: IconProps) => (
  <Icon strokeWidth={1.9} {...p}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M3.4 12H9l.7-1.4 2 4.6 2-7 1.5 3.8h5.4" />
  </Icon>
);
