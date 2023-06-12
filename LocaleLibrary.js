const example1 = {
  stringTokens: [["@number", "$var", "USD"]],
  variables: { var: 123456789.0123 },
  translations: {},
};
const example2 = {
  stringTokens: [["@date", "02/13/2009 23:31:30"]],
  variables: {},
  translations: {},
  locale: "ru-RU",
};
const example3 = {
  stringTokens: [["@list", "Motorcycle", "$item", "#bus"]],
  variables: { item: "Car" },
  translations: {
    "ru-RU": {
      bus: "Bus",
    },
  },
  locale: "ru-RU",
};
const example4 = {
  stringTokens: ["key", " ", "$var", " ", "#tradnslation"],
  variables: { var: 100 },
  translations: { translation: "тест" },
};

const example5 = {
  stringTokens: [["@relativeTime", -5, "hours"]],
  variables: {},
  translations: {},
  locale: "ru-RU",
};
const example6 = {
  stringTokens: [["@plural", "#day", "$tripDays"]],
  variables: { tripDays: 1 },
  translations: {
    "ar-AA": {
      day: {
        zero: " дней",
        one: " день",
        few: " дня",
        many: " дней",
        other: " дней",
      },
    },
  },
  locale: "ar-AA",
};

const example7 = {
  stringTokens: [
    "#price",
    " ",
    ["@plural", "#day", "$tripDays"],
    " - ",
    ["@number", "$tripPrice", "USD"],
  ],
  variables: {
    tripDays: 10,
    tripPrice: 56789.01,
  },
  translations: {
    "ru-RU": {
      price: "Цена",
      day: {
        zero: " дней",
        one: " день",
        few: " дня",
        many: " дней",
        other: " дней",
      },
    },
    "en-US": {
      price: "Price",
      day: {
        zero: " days",
        one: " day",
        few: " days",
        many: " days",
        other: " days",
      },
    },
  },
  locale: "ru-RU",
};
function getl18nText({ stringTokens, variables, translations, locale }) {
  function getTranslation(name) {
    if (locale) {
      if (translations[locale] != undefined) {
        if (translations[locale][name] != undefined) {
          return translations[locale][name];
        }
      }
    } else if (translations[name] != undefined) {
      return translations[name];
    }
    return null;
  }
  const formatingArray = {
    date(timestamp) {
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      }).format(new Date(getValue(timestamp)));
    },
    number(value, currency = null) {
      if (currency != null) {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: getValue(currency),
        }).format(getValue(value));
      } else return new Intl.NumberFormat(locale).format(getValue(value));
    },
    list(...args) {
      let array = [];
      for (let item of args) {
        const result = getValue(item);
        if (result != null) {
          array.push(getValue(result));
        }
      }
      return new Intl.ListFormat(locale, {
        style: "long",
        type: "conjunction",
      }).format(array);
    },
    plural(key, number) {
      const pr = new Intl.PluralRules(locale);
      const rule = pr.select(getValue(number));
      const suffixes = getValue(key);
      const suffix = suffixes[getValue(rule)];
      return `${this.number(getValue(number))}${suffix}`;
    },
    relativeTime(value, unit) {
      return new Intl.RelativeTimeFormat(locale, { style: "long" }).format(
        getValue(value),
        getValue(unit)
      );
    },
  };
  function getValue(token) {
    if (token == undefined) return "";
    if (typeof token === "string" && token.trim() == "") return token;
    if (token[0] == "$") {
      const name = token.slice(1);
      if (variables[name]) return variables[name];
      else return null;
    } else if (token[0] == "#") {
      return getTranslation(token.slice(1));
    }
    if (!isNaN(+token)) {
      return +token;
    }
    return token;
  }

  function analiseStringTokens(stringTokens) {
    res = "";
    for (item of stringTokens) {
      if (Array.isArray(item)) {
        const [funcName, ...args] = item;
        res += formatingArray[funcName.slice(1)](...args);
      } else if (getValue(item) != null) {
        res += getValue(item);
      }
    }
    return res;
  }
  return analiseStringTokens(stringTokens);
}

