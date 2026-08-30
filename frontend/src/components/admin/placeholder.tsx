export default function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy dark:text-white">{title}</h1>
      <p className="mt-2 text-sm text-muted">Module scaffolded — full CRUD arrives in Phases 3–5.</p>
    </div>
  );
}
