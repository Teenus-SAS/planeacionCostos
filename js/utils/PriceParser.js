class PriceParser {
  constructor(price, strPrice) {
    this.price = price;
    this.strPrice = strPrice;
  }

  static toString(price, sign = false, digits = 2) {
    if (!price) {
      price = 0;
    }
    return new PriceParser(price, this.#priceToString(price, digits, sign));
  }

  static fromString(strPrice, sign = false, digits = 2) {
    const price = PriceParser.#stringToPrice(strPrice);
    const str = PriceParser.#priceToString(price, digits, sign);
    return new PriceParser(price, str);
  }

  static #priceToString(price, digits, sign = false) {
    return this.#formatCurrency(price, digits, sign);
  }

  static #stringToPrice(strPrice) {
    return parseFloat(this.#unformatCurrency(strPrice));
  }

  static #formatCurrency(number, fractionDigits, sign = false) {
    let formatted = `$ ${$.number(number, fractionDigits, ".", ",")}`;
    if (!sign) {
      formatted = formatted.replaceAll("$", "").trim();
    }
    return formatted;
  }

  static #unformatCurrency(strCurrency) {
    return parseFloat(strCurrency.replaceAll("$", "").replaceAll(",", ""));
  }
}
