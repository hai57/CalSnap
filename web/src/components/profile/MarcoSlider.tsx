import {
  MacroGrams,
  MacroHead,
  MacroName,
  MacroPct,
  MacroRow,
  MacroStats,
  Range,
} from './StMarcoSlider';
export function MacroSlider({
  label,
  color,
  grams,
  pct,
  max,
  onChange,
}: {
  label: string;
  color: string;
  grams: number;
  pct: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const fill = max > 0 ? Math.min(100, Math.max(0, (grams / max) * 100)) : 0;
  return (
    <MacroRow>
      <MacroHead>
        <MacroName $color={color}>{label}</MacroName>
        <MacroStats>
          <MacroGrams>{grams} g</MacroGrams>
          <MacroPct>{pct}%</MacroPct>
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
