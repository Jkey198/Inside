interface ScaleInputProps {
  label: string;
  min: number;
  max: number;
  value: number | null;
  onChange: (value: number) => void;
  minHint: string;
  maxHint: string;
}

export function ScaleInput({
  label,
  min,
  max,
  value,
  onChange,
  minHint,
  maxHint,
}: ScaleInputProps) {
  const values = Array.from({ length: max - min + 1 }, (_, index) => min + index);

  return (
    <fieldset>
      <legend className="mb-2 font-medium text-slate-800">{label}</legend>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
        {values.map((option) => {
          const isSelected = option === value;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option)}
              className={`size-10 rounded-lg border text-sm font-medium transition-colors ${
                isSelected
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-slate-500">
        <span>{minHint}</span>
        <span>{maxHint}</span>
      </div>
    </fieldset>
  );
}
