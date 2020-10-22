/**
 *   𝗘𝗡:                     ...
 *   𝗥𝗨:                     ...
 * 
 * @param {String} url
 *   𝗘𝗡:                     ...
 *   𝗥𝗨:                     ...
 * 
 * @return {}
 * 
 * @class
 */
this.URLSearchParams = class URLSearchParams {
  constructor(params) {
    this._values = [];
    this.index = 0;
    
    [
      "_values",
      "index"
    ].map(key => Object.defineProperty(this, key, {
          "configurable": true,
          "enumerable": false,
          "writeable": true
          }));
    
    try {
      if (typeof params === "string") {
        this._values = (params[0] === "?" ? params.slice(1) : params)
        .split("&")
        .map(item => (item => {return {"name": item[0], "value": item[1]}})(item.split("=").map(URLSearchParams.encodeURIComponent)));
      }
      else if (URLSearchParams.isURLSearchParams(params)) {
        return new URLSearchParams(params.toString());
      }
      else if (typeof params === "object") {
        for (const name in params) {
          if (!Array.isArray(params[name]))
            params[name] = [params[name]];
          
          for (const value of params[name])
            this.append(name, value);
        }
      }
      else
        throw new TypeError('!params');
      
    } catch (error) {
      console.error('class URLSearchParams', error.toString());
    }
  }
  
  
  
  static encodeURIComponent(value) {
    return encodeURIComponent(value)
    .replace(/[!'()*]/g, item => "%" + item.charCodeAt(0).toString(16))
    .replace(/%20/g, "+");
  }
  
  
  
  static decodeURIComponent(value) {
    return decodeURIComponent(value.replace(/\+/g, "%20"));
  }
  
  
  
  append(name, value) {
    if(!["string", "number"].includes(typeof name))
      throw new TypeError('!name');
    
    this._values
    .push({
      "name": URLSearchParams.encodeURIComponent(name),
      "value": URLSearchParams.encodeURIComponent(["string", "number"].includes(typeof value) ? value : (!value ? "" : JSON.stringify(value)))
    });
    
    return this;
  }
  
  
  
  delete(name) {
    if(!["string", "number"].includes(typeof name))
      throw new TypeError('!name');
    
    this._values = this._values
    .filter(item => URLSearchParams.decodeURIComponent(item.name) !== name);
    
    return this;
  }
  
  
  
  entries() {
    return this._values
    .map(item => [item.name, item.value].map(URLSearchParams.decodeURIComponent));
  }
  
  
  
  forEach(callback) {
    if(typeof callback !== "function")
      throw new TypeError('!callback');
    
    return this._values
    .map(item => callback.apply(null, [item.value, item.name].map(URLSearchParams.decodeURIComponent)));
  }
  
  
  
  get(name) {
    if(!["string", "number"].includes(typeof name))
      throw new TypeError('!name');
    
    return (item => item ? URLSearchParams.decodeURIComponent(item.value) : null)(this._values
    .find(item => URLSearchParams.decodeURIComponent(item.name) === name));
  }
  
  
  
  getAll(name) {
    if(!["string", "number"].includes(typeof name))
      throw new TypeError('!name');
    
    return this._values
    .filter(item => URLSearchParams.decodeURIComponent(item.name) === name)
    .map(item => URLSearchParams.decodeURIComponent(item.value));
  }
  
  
  
  has(name) {
    if(!["string", "number"].includes(typeof name))
      throw new TypeError('!name');
    
    return (item => item < 0 ? false : true)(this._values
    .findIndex(item => URLSearchParams.decodeURIComponent(item.name) === name));
  }
  
  
  
  keys() {
    return this._values
    .map(item => URLSearchParams.decodeURIComponent(item.name));
  }
  
  
  
  set(name, value) {
    return this
    .delete(name)
    .append(name, value);
  }
  
  
  
  sort() {
    this._values = this._values
    .sort((a, b) => ((a, b) => a > b ? 1 : a === b ? 0 : -1)(URLSearchParams.decodeURIComponent(a.name), URLSearchParams.decodeURIComponent(b.name)));
    
    return this;
  }
  
  
  
  values() {
    return this._values
    .map(item => URLSearchParams.decodeURIComponent(item.value));
  }
  
  
  
  static isURLSearchParams(value) {
    return (value instanceof this);
  }
  
  static is(url) {
    return this.isURLSearchParams.apply(this, Object.values(arguments));
  }
  
  
  
  [Symbol.iterator]() {
    const self = this;
    
    const values = self._values.map(item => item.value);
    const keys = self._values.map(item => item.name);
    
    const iterator = {};
    
    iterator.langth = keys.length;
    
    iterator.hasPrev = (() => self.index-1 in keys);
    
    iterator.prev = function() {
      const result = {};
      
      result.done = !iterator.hasPrev();
      
      result.value = {
        "key": keys[self.index-1],
        "name": keys[self.index-1],
        "value": values[self.index-1]
      };
      
      if(!result.done)
        self.index--;
      
      return result;
    };
    
    iterator.current = function () {
      const result = {};
      
      result.value = {
        "key": keys[self.index],
        "name": keys[self.index],
        "value": values[self.index]
      };
      
      return result;
    };
    
    iterator.hasNext = (() => self.index in keys);
    
    iterator.next = function() {
      const result = {};
      
      result.done = !iterator.hasNext();
      
      result.value = {
        "key": keys[self.index],
        "name": keys[self.index],
        "value": values[self.index]
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
    return this._values
    .map(item => [item.name, item.value].join("="))
    .join("&");
  }
  
  
  
  /**
   *   𝗘𝗡:                     The valueOf() method returns the primitive value of the specified object.
   *   𝗥𝗨:                     Метод valueOf() возвращает примитивное значение указанного объекта.
   * 
   * @return {String}
   * 
   * @function
   */
  valueOf() {
    return this.toString.apply(this);
  }
  
  
  
  /**
   *   𝗘𝗡:                     Called when the object is converted to the corresponding primitive value.
   *   𝗥𝗨:                     Вызывается при преобразовании объекта в соответствующее примитивное значение.
   * 
   * @return {String}
   * 
   * @function
   */
  [Symbol.toPrimitive]() {
    return this.toString.apply(this);
  }
};