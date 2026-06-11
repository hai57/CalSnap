import {
  MacroHead,
  MacroName,
  MacroRow,
  MacroStats,
  Range,
} from './StMarcoSlider';
export function MacroSlider({
  label,
  color,
  grams,
  pct,
  kcal,
  max,
  onChange,
}: {
  label: string;
  color: string;
  grams: number;
  pct: number;
  kcal: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const fill = max > 0 ? Math.min(100, Math.max(0, (grams / max) * 100)) : 0;
  return (
    <MacroRow>
      <MacroHead>
        <MacroName $color={color}>{label}</MacroName>
        <MacroStats>
          {pct}% · {grams} g · {Math.round(kcal)} kcal
        </MacroStats>
      </MacroHead>
      <Range
        $color={color}
        $fill={fill}
        type="range"
        min={0}
        max={max}
        step={5}
        value={grams}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </MacroRow>
  );
}
