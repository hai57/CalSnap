import { colors } from '@src/styles/theme';
import { Center, Consumed, Goal, Remaining, Svg, Wrap } from './StMacroRing';

interface MacroRingProps {
  consumed: number;
  goal: number;
  label?: string;
}

export function MacroRing({ consumed, goal, label = 'kcal' }: MacroRingProps) {
  const radius = 70;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const ratio = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const offset = circumference * (1 - ratio);
  const remaining = Math.max(goal - consumed, 0);
  const over = consumed > goal && goal > 0;

  return (
    <Wrap>
      <Svg width="180" height="180" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={colors.track}
          strokeWidth={stroke}
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={over ? '#ef4444' : '#10b981'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </Svg>
      <Center>
        <Consumed>{Math.round(consumed)}</Consumed>
        <Goal>
          / {Math.round(goal)} {label}
        </Goal>
        <Remaining $over={over}>
          {over
            ? `${Math.round(consumed - goal)} over`
            : `${Math.round(remaining)} left`}
        </Remaining>
      </Center>
    </Wrap>
  );
}
