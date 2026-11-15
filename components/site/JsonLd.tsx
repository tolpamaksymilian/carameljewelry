/** Dane strukturalne JSON-LD (schema.org) wstawiane do kodu strony. */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // znak „<” zamieniony na \u003c - treść nie może zamknąć znacznika <script>
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\u003c") }}
        />
      ))}
    </>
  );
}
