export function getHistory() {
  const history = localStorage.getItem('historyList');
  if (!history) {
    return [];
  }
  return JSON.parse(history);
}

export function setHistory(title, type) {
  let history = [{ title, type, key: Date.now() }].concat(getHistory());
  const str = JSON.stringify(history.splice(0, 20));
  localStorage.setItem('historyList', str);
}

export function delHistory(index) {
  let history = getHistory();
  history.splice(index, 1);
  const str = JSON.stringify(history);
  localStorage.setItem('historyList', str);
  return getHistory();
}

export function clearAllSearchHistory() {
  localStorage.setItem('historyList', '');
  return getHistory();
}
