const module = {};
function load(apiClientObject, cart) {
  let getCurrencyCode, getRemains, getPrices, getDeliveryCost, convertCurrency;
  const apiClient = Object.getOwnPropertyNames(
    Object.getPrototypeOf(apiClientObject)
  );
  for (const key in apiClient) {
    if (apiClient[key] == "constructor") continue;
    if (apiClientObject[apiClient[key]].length === 3) {
      convertCurrency = apiClient[key];
    }
    if (
      apiClientObject[apiClient[key]].length === 0 &&
      typeof apiClientObject[apiClient[key]]() === "string"
    ) {
      getCurrencyCode = apiClient[key];
    } else if (apiClientObject[apiClient[key]].length === 1) {
      try {
        if (
          typeof apiClientObject[apiClient[key]](cart.orderDate) == "object"
        ) {
          const objectsList = apiClientObject[apiClient[key]](cart.orderDate);
          for (let i = 0; i < objectsList.length; i++) {
            for (let j = 0; j < objectsList.length; j++) {
              if (
                objectsList[i].articleId == objectsList[j].articleId &&
                i != j
              ) {
                getRemains = apiClient[key];
                break;
              }
            }
            if (typeof getRemains != "undefined") break;
          }
          if (getRemains != apiClientObject[apiClient[key]]) {
            getPrices = apiClient[key];
            continue;
          }
        } else if (
          typeof apiClientObject[apiClient[key]](cart.cityId) == "number"
        ) {
          getDeliveryCost = apiClient[key];
          continue;
        }
      } catch (e) {
        getDeliveryCost = apiClient[key];
        continue;
      }
    }
  }
  orderRemain = apiClientObject[getRemains](cart.orderDate);
  prices = apiClientObject[getPrices](cart.orderDate);
  console.log(orderRemain);
  console.log(prices);
  function findDataProperty(item) {
    for (property in item) {
      if (typeof item[property] === "string" && item[property].includes("-"))
        return property;
    }
    return null;
  }
  function searchItemPrice(list, cartItem, orderDate) {
    for (let item of list) {
      if (
        item.articleId == cartItem.articleId &&
        findDataProperty(item) != null &&
        item[findDataProperty(item)] == orderDate
      )
        return item;
    }
  }
  function searchRests(rests, cartItem, orderDate) {
    let rest = 0;
    for (const record of rests) {
      if (
        record.articleId === cartItem.articleId &&
        record[findDataProperty(record)] === orderDate
      ) {
        rest += record[findIntProperty(record)];
      }
    }
    return rest;
  }
  function findIntProperty(object) {
    for (let property in object)
      if (typeof object[property] === "number" && property != "articleId")
        return property;
  }
  function costOfItem(cartItem, orderRemain, prices, orderDate) {
    const priceInfo = searchItemPrice(prices, cartItem, orderDate);
    if (typeof priceInfo === "undefined") return 0;
    let itemPrice = priceInfo[findIntProperty(priceInfo)];
    console.log(1, itemPrice);
    let hasCurrency = 0;
    for (let property in priceInfo) {
      if (
        priceInfo[property].length == 3 &&
        cart.currency != priceInfo[property]
      ) {
        itemPrice = apiClientObject[convertCurrency](
          priceInfo[property],
          cart.currency,
          itemPrice
        );
        hasCurrency = 1;
        break;
      }
      if (
        priceInfo[property].length == 3 &&
        cart.currency == priceInfo[property]
      ) {
        hasCurrency = 1;
        break;
      }
    }
    if (!hasCurrency) {
      itemPrice = apiClientObject[convertCurrency](
        apiClientObject[getCurrencyCode](),
        cart.currency,
        itemPrice
      );
      console.log(11, priceInfo);
    }
    if (itemPrice == undefined) console.log(cartItem);
    let itemQuantity = Math.min(
      cartItem.quantity,
      searchRests(orderRemain, cartItem, orderDate)
    );
    return itemQuantity * itemPrice;
  }
  let sum = 0;
  for (let item of cart.items) {
    sum += costOfItem(item, orderRemain, prices, cart.orderDate);
  }
  const deliveryCost =
    apiClientObject[getCurrencyCode]() != cart.currency
      ? apiClientObject[convertCurrency](
          apiClientObject[getCurrencyCode](),
          cart.currency,
          apiClientObject[getDeliveryCost](cart.cityId)
        )
      : apiClientObject[getDeliveryCost](cart.cityId);
  sum += deliveryCost;
  return sum;
}
console.log(load(apiClientObject, cart));
