"use client";

import Link from "next/link";

export type ArticleListItemProps = {
  id: string;
  title: string;
  createdAt: Date | string;
  author?: string;
};

export function ArticleListItem({
  id,
  title,
  createdAt,
  author,
}: ArticleListItemProps) {
  return (
    <li>
      <Link
        href={`/articles/${id}`}
        className="flex flex-col gap-1 rounded border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <span className="font-medium">
          {title}
          {author != null && author !== "" && (
            <span className="ml-1 font-normal text-gray-500">({author})</span>
          )}
        </span>
        <span className="shrink-0 text-right text-sm text-gray-500 sm:text-right">
          <span className="block text-xs text-gray-400">Fecha publicación</span>
          {new Date(createdAt).toLocaleDateString("es")}
        </span>
      </Link>
    </li>
  );
}
