import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconProps = { size?: number; color?: string };

function stroke(color: string) {
  return {
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };
}

function Base({
  size = 20,
  children,
}: {
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {children}
    </Svg>
  );
}

export function PlusIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Path d="M12 5v14" {...stroke(color)} />
      <Path d="M5 12h14" {...stroke(color)} />
    </Base>
  );
}

export function HomeIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Path d="m3 10 9-7 9 7" {...stroke(color)} />
      <Path d="M5 10v10h14V10" {...stroke(color)} />
    </Base>
  );
}

export function HeadphonesIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Path d="M4 14a8 8 0 0 1 16 0" {...stroke(color)} />
      <Path d="M4 14v4a2 2 0 0 0 2 2h1v-6H5" {...stroke(color)} />
      <Path d="M20 14v4a2 2 0 0 1-2 2h-1v-6h2" {...stroke(color)} />
    </Base>
  );
}

export function CheckIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Path d="M20 6 9 17l-5-5" {...stroke(color)} />
    </Base>
  );
}

export function ScaleIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Rect x={3} y={3} width={18} height={18} rx={4} {...stroke(color)} />
      <Path d="M8.5 14a3.5 3.5 0 0 1 7 0" {...stroke(color)} />
      <Path d="M12 14l2-2.4" {...stroke(color)} />
    </Base>
  );
}

export function FlameIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Path
        d="M12 3c.9 3 3.8 4.4 3.8 7.8A3.8 3.8 0 0 1 12 14.6a3.8 3.8 0 0 1-3.8-3.8c0-1.4.5-2.3 1.1-3"
        {...stroke(color)}
      />
      <Path
        d="M12 21a4.5 4.5 0 0 0 4.5-4.5c0-2-1.3-3.4-2.3-4.4"
        {...stroke(color)}
      />
      <Path d="M12 21a4.5 4.5 0 0 1-4.5-4.5" {...stroke(color)} />
    </Base>
  );
}

export function ActivityIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Path d="M3 12h4l2.5 6 5-12L17 12h4" {...stroke(color)} />
    </Base>
  );
}

export function BalanceIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Path d="M12 4v16" {...stroke(color)} />
      <Path d="M8 20h8" {...stroke(color)} />
      <Path d="M5 7h14" {...stroke(color)} />
      <Path d="M5 7l-2.5 5a2.5 2.5 0 0 0 5 0z" {...stroke(color)} />
      <Path d="M19 7l-2.5 5a2.5 2.5 0 0 0 5 0z" {...stroke(color)} />
    </Base>
  );
}

export function WheatIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Path d="M12 21V9" {...stroke(color)} />
      <Path d="M12 9c0-2.5 1.6-4.5 4-5 .5 2.4-1 4.5-4 5z" {...stroke(color)} />
      <Path d="M12 9c0-2.5-1.6-4.5-4-5-.5 2.4 1 4.5 4 5z" {...stroke(color)} />
      <Path d="M12 15c0-2 1.4-3.7 3.5-4 .4 2-1 3.7-3.5 4z" {...stroke(color)} />
      <Path d="M12 15c0-2-1.4-3.7-3.5-4-.4 2 1 3.7 3.5 4z" {...stroke(color)} />
    </Base>
  );
}

export function DropletIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Path
        d="M12 3c3 4 5 6.6 5 9.5a5 5 0 0 1-10 0C7 9.6 9 7 12 3z"
        {...stroke(color)}
      />
    </Base>
  );
}

export function DumbbellIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Path d="M3 9v6" {...stroke(color)} />
      <Path d="M6.5 7v10" {...stroke(color)} />
      <Path d="M17.5 7v10" {...stroke(color)} />
      <Path d="M21 9v6" {...stroke(color)} />
      <Path d="M6.5 12h11" {...stroke(color)} />
    </Base>
  );
}

export function AvocadoIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Path
        d="M12 3c3.6 0 6 3.4 6 8 0 5-3 10-6 10s-6-5-6-10c0-4.6 2.4-8 6-8z"
        {...stroke(color)}
      />
      <Circle cx={12} cy={14} r={2.5} {...stroke(color)} />
    </Base>
  );
}

export function LeafIcon({ size, color = '#000' }: IconProps) {
  return (
    <Base size={size}>
      <Path
        d="M4 20c0-8 6-13 16-13 0 10-5 16-13 16-2 0-3-1-3-3z"
        {...stroke(color)}
      />
      <Path d="M9 19c2-4.5 5.5-8 10-10" {...stroke(color)} />
    </Base>
  );
}
