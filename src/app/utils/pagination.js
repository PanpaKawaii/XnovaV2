/**
 * Generates a smart pagination array with ellipsis
 * @param {number} currentPage - Current active page (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {number} maxVisible - Maximum number of page buttons to show (default: 7)
 * @returns {Array} Array of page numbers and ellipsis ('...')
 * 
 * Examples:
 * - Total 5 pages: [1, 2, 3, 4, 5]
 * - Total 10 pages, current 1: [1, 2, 3, '...', 10]
 * - Total 10 pages, current 5: [1, '...', 4, 5, 6, '...', 10]
 * - Total 10 pages, current 10: [1, '...', 8, 9, 10]
 */
export const generatePagination = (currentPage, totalPages, maxVisible = 7) => {
  if (totalPages <= maxVisible) {
    // If total pages is less than max visible, show all pages
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const halfVisible = Math.floor((maxVisible - 3) / 2); // Reserve 3 spots for first, last, and ellipsis

  // Always show first page
  pages.push(1);

  if (currentPage <= halfVisible + 2) {
    // Near the beginning
    for (let i = 2; i <= Math.min(maxVisible - 2, totalPages - 1); i++) {
      pages.push(i);
    }
    if (totalPages > maxVisible - 1) {
      pages.push('...');
    }
  } else if (currentPage >= totalPages - halfVisible - 1) {
    // Near the end
    pages.push('...');
    for (let i = totalPages - (maxVisible - 3); i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    // In the middle
    pages.push('...');
    for (let i = currentPage - halfVisible; i <= currentPage + halfVisible; i++) {
      pages.push(i);
    }
    pages.push('...');
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};
