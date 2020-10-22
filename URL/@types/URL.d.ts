declare namespace CustomURL {
  declare interface URL {
    // en: Contains the entire URL.
    // ru: Содержит URL целиком.
    getHref(): URL;
    setHref(value: string): URL;

    // en: Contains the protocol of the current URL, including ':'.
    // ru: Содержит протокол текущего URL, включая ':'.
    getProtocol(): string;
    setProtocol(): URL;

    getUserName(): string;
    getPassword(): string;

    // en: Contains the host, namely the host name, ':' and port.
    // ru: Содержит хост, а именно имя хоста, ':' и порт.
    getHost(): string;
    setHost(value): URL;

    // en: Contains the domain of the current URL.
    // ru: Содержит домен текущего URL.
    getHostName(): string;
    setHostName(value): URL;

    // en: Contains the port number of the current URL.
    // ru: Содержит номер порта текущего URL.
    getPort(): string;
    setPort(value): URL;

    // en: Contains the first '/' after the host followed by the URL text.
    // ru: Содержит первый '/' после хоста с последующим текстом URL.
    getPathName(): string;
    setPathName(value): URL;

    // en: Contains '?' with the following URL parameters.
    // ru: Содержит '?' с последующими параметрами URL.
    getSearch(): string[];
    setSearch(value): URL;

    getSearchParams(): string;
    setSearchParams(value): URL;

    // en: Contains '#' followed by identifier.
    // ru: Содержит '#' с последующим идентификатором.
    getHash(): string;
    setHash(value): URL;

    // en: Contains the protocol, host, and port of the current URL.
    // ru: Содержит протокол, хост и порт текущего URL.
    getOrigin(): string;
    setOrigin(value): URL;

    /**
     * 𝗘𝗡: Checks if the string is url.
     * 𝗥𝗨: Проверяет является ли строка url.
     * @param {String} url
     * 𝗘𝗡: URL.
     * 𝗥𝗨: URL.
     * @return {Boolean}
     * 𝗘𝗡: true - if the string is url or false - if the string is not url.
     * 𝗥𝗨: true - если строка является url или false - если строка не является url.
     * @function
     */
    isUrl(url): Boolean;

    readonly length(): number;

    hasPrev();
    prev();
    current();
    hasNext();
    next();
    rewind();

    /**
     * 𝗘𝗡: The toString() method returns a string representing the object.
     * 𝗥𝗨: Метод toString() возвращает строку, представляющую объект.
     * @return {String}
     * @function
     */
    toString(): string;

    /**
     * 𝗘𝗡: The valueOf() method returns the primitive value of the specified object.
     * 𝗥𝗨: Метод valueOf() возвращает примитивное значение указанного объекта.
     * @return {String}
     * 𝗘𝗡: href.
     * 𝗥𝗨: href.
     * @function
     */
    valueOf(): string;

    /**
     * 𝗘𝗡: Called when the object is converted to the corresponding primitive value.
     * 𝗥𝗨: Вызывается при преобразовании объекта в соответствующее примитивное значение.
     * @return {String}
     * 𝗘𝗡: href.
     * 𝗥𝗨: href.
     * @function
     */
    [Symbol.toPrimitive](): string;
  }
}

declare namespace URLSearchParams {
  /**
   * 𝗘𝗡: ...
   * 𝗥𝗨: ...
   * @param {String} url
   * 𝗘𝗡: ...
   * 𝗥𝗨: ...
   * @return {}
   * @class
   */
  interface URLSearchParams {
    /**
     * 𝗘𝗡: The toString() method returns a string representing the object.
     * 𝗥𝗨: Метод toString() возвращает строку, представляющую объект.
     * @return {String}
     * @function
     */
    toString(): string;

    /**
     * 𝗘𝗡: The valueOf() method returns the primitive value of the specified object.
     * 𝗥𝗨: Метод valueOf() возвращает примитивное значение указанного объекта.
     * @return {String}
     * @function
     */
    valueOf(): string;

    /**
     * 𝗘𝗡: Called when the object is converted to the corresponding primitive value.
     * 𝗥𝗨: Вызывается при преобразовании объекта в соответствующее примитивное значение.
     * @return {String}
     * @function
     */
    [Symbol.toPrimitive](): string;
  }
}
