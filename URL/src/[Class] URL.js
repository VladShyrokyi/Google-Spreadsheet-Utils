/**
 *   𝗘𝗡:                     The constructor of URL returns a newly created URL object reflecting the URL specified by the parameters.
 *   𝗥𝗨:                     Конструктор URL возвращает вновь созданный URL объект отражающий URL определяемый параметрами.
 * 
 * @param {String} url
 *   𝗘𝗡:                     Url.
 *   𝗥𝗨:                     Url.
 * 
 * @return {URL}
 * 
 * @class
 */
this.URL = class URL {
  constructor(url, base) {
    this._href = null;
    this._protocol = null;
    this._username = null;
    this._password = null;
    this._host = null;
    this._hostname = null;
    this._port = 443;
    this._pathname = null;
    this._search = null;
    this._searchParams = null;
    this._hash = null;
    this._origin = null;
    this.index = 0;
    
    [
      "_href",
      "_protocol",
      "_username",
      "_password",
      "_host",
      "_hostname",
      "_port",
      "_pathname",
      "_search",
      "_searchParams",
      "_hash",
      "_origin",
      "index"
    ].map(key => Object.defineProperty(this, key, {
          "configurable": true,
          "enumerable": false,
          "writeable": true
          }));
    
    try {
      if (base) {
        base = (item => URL.isUrl(item) ? decodeURI(item) : null)(base instanceof URL ? base.valueOf() : base);
        
        if (!base)
          throw new TypeError('!base');
        
        base = new URL(base);
        
        url = (item => URL.isUrl(item) ? decodeURI(item) : null)(url instanceof URL ? url.valueOf() : url);
        
        if (url) {
          url = new URL(url);
          
          [
            "protocol",
            "username",
            "password",
            "hostname",
            "port",
            "pathname",
            "search",
            "hash"
          ].forEach(key => url["_"+key] ? base[key] = url["_"+key] : null);
        }
        else if (typeof arguments[0] === "string") {
          if(URL.RegExp.hash.test(arguments[0])) {
            base.hash = URL.RegExp.hash.exec(arguments[0])[1];
          }
          else if (URL.RegExp.search.test(arguments[0])) {
            base.search = URL.RegExp.search.exec(arguments[0])[1];
          }
          else {
            base.pathname = URL.RegExp.pathname.exec(arguments[0][0] === "/" ? arguments[0] : "/"+arguments[0])[1];
          }
        }
        
        for(const {key, value} of base)
          this["_"+key] = value;
      } else {
        url = (item => URL.isUrl(item) ? decodeURI(item) : null)(url instanceof URL ? url.valueOf() : url);
        
        if (!url)
          throw new TypeError('!url');
        
        const result = URL.RegExp.href.exec(url); 
        
        this._href = (result[0] || null);
        
        this._protocol = (result[3] || null);
        
        this._hostname = (result[5] || null);
        
        this._port = (item => item > 0 ? item : 443)(result[12]);
        
        this._host = (result[4] || null);
        
        this._pathname = (result[13] || null);
        
        this._search = (result[15] || null);
        
        this._searchParams = (this._search ? new URLSearchParams(this._search) : null);
        
        this._hash = (result[16] || null);
        
        this._origin = this._host ? (this._protocol ? this._protocol+":" : "")+"//"+this._host : null;
      }
    } catch (error) {
      console.error('class URL', error.toString());
    }
  }
  
  
  
  // en: Contains the entire URL.
  // ru: Содержит URL целиком.
  get href() {
    return (this._href || "");
  }
  
  getHref() {
    return this.href;
  }
  
  set href(value) {
    try {
      const result = new URL(value);
      
      this._href = (result._href || this._href);
      
      this._protocol = (result._protocol || this._protocol);
      
      this._host = (result._host || this._host);
      
      this._hostname = (result._hostname || this._hostname);
      
      this._port = (result._port || this._port);
      
      this._pathname = (result._pathname || this._pathname);
      
      this._search = (result._search || this._search);
      
      this._hash = (result._hash || this._hash);
      
      this._origin = (result._origin || this._origin);
    } catch (error) {
      console.error('class URL.href', error.toString());
    }
    
    return this;
  }
  
  setHref(value) {
    this.href = value;
    
    return this;
  }
  
  
  
  // en: Contains the protocol of the current URL, including ':'.
  // ru: Содержит протокол текущего URL, включая ':'.
  get protocol() {
    return (this._protocol || "");
  }
  
  getProtocol() {
    return this.protocol;
  }
  
  set protocol(value) {
    try {
      this._protocol = typeof value === "string" || URL.isUrl(value) ? URL.RegExp.protocol.exec(value)[1] || new URL(value).protocol : null;
      
      for(const {key, value} of new URL(this.valueOf()))
        this["_"+key] = value;
    } catch (error) {
      console.error('class URL.protocol', error.toString());
    }
    
    return this;
  }
  
  setProtocol(value) {
    this.protocol = value;
    
    return this;
  }
  
  
  
  get username() {
    return (this._username || "");
  }
  
  getUserName() {
    return this.username;
  }
  
  
  
  get password() {
    return (this._password || "");
  }
  
  getPassword() {
    return this.password;
  }
  
  
  
  // en: Contains the host, namely the host name, ':' and port.
  // ru: Содержит хост, а именно имя хоста, ':' и порт.
  get host() {
    return (this._host || "");
  }
  
  getHost() {
    return this.host;
  }
  
  set host(value) {
    try {
      const result = new URL(value);
      
      this._hostname = result._hostname;
      
      this._port = result._port;
      
      for(const {key, value} of new URL(this.valueOf()))
        this["_"+key] = value;
    } catch (error) {
      console.error('class URL.host', error.toString());
    }
    
    return this;
  }
  
  setHost(value) {
    this.host = value;
    
    return this;
  }
  
  
  
  
  // en: Contains the domain of the current URL.
  // ru: Содержит домен текущего URL.
  get hostname() {
    return (this._hostname || "");
  }
  
  getHostName() {
    return this.hostname;
  }
  
  set hostname(value) {
    try {
      const result = new URL(value);
      
      this._hostname = result._hostname;
      
      for(const {key, value} of new URL(this.valueOf()))
        this["_"+key] = value;
    } catch (error) {
      console.error('class URL.hostname', error.toString());
    }
    
    return this;
  }
  
  setHostName(value) {
    this.hostname = value;
    
    return this;
  }
  
  
  
  // en: Contains the port number of the current URL.
  // ru: Содержит номер порта текущего URL.
  get port() {
    return (this._port || "");
  }
  
  getPort() {
    return this.port;
  }
  
  set port(value) {
    try {
      this._port = typeof value === "string" || URL.isUrl(value) ? URL.RegExp.port.exec(value)[1] || new URL(value).port : value > 0 ? value : 443;
      
      for(const {key, value} of new URL(this.valueOf()))
        this["_"+key] = value;
    } catch (error) {
      console.error('class URL.port', error.toString());
    }
    
    return this;
  }
  
  setPort(value) {
    this.port = value;
    
    return this;
  }
  
  
  
  // en: Contains the first '/' after the host followed by the URL text.
  // ru: Содержит первый '/' после хоста с последующим текстом URL.
  get pathname() {
    return (this._pathname || "");
  }
  
  getPathName() {
    return this.pathname;
  }
  
  set pathname(value) {
    try {
      this._pathname = typeof value === "string" || URL.isUrl(value) ? URL.RegExp.pathname.exec(value[0] === "/" ? value : "/"+value)[1] || new URL(value).pathname : null;
      
      for(const {key, value} of new URL(this.valueOf()))
        this["_"+key] = value;
    } catch (error) {
      console.error('class URL.pathname', error.toString());
    }
    
    return this;
  }
  
  setPathName(value) {
    this.pathname = value;
    
    return this;
  }
  
  
  
  // en: Contains '?' with the following URL parameters.
  // ru: Содержит '?' с последующими параметрами URL.
  get search() {
    return (this._search || "");
  }
  
  getSearch() {
    return this.search;
  }
  
  set search(value) {
    try {
      this._search = (typeof value === "string" || URL.isUrl(value) ? (URL.RegExp.search.exec(value[0] === "?" ? value : "?"+value)[1] || new URL(value).search) : null);
      
      this._searchParams = new URLSearchParams(this._search);
      
      for(const {key, value} of new URL(this.valueOf()))
        this["_"+key] = value;
    } catch (error) {
      console.error('class URL.search', error.toString());
    }
    
    return this;
  }
  
  setSearch(value) {
    this.search = value;
    
    return this;
  }
  
  
  
  get searchParams() {
    return (this._searchParams || "");
  }
  
  getSearchParams() {
    return this.searchParams;
  }
  
  set searchParams(value) {
    try {
      this._searchParams = new URLSearchParams(value);
      
      this._search = "?"+this._searchParams.toString();
      
      for(const {key, value} of new URL(this.valueOf()))
        this["_"+key] = value;
    } catch (error) {
      console.error('class URL.searchParams', error.toString());
    }
    
    return this;
  }
  
  setSearchParams(value) {
    this.searchParams = value;
    
    return this;
  }
  
  
  
  // en: Contains '#' followed by identifier.
  // ru: Содержит '#' с последующим идентификатором.
  get hash() {
    return (this._hash || "");
  }
  
  getHash() {
    return this.hash;
  }
  
  set hash(value) {
    try {
      this._hash = typeof value === "string" || URL.isUrl(value) ? URL.RegExp.hash.exec(value[0] === "#" ? value : "#"+value)[1] || new URL(value).hash : null;
      
      for(const {key, value} of new URL(this.valueOf()))
        this["_"+key] = value;
    } catch (error) {
      console.error('class URL.hash', error.toString());
    }
    
    return this;
  }
  
  setHash(value) {
    this.hash = value;
    
    return this;
  }
  
  
  
  // en: Contains the protocol, host, and port of the current URL.
  // ru: Содержит протокол, хост и порт текущего URL.
  get origin() {
    return (this._origin || "");
  }
  
  getOrigin() {
    return this.origin;
  }
  
  set origin(value) {
    try {
      const result = new URL(value);
      
      this._protocol = result._protocol;
      
      this._hostname = result._hostname;
      
      this._port = result._port;
      
      for(const {key, value} of new URL(this.valueOf()))
        this["_"+key] = value;
    } catch (error) {
      console.error('class URL.origin', error.toString());
    }
    
    return this;
  }
  
  setOrigin(value) {
    this.origin = value;
    
    return this;
  }
  
  
  
  static get RegExp() {
    const $ = {};
    $.protocol = "(https?|ftp)";
    $.pathname = "((\\/[^\/]*?)*?)?";
    $.search = "(\\?.*?)?";
    $.hash = "(#[^#]*?)?";
    $.href = (
      // en: Protocol
      // ru: Протокол
      "(("+$.protocol+":)?\\/\\/)?" +
      
      // en: Domain name OR IP (v4) address
      // ru: Доменное имя ИЛИ IP (v4) адрес
      "(((([a-zа-яё0-9]([a-zа-яё0-9-_]*[a-zа-яё0-9])*)\\.)+[a-zа-яё]{2,}|(([0-9]{1,3}\\.){3}[0-9]{1,3}))" +
      
      // en: Port
      // ru: Порт
      "(:([0-9]+))?)" +
      
      // en: Way
      // ru: Путь
      $.pathname +
      
      // en: Query string
      // ru: Строка запроса
      $.search +
      
      // en: Anchor
      // ru: Якорь
      $.hash
    );
    
    return Object.fromEntries(
      Object.keys($).map(key => [key, new RegExp("^"+$[key]+"$", "i")])
    );
  }
  
  
  
  /**
   *   𝗘𝗡:                     Checks if the string is url.
   *   𝗥𝗨:                     Проверяет является ли строка url.
   * 
   * @param {String} url
   *   𝗘𝗡:                     URL.
   *   𝗥𝗨:                     URL.
   * 
   * @return {Boolean}
   *   𝗘𝗡:                     true - if the string is url or false - if the string is not url.
   *   𝗥𝗨:                     true - если строка является url или false - если строка не является url.
   * 
   * @function
   */
  static isUrl(url) {
    if (url instanceof this)
      return true;
    
    if (typeof url !== "string")
      return false;
    
    return URL.RegExp.href.test(url);
  }
  
  static is(url) {
    return this.isUrl.apply(this, Object.values(arguments));
  }
  
  
  
  [Symbol.iterator]() {
    const self = this;
    
    const values = self;
    const keys = Object.getOwnPropertyNames(values).filter(item => item[0] === "_").map(item => item.slice(1)).sort();
    
    const iterator = {};
    
    iterator.langth = keys.length;
    
    iterator.hasPrev = (() => self.index-1 in keys);
    
    iterator.prev = function() {
      const result = {};
      
      result.done = !iterator.hasPrev();
      
      result.value = {
        "key": keys[self.index-1],
        "value": values[keys[self.index-1]]
      };
      
      if(!result.done)
        self.index--;
      
      return result;
    };
    
    iterator.current = function () {
      const result = {};
      
      result.value = {
        "key": keys[self.index],
        "value": values[keys[self.index]]
      };
      
      return result;
    };
    
    iterator.hasNext = (() => self.index in keys);
    
    iterator.next = function() {
      const result = {};
      
      result.done = !iterator.hasNext();
      
      result.value = {
        "key": keys[self.index],
        "value": values[keys[self.index]]
      };
      
      if(!result.done)
        self.index++;
      
      return result;
    };
    
    iterator.rewind = (() => self.index = 0);
    
    return iterator;
  }
  
  
  
  get length() {
    return this[Symbol.iterator]().langth;
  }
  
  
  
  hasPrev() {
    return this[Symbol.iterator]().hasPrev();
  }
  
  
  
  prev() {
    return this[Symbol.iterator]().prev().value;
  }
  
  
  
  current() {
    return this[Symbol.iterator]().current().value;
  }
  
  
  
  hasNext() {
    return this[Symbol.iterator]().hasNext();
  }
  
  
  
  next() {
    return this[Symbol.iterator]().next().value;
  }
  
  
  
  rewind() {
    return this[Symbol.iterator]().rewind();
  }
  
  
  
  /**
   *   𝗘𝗡:                     The toString() method returns a string representing the object.
   *   𝗥𝗨:                     Метод toString() возвращает строку, представляющую объект.
   * 
   * @return {String}
   * 
   * @function
   */
  toString() {
    return "[object URL]";
  }
  
  
  
  /**
   *   𝗘𝗡:                     The valueOf() method returns the primitive value of the specified object.
   *   𝗥𝗨:                     Метод valueOf() возвращает примитивное значение указанного объекта.
   * 
   * @return {String}
   *   𝗘𝗡:                     href.
   *   𝗥𝗨:                     href.
   * 
   * @function
   */
  valueOf() {
    return (
      (this._protocol ? this._protocol+":" : "")+
      "//"+
      (this._hostname || "")+
      (this._port > 0 && this._port !== 443 ? ":"+this._port : "")+
      (this._pathname || "")+
      (this._search || "")+
      (this._hash || "")
     );
  }
  
  
  
  /**
   *   𝗘𝗡:                     Called when the object is converted to the corresponding primitive value.
   *   𝗥𝗨:                     Вызывается при преобразовании объекта в соответствующее примитивное значение.
   * 
   * @return {String}
   *   𝗘𝗡:                     href.
   *   𝗥𝗨:                     href.
   * 
   * @function
   */
  [Symbol.toPrimitive]() {
    return this.valueOf.apply(this);
  }
};