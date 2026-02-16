"use client";

import { useId } from "react";

export type PaginationProps = {
  currentPage: number;
  totalPages: number | null;
  totalCount?: number;
  pageSize: number;
  pageSizeOptions: readonly number[];
  hasPrev: boolean;
  hasNext: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageSizeChange?: (size: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  pageSizeOptions,
  hasPrev,
  hasNext,
  onPrevPage,
  onNextPage,
  onPageSizeChange,
}: PaginationProps) {
  const selectId = useId();
  const from = totalCount != null ? (currentPage - 1) * pageSize + 1 : null;
  const to =
    totalCount != null ? Math.min(currentPage * pageSize, totalCount) : null;

  const showNav =
    hasPrev || hasNext || onPageSizeChange != null || totalPages != null;
  if (!showNav) return null;

  return (
    <nav
      className="mt-4 flex flex-col gap-4 border-t border-gray-200 pt-4 sm:gap-3 md:flex-row md:items-center md:justify-between"
      aria-label="Paginación"
    >
      {/* Izquierda: selector y rango */}
      <div className="flex flex-wrap items-center gap-3">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor={selectId} className="text-sm text-gray-600">
              Mostrar
            </label>
            <select
              id={selectId}
              value={pageSize}
              onChange={(e) =>
                onPageSizeChange(Number(e.target.value) as number)
              }
              className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              aria-label="Cantidad por página"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}
        {totalCount != null && from != null && to != null && (
          <span className="text-sm text-gray-600" aria-live="polite">
            Mostrando {from}–{to} de {totalCount}
          </span>
        )}
      </div>

      {/* Derecha: contador y botones */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          Página {currentPage}
          {totalPages != null ? ` de ${totalPages}` : ""}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrevPage}
            disabled={!hasPrev}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Página anterior"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={onNextPage}
            disabled={!hasNext}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Página siguiente"
          >
            Siguiente
          </button>
        </div>
      </div>
    </nav>
  );
}
