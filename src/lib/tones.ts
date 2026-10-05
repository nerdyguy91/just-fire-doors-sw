/**
 * Status vocabulary used by the job-sheet style records (prototype status colours).
 *   closed  #1F6B4D   green: complete / repair
 *   onsite  #8A6100   amber: underway / replace
 *   decide  #A33A2A   red:   decide / investigate
 *   neutral #5B646B   grey:  planned / other
 */
export type Tone = 'closed' | 'onsite' | 'decide' | 'neutral';

/** CSS custom property for a tone, for inline `--tone` values. */
export const toneVar = (tone: Tone) =>
  ({
    closed: 'var(--jfd-status-closed)',
    onsite: 'var(--jfd-status-onsite)',
    decide: 'var(--jfd-status-decide)',
    neutral: 'var(--jfd-status-neutral)',
  })[tone];

/** File-type badge colour used by the illustrative document lists. */
export function fileTone(ext: string): string {
  const e = ext.toUpperCase();
  if (e === 'PDF') return 'var(--jfd-status-decide)';
  if (['XLS', 'XLSX', 'CSV'].includes(e)) return 'var(--jfd-status-closed)';
  if (['JPG', 'JPEG', 'PNG', 'HEIC'].includes(e)) return 'var(--jfd-action)';
  return 'var(--jfd-status-neutral)';
}
