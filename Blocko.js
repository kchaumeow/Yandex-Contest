module.exports = function layout(blocks) {
  class Block {
    constructor(blockId, position, isRotated) {
      this.blockId = blockId;
      this.position = position;
      this.isRotated = isRotated;
    }
  }

  function rotate(block) {
    block.form.reverse();
    block.isRotated = !block.isRotated;
    for (let el of block.form) {
      el.reverse();
    }
    return block;
  }

  function checkCompatibility(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr1[i].length; j++) {
        if (arr1[i][j] + arr2[i][j] !== 1) {
          return false;
        }
      }
    }
    return true;
  }

  function findStringsWithZerosTop(arr) {
    let countOfStrings = 0;
    if (arr[0].includes(0)) {
      countOfStrings += 1;
      while (arr[countOfStrings].includes(0)) {
        countOfStrings += 1;
      }
    }
    return countOfStrings;
  }

  function findStringsWithZerosBottom(arr) {
    let countOfStrings = 0;
    if (arr[arr.length - 1].includes(0)) {
      countOfStrings += 1;
      while (arr[arr.length - countOfStrings - 1].includes(0)) {
        countOfStrings += 1;
      }
    }
    return countOfStrings;
  }
  function help() {
    for (let block of blocks) {
      block.isRotated = false;
    }
  }
  function findRootBlock() {
    for (let i = 0; i < blocks.length; i++) {
      if (!blocks[i].form[blocks[i].form.length - 1].includes(0)) {
        return blocks.splice(i, 1)[0];
      } else if (!blocks[i].form[0].includes(0)) {
        rotate(blocks[i]);
        return blocks.splice(i, 1)[0];
      }
    }
  }

  function deepfs(prev) {
    if (!blocks.length) return;
    let temp = blocks.shift();

    const countOfStrings = findStringsWithZerosTop(prev.form);
    const currentStringsBottom = findStringsWithZerosBottom(temp.form);
    const currentStringsTop = findStringsWithZerosTop(temp.form);

    if (
      countOfStrings === currentStringsBottom &&
      checkCompatibility(
        prev.form.slice(0, countOfStrings),
        temp.form.slice(-currentStringsBottom)
      )
    ) {
      result.push(new Block(temp.id, pos++, temp.isRotated));
      deepfs(temp);
    } else if (
      countOfStrings === currentStringsTop &&
      checkCompatibility(
        prev.form.slice(0, countOfStrings),
        rotate(temp).form.slice(-currentStringsTop)
      )
    ) {
      result.push(new Block(temp.id, pos++, temp.isRotated));
      deepfs(temp);
    } else {
      blocks.push(temp);
      deepfs(prev);
    }
  }

  let pos = 1;
  let result = [];
  function solve() {
    if (!blocks.length) return;
    help();
    const root = findRootBlock();
    result.push(new Block(root.id, pos++, root.isRotated));
    deepfs(root);
  }

  solve();
  return result;
};





module.exports = function (apiClientObject, cart){
  const apiClient = Object.getOwnPropertyNames(
    Object.getPrototypeOf(apiClientObject)
  );
  for (const key in apiClient) {
    if (
      apiClientObject[apiClient[key]].length === 0 &&
      apiClient[key] != "constructor" &&
      typeof apiClientObject[apiClient[key]]() === "string"
    ) {
      getCurrencyCode = apiClientObject[apiClient[key]];
    } else if (
      apiClientObject[apiClient[key]].length === 1 &&
      key != "constructor"
    ) {
      if (typeof apiClientObject[apiClient[key]]() == "object") {
        const objectsList = apiClientObject[apiClient[key]]();
        for (let i = 0; i < objectsList.length; i++) {
          for (let j = 0; j < objectsList.length; j++) {
            if (
              objectsList[i].articleId == objectsList[j].articleId &&
              i != j
            ) {
              getRemains = apiClientObject[apiClient[key]];
              break;
            }
          }
          if (typeof getRemains != "undefined") break;
        }
        if (getRemains != apiClientObject[apiClient[key]]) {
          getPrices = apiClientObject[apiClient[key]];
        }
      } else if (typeof apiClientObject[apiClient[key]](1) == "number") {
        getDeliveryCost = apiClientObject[apiClient[key]];
      }
    } else if (
      apiClientObject[apiClient[key]].length === 3 &&
      key != "constructor"
    ) {
      convertCurrency = apiClientObject[apiClient[key]];
    }
  }
  orderRemain = getRemains(cart.orderDate);
  prices = getPrices(cart.orderDate);
  console.log(orderRemain);
  console.log(prices);
  function searchItem(list, id) {
    for (let item of list) if (item.articleId == id) return item;
  }
  function findIntProperty(object) {
    for (let property in object)
      if (typeof object[property] === "number" && property != "articleId")
        return property;
  }
  function costOfItem(cartItem, orderRemain, prices) {
    const orderInfo = searchItem(orderRemain, cartItem.articleId);
    const priceInfo = searchItem(prices, cartItem.articleId);
    if (typeof priceInfo === "undefined") return 0;
    let itemPrice = priceInfo[findIntProperty(priceInfo)];
    let i = 1;
    for (let property in priceInfo) {
      if (i == 4 && cart.currency != priceInfo[property]) {
        itemPrice = convertCurrency(
          priceInfo[property],
          cart.currency,
          itemPrice
        );
        break;
      }
      i++;
    }
    let itemQuantity = Math.min(
      cartItem.quantity,
      orderInfo[findIntProperty(orderInfo)]
    );
    return itemQuantity * itemPrice;
  }
  let sum = 0;
  for (let item of cart.items) {
    sum += costOfItem(item, orderRemain, prices);
  }
  sum += getDeliveryCost(cart.cityId);
  return sum;
}
