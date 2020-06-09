export function sortGroup(group1, group2) {
  return group1.name > group2.name ? 1 : -1;
}

export function sortGroupByIndexSymbol(group1, group2) {
  if (group1.indexSymbol === group2.indexSymbol) {
    return group1.sortIndex > group2.sortIndex ? 1 : -1;
  }
  return group1.indexSymbol > group2.indexSymbol ? 1 : -1;
}
