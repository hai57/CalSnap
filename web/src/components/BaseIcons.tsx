import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  };
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export function UtensilsIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-3 9v6" />
    </svg>
  );
}

export function ScaleIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8.5 14a3.5 3.5 0 0 1 7 0" />
      <path d="M12 14l2-2.4" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M12 3c.9 3 3.8 4.4 3.8 7.8A3.8 3.8 0 0 1 12 14.6a3.8 3.8 0 0 1-3.8-3.8c0-1.4.5-2.3 1.1-3" />
      <path d="M12 21a4.5 4.5 0 0 0 4.5-4.5c0-2-1.3-3.4-2.3-4.4" />
      <path d="M12 21a4.5 4.5 0 0 1-4.5-4.5" />
    </svg>
  );
}

export function ActivityIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M3 12h4l2.5 6 5-12L17 12h4" />
    </svg>
  );
}

// Balanced: a balance scale.
export function BalanceIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M12 4v16" />
      <path d="M8 20h8" />
      <path d="M5 7h14" />
      <path d="M5 7l-2.5 5a2.5 2.5 0 0 0 5 0z" />
      <path d="M19 7l-2.5 5a2.5 2.5 0 0 0 5 0z" />
    </svg>
  );
}

// Low carb: a wheat stalk.
export function WheatIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M12 21V9" />
      <path d="M12 9c0-2.5 1.6-4.5 4-5 .5 2.4-1 4.5-4 5z" />
      <path d="M12 9c0-2.5-1.6-4.5-4-5-.5 2.4 1 4.5 4 5z" />
      <path d="M12 15c0-2 1.4-3.7 3.5-4 .4 2-1 3.7-3.5 4z" />
      <path d="M12 15c0-2-1.4-3.7-3.5-4-.4 2 1 3.7 3.5 4z" />
    </svg>
  );
}

// Low fat: an oil droplet.
export function DropletIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M12 3c3 4 5 6.6 5 9.5a5 5 0 0 1-10 0C7 9.6 9 7 12 3z" />
    </svg>
  );
}

// High protein: a dumbbell.
export function DumbbellIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M3 9v6" />
      <path d="M6.5 7v10" />
      <path d="M17.5 7v10" />
      <path d="M21 9v6" />
      <path d="M6.5 12h11" />
    </svg>
  );
}

// Keto: an avocado.
export function AvocadoIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M12 3c3.6 0 6 3.4 6 8 0 5-3 10-6 10s-6-5-6-10c0-4.6 2.4-8 6-8z" />
      <circle cx="12" cy="14" r="2.5" />
    </svg>
  );
}

// Vegetarian: a leaf.
export function LeafIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M4 20c0-8 6-13 16-13 0 10-5 16-13 16-2 0-3-1-3-3z" />
      <path d="M9 19c2-4.5 5.5-8 10-10" />
    </svg>
  );
}

// Light theme: a sun.
export function SunIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

// Dark theme: a crescent moon.
export function MoonIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// System theme: a monitor.
export function MonitorIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

// Nav: Dashboard / home.
export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

// Nav: Progress / chart.
export function ChartIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M4 4v16h16" />
      <path d="M8 16v-4" />
      <path d="M12 16V8" />
      <path d="M16 16v-6" />
    </svg>
  );
}

// Nav: Profile / user.
export function UserIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

// Nav: Focus / headphones.
export function HeadphonesIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 14a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2z" />
      <path d="M20 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2z" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function RotateCcwIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

// Action: collapse sidebar (chevron pointing left).
export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

// Action: log out.
export function LogOutIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
