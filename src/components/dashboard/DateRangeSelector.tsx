import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TimeRange = '1m' | '6m' | '1y';

interface DateRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  className?: string;
}

export function DateRangeSelector({ selectedRange, onRangeChange, className }: DateRangeSelectorProps) {
  const ranges: { label: string; value: TimeRange }[] = [
    { label: '1M', value: '1m' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
  ];

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={selectedRange === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => onRangeChange(range.value)}
          className={cn(
            "px-3 py-1 text-sm font-medium transition-colors",
            selectedRange === range.value 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
}
