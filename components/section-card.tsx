export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="squircle p-5">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
