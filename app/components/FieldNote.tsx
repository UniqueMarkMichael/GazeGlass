type FieldNoteProps = {
  children: string;
  label?: string;
};

export function FieldNote({ children, label = "Field Note" }: FieldNoteProps) {
  const note = children.replace(/^Field Note:\s*/i, "").trim();

  return (
    <div className="field-note" role="note" aria-label={label}>
      <span>{label}</span>
      <p>{note}</p>
    </div>
  );
}
