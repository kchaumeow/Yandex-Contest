const module = {};
class APIClient {
  a() {
    return "euro";
  }
  c(date) {
    return [
      {
        articleId: 1,
        quantity: 5,
        date: "2023-03-01",
        lotNumber: "L1/1",
      },
      {
        articleId: 1,
        quantity: 3,
        date: "2023-03-01",
        lotNumber: "L1/2",
      },
      {
        articleId: 2,
        quantity: 10,
        date: "2023-03-01",
        lotNumber: "L2/1",
      },
    ];
  }
  b(date) {
    return [
      {
        articleId: 1,
        price: 100,
        date: "2023-03-01",
      },
      {
        articleId: 2,
        price: 200,
        date: "2023-03-01",
      },
      {
        articleId: 3,
        price: 5,
        date: "2023-03-01",
        currency: "USD",
      },
    ];
  }
  d(cityId) {
    switch (cityId) {
      case 1:
        return 100;
      case 2:
        return 200;
      case 3:
        return 300;
      default:
        return 500;
    }
  }
  e(from, to, sum) {
    if (from === "USD" && to === "EUR") {
      return sum * 0.1;
    }
    if (from === "EUR" && to === "USD") {
      return sum * 10;
    }
  }
  f() {
    return 1;
  }
}
const apiClientObject = new APIClient();

let cart = {
  userId: 1,
  orderDate: "2023-03-01",
  items: [
    {
      articleId: 1,
      quantity: 1,
    },
    {
      articleId: 2,
      quantity: 7,
    },
    {
      articleId: 5,
      quantity: 2,
    },
  ],
  cityId: 1,
  currency: "EUR",
};
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
