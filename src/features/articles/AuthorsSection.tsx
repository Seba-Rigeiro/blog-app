export type AuthorWithCount = {
  authorId: string;
  authorName: string;
  articleCount: number;
};

type AuthorsSectionProps = {
  authors: AuthorWithCount[];
};

export function AuthorsSection({ authors }: AuthorsSectionProps) {
  if (!authors.length) return null;

  const sorted = [...authors].sort((a, b) =>
    a.authorName.localeCompare(b.authorName, "es"),
  );

  return (
    <section>
      <h2 className="text-lg font-semibold">Autores</h2>
      <ul className="mt-2 flex flex-wrap gap-3">
        {sorted.map((a) => (
          <li
            key={a.authorId}
            className="rounded border border-gray-200 bg-white px-3 py-2 shadow-sm"
          >
            <span className="font-medium">{a.authorName}</span>
            <span className="ml-2 text-gray-500">
              {a.articleCount} {a.articleCount === 1 ? "artículo" : "artículos"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
