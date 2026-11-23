import { useState, type ReactNode } from "react";
import { CalendarBlank, Star } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";
import { initials } from "@/state/selectors";
import { formatDate, parseDateOnly, toDateOnly } from "@/utils/format";

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: {
  title: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0 space-y-1">
        {eyebrow && <div className="type-label text-ink-secondary">{eyebrow}</div>}
        <h1 className="type-h1 text-ink-strong">{title}</h1>
        {description && <div className="max-w-2xl type-body text-ink-secondary">{description}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function SectionCard({ title, description, actions, children, className }: { title?: string; description?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border border-line bg-surface p-5 shadow-xs sm:p-6", className)}>
      {(title || actions) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            {title && <h2 className="type-h3 text-ink">{title}</h2>}
            {description && <p className="type-body-sm text-ink-secondary">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

/** Form field wrapper: label, optional hint, and an error announced to screen readers. */
export function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string | null;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="type-label text-ink">
        {label}
        {required && <span className="ml-0.5 text-status-error" aria-hidden>*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="type-caption text-ink-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="type-caption text-status-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function UserAvatar({ name, src, className }: { name: string; src?: string; className?: string }) {
  return (
    <Avatar className={cn("size-9", className)}>
      {src && <AvatarImage src={src} alt="" className="object-cover" />}
      <AvatarFallback className="bg-surface-container type-label-sm text-ink-secondary">{initials(name) || "?"}</AvatarFallback>
    </Avatar>
  );
}

export function RatingStars({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${value} out of 5${count ? ` from ${count} review${count === 1 ? "" : "s"}` : ""}`}>
      <Star size={size} weight="fill" className="text-brand-tertiary" aria-hidden />
      <span className="type-label text-ink">{value.toFixed(1)}</span>
      {count !== undefined && <span className="type-caption text-ink-secondary">({count})</span>}
    </span>
  );
}

export function RatingInput({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div role="radiogroup" aria-labelledby={`${id}-label`} className="flex items-center justify-between gap-4">
      <span id={`${id}-label`} className="type-body-sm text-ink">
        {label}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            onClick={() => onChange(n)}
            className="rounded p-0.5 text-ink-muted hover:text-brand-tertiary focus-visible:outline-2"
          >
            <Star size={22} weight={n <= value ? "fill" : "regular"} className={n <= value ? "text-brand-tertiary" : undefined} aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}

/** Date picker (YYYY-MM-DD in/out) built from shadcn Popover + Calendar. */
export function DatePicker({
  id,
  value,
  onChange,
  minDate,
  placeholder = "Pick a date",
  disabledDates = [],
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  placeholder?: string;
  disabledDates?: string[];
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseDateOnly(value) : undefined;
  const min = minDate ? parseDateOnly(minDate) : undefined;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-invalid={invalid || undefined}
          className={cn("w-full justify-start font-normal", !value && "text-ink-secondary", invalid && "border-status-error")}
        >
          <CalendarBlank aria-hidden />
          {value ? formatDate(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected ?? min}
          onSelect={(d) => {
            if (d) onChange(toDateOnly(d));
            setOpen(false);
          }}
          disabled={(d) => (min ? d < min : false) || disabledDates.includes(toDateOnly(d))}
        />
      </PopoverContent>
    </Popover>
  );
}

export function StatTile({ label, value, hint, to }: { label: string; value: ReactNode; hint?: ReactNode; to?: string }) {
  const body = (
    <>
      <p className="type-label text-ink-secondary">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-ink-strong">{value}</p>
      {hint && <p className="mt-0.5 type-caption text-ink-secondary">{hint}</p>}
    </>
  );
  const cls = "block rounded-xl border border-line bg-surface p-4 shadow-xs";
  return to ? (
    <Link to={to} className={cn(cls, "transition-colors hover:bg-surface-low")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function DefinitionList({ items, className }: { items: { label: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-3 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="type-caption text-ink-secondary">{item.label}</dt>
          <dd className="break-words type-body text-ink">{item.value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function StepProgress({ steps, current }: { steps: string[]; current: number }) {
  return (
    <nav aria-label="Progress">
      <p className="mb-2 type-label text-ink-secondary">
        Step {current + 1} of {steps.length}: <span className="text-ink">{steps[current]}</span>
      </p>
      <ol className="flex gap-1.5">
        {steps.map((step, i) => (
          <li key={step} className="flex-1">
            <span
              className={cn("block h-1.5 rounded-full", i < current ? "bg-brand" : i === current ? "bg-brand-ink" : "bg-surface-container")}
              aria-current={i === current ? "step" : undefined}
            >
              <span className="sr-only">
                {step} {i < current ? "(done)" : i === current ? "(current)" : ""}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
