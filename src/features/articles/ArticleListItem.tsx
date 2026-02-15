"use client";

import Link from "next/link";

export type ArticleListItemProps = {
  id: string;
  title: string;
  createdAt: Date | string;
};

export function ArticleListItem({
  id,
  title,
  createdAt,
}: ArticleListItemProps) {
  return (
    <li>
      <Link
        href={`/articles/${id}`}
        className="block rounded border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300"
      >
        <span className="font-medium">{title}</span>
        <span className="ml-2 text-sm text-gray-500">
          {new Date(createdAt).toLocaleDateString("es")}
        </span>
      </Link>
    </li>
  );
}
