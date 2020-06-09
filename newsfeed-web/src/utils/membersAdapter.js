/**
 *
 * @param {Array} list
 * 參數為獲取的通訊錄數組
 * 返回按index_symbol分類後的數據
 */
export default function adapter(list) {
  if (
    Object.prototype.toString.call(list) !== '[object Array]' ||
    list.length === 0
  ) {
    return [];
  }
  let addressList = [...list];
  let addressArr = new Array(27);
  addressList.sort((a, b) => {
    return a.username > b.username ? 1 : -1;
  });
  addressList.forEach((item, i) => {
    let index_symbol;
    let index;
    if (item.index_symbol !== '#') {
      index_symbol = item.index_symbol && item.index_symbol.toLocaleUpperCase();
      if (index_symbol) {
        index = index_symbol.charCodeAt() - 65;
      } else {
        index = 26;
      }
    } else {
      index_symbol = '#';
      index = 26;
    }
    if (!addressArr[index]) {
      addressArr[index] = {
        index_symbol: index_symbol,
        list: [item],
      };
    } else {
      addressArr[index].list.push(item);
    }
  });
  for (var i = 0; i < addressArr.length; i++) {
    if (addressArr[i] === '' || typeof addressArr[i] === 'undefined') {
      addressArr.splice(i, 1);
      i = i - 1;
    }
  }
  return addressArr;
}
