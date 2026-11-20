import { useMemo, useState } from 'react';

export const ALL_CATEGORIES = 'Toate';

const matchesCategory = (event, category) =>
  category === ALL_CATEGORIES || event.category?.toLowerCase() === category.toLowerCase();

const matchesSearch = (event, term) => {
  const needle = term.trim().toLowerCase();
  if (!needle) return true;
  return [event.title, event.description, event.date].some((field) => field?.toLowerCase().includes(needle));
};

/**
 * Category filter, text search and pagination over a list of events.
 * Changing a filter always returns to the first page.
 */
export const useEventFilters = (events, itemsPerPage) => {
  const [category, setCategoryState] = useState(ALL_CATEGORIES);
  const [search, setSearchState] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => events.filter((event) => matchesCategory(event, category) && matchesSearch(event, search)),
    [events, category, search]
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const pageItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page, itemsPerPage]);

  const setCategory = (next) => {
    setCategoryState(next);
    setPage(1);
  };

  const setSearch = (next) => {
    setSearchState(next);
    setPage(1);
  };

  const reset = () => {
    setCategoryState(ALL_CATEGORIES);
    setSearchState('');
    setPage(1);
  };

  const goToPage = (next) => {
    if (next >= 1 && next <= totalPages) setPage(next);
  };

  return { category, search, page, totalPages, filtered, pageItems, setCategory, setSearch, reset, goToPage };
};
