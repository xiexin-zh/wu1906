export const isShow = (filterText) => (member) => {
  const { inactive, hidden } = member;
  if (inactive || hidden) {
    return false;
  }
  if (!filterText || typeof filterText !== 'string') {
    return true;
  }

  filterText = filterText.toLowerCase();
  const searchIndexes = member.getSearchIndexes();
  return searchIndexes.some((value) => {
    return value.includes(filterText);
  });
};
