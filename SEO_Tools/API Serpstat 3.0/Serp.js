
/*
* 
* Запрос и ответ.
* 
*/
class Serp {
    constructor({_obj, key, _request}) {
        this._obj = _obj;
        this.key = key | '';
        if (_request === 'undefined' | _request == null) {
        } else {
            this._request = new _Request(_request);
        }
    }
    Write(){
        this.key = '';
        for (let key in this._obj){
            this.key = this.key + this._obj[key];
        }
        return this.key;
    }
    ChangeURL(query) {
        this._obj._query = query;
        return this;
    }
    SendRequest() {
        this.key = this.Write();
        let content = UrlFetchApp.fetch(this.key).getContentText();
        let _key = this.key;
        this._request = new _Request({_key, content});
        return this._request;
    }
    Give(path) {
        try{
            let pathArray = path.split("/");
            let obj = this._request.GiveObjectToPath(pathArray);
            return obj;
        } catch(err) {
            if (this._obj._query == '') {
                return "-";
            }
            return `Please, add a separator "/"`;
        };
    }
}

function NewSerp(target) {
    let parse_ = JSON_target(target);
    let Serp_new = new Serp(parse_);
    return Serp_new;
}

function getDebugStr(obj) {
    let str = ``;
    for (key in obj) {
        str += `${obj[key]}\r\n`;
    }
    return str
}