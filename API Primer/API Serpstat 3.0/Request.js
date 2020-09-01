/*
* Функционал взаемодействия с ответом. 
* Кэширование
* Сортировка и поиск нужного параметра
*/
class _Request {
    constructor({_key, content}) {
        this._key = _key;
        if (typeof content === 'object') {
            this.content = content;
        } else {
            this.content = JSON.parse(content);
        };
        this.cash = CacheService.getDocumentCache();
        this._request = this.ChangeCache();
    }
    ChangeCache() {
        Logger.log(this.content.status_msg);
        if (this.content.status_msg === 'OK') {
            this.Set();
            return this.content;
        } else {
            return this.Get();
        }
        // try {
        //     if (this.content.status_msg === 'OK') {
        //         this.Set();
        //         return this.content;
        //     } else {
        //         return this.Get();
        //     }
        // } catch(err) {
        //     return this.content;
        // }
    }
    Set() {
        this.cash.put(this._key, JSON.stringify(this.content));
    }
    Get() {
        return JSON.parse(this.cash.get(this._key));
    }
    GiveObjectToPath(pathArray) {
        let _obj = this._request;
        Object.assign(_obj, this._request);
        for (let i = 1; i < pathArray.length; i++) {
            
            Logger.log(` -> URL: ${JSON.stringify(this._key)} Path: ${pathArray[i]}`);
            
            //Massive
            if (Array.isArray(_obj) == true) {
                for (let j = 0; j < _obj.length; j++) {
                    
                    Logger.log(` -> array ${JSON.stringify(_obj)}`);
                    _obj[j] = this.ToPath(_obj[j], pathArray[i]);
                    Logger.log(` <- array ${JSON.stringify(_obj)}`);
                }

            //Object
            } else if (typeof(_obj) === 'object') {

                Logger.log(` -> object ${JSON.stringify(_obj)}`);
                _obj = this.ToPath(_obj, pathArray[i]);
                Logger.log(` <- object ${JSON.stringify(_obj)}`);
            }
            
            Logger.log(` <- URL: ${JSON.stringify(this._key)} Path: ${pathArray[i]}`)
        }
        return _obj;
    }
    ToPath(obj, path) {
        let obj_new;
        Logger.log(`Object: ${JSON.stringify(obj)} Path: ${path}`)
        
        //Проверка елемента на массив
        if (Array.isArray(obj) == true) {
            for (let i = 0; i < obj.length; i++) {
                obj_new[i] = obj[i][path];
            }
        //Проверка елемента на обьект
        } else if (typeof(obj) === 'object') {
            Logger.log(`Param ${obj} = ${JSON.stringify(obj[path])}`);
            obj_new = obj[path];
        //Проверка елемента на значение
        } else {
            obj_new = obj;
        }
        
        return obj_new;
    }
}