import { Label } from 'recharts';
import { Fill, Head, Track, Value } from './StMacroBar';

interface MacroBarProps {
  label: string;
  value: number;
  goal: number;
  color: string;
  unit?: string;
}

export function MacroBar({
  label,
  value,
  goal,
  color,
  unit = 'g',
}: MacroBarProps) {
  const ratio = goal > 0 ? Math.min(value / goal, 1) : 0;
  return (
    <div>
      <Head>
        <Label>{label}</Label>
        <Value>
          {Math.round(value)}
          {goal ? ` / ${Math.round(goal)}` : ''} {unit}
        </Value>
      </Head>
      <Track>
        <Fill style={{ width: `${ratio * 100}%`, backgroundColor: color }} />
      </Track>
    </div>
  );
}
