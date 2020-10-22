/**
 *   𝗘𝗡:                     Information about the script.
 *   𝗥𝗨:                     Сведения о скритпе.
 * 
 * @return {Object}
 * 
 * @class
 */
class ScriptInfo {
  constructor() {
    const _ = LocalizationApp.create();
    _.setDefaultLanguage("ru");
    
    // en: Script id.
    // ru: Идентификатор скрипта.
    this.libraryId =
      this.scriptId =
        this.id = ScriptApp.getScriptId();
    
    // en: The program name of the project.
    // ru: Программное имя проекта.
    this.symbol =
      this.namespace = "...";
    
    // en: Version.
    // ru: Версия.
    this.version = '1.0';
    
    // en: The runtime version the script is using.
    // ru: Версия среды выполнения скрипта.
    this.runtimeVersion = "V8";
    
    // en: Project name.
    // ru: Название проекта.
    _.setTranslation("name", '...', "ru");
    this.title =
      this.name = _.getTranslation("name");
    
    // en: Project description.
    // ru: Описание проекта.
    _.setTranslation("description", '...', "ru");
    this.description = _.getTranslation("description");
    
    // en: Sharing link.
    // ru: Ссылка общего доступа.
    this.share = "https://script.google.com/d/"+this.id+"/edit?usp=sharing";
    
    // en: Homepage.
    // ru: Домашняя страница.
    this.homepage = "https://stomaks.me/";
    
    // en: Storepage.
    // ru: Страница в магазине.
    this.storepage = "https://script.google.com/macros/library/d/"+this.id;
    
    // en: Support URL.
    // ru: URL поддержки.
    this.supportURL = "https://stomaks.me?feedback";
    
    // en: User who originally created the script.
    // ru: Пользователь, который изначально создал скрипт.
    this.creator = {
      "name": 'Maxim Stoyanov',
      "nickname": 'stomaks',
      "email": 'stomaks+work@gmail.com',
      "homepage": "https://stomaks.me/",
      "blog": "https://G-Apps-Script.COM/"
    };
    
    // en: About the author.
    // ru: Об авторе.
    this.author = this.creator;
    
    // en: Developer.
    // ru: Разработчик.
    this.developer = this.author;
    
    // en: Copyright.
    // ru: Авторское право.
    this.copyright = '2020, Maxim Stoyanov (stomaks.me)';
    
    // en: License.
    // ru: Лицензия.
    this.license = "MIT";
    
    // en: Dependencies.
    // ru: Зависимости.
    this.dependencies = {
      "libraries": [
        LocalizationApp.getLibraryInfo()
      ]
    };
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
    return "[object ScriptInfo]";
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
    return "[object ScriptInfo]";
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
    return "[object ScriptInfo]";
  }
}



/**
 *   𝗘𝗡:                     Returns script information.
 *   𝗥𝗨:                     Возвращает сведения о скрипте.
 * 
 * @return {Object}
 * 
 * @function
 */
this.getLibraryInfo =
  this.getScriptInfo =
    this.getInfo = () => new ScriptInfo();