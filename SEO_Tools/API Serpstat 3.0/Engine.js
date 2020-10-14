/**
* Создает шаблон запроса в API
* @param query
* @param token
* @param report
* @param main
* @param se
* @customfunction
*/
function SerpCreate(query, token, report = "domain_info", main = "http://api.serpstat.com/v3/", se = "g_ua", param) {
    let _obj = {
        _main: main,
        _report: report,
        _q: "?query=",
        _query: query,
        _t: "&token=",
        _token: token,
        _s: "&se=",
        _search: se
    };
    if (param !== 'undefined' & typeof(param) == 'object') {
        let _param = '';
        for (key in param) {
            _param += param[key];
        }
        _obj._param = _param;
    }
    let _Serp = new Serp({_obj});
    return JSON_target(_Serp, 1);
}
/**
* Берет строковое представление объекта Serp 
* На основе него создает новый объект Serp 
* И меняет в нем запрс на новый
* Отправляет запрос
* @param target Шаблон Serp
* @param query Новый запрос
* @customfunction
*/
function SerpChangeAndRequest(target, query) {
    let _target = NewSerp(target);
    let Serp_new = _target.ChangeURL(query);
    Serp_new.SendRequest();
    let string = JSON_target(Serp_new, 1);
    if (string.length <= 50000) {
        return string;
    } else {
        let string_arr = [
            [JSON_target(Serp_new._obj, 1)],
            [JSON_target(Serp_new.key, 1)],
            [JSON_target(Serp_new._request,1)]
        ];
        return string_arr;
    }
}

/**
* Выводит данные по пути из ячейки с JSON таблицей
* @param target Ячейка с JSON
* @param query Строка начинается с /Путь/к данным/или параметрам
* @customfunction
*/
function SerpPath(target, Path) {
    let _target = NewSerp(target);
    let result = _target.Give(Path);
    if (typeof(result) === 'number') {
        return result;
    } else if (typeof(result) === 'string') {
        if (result.length <= 50000) {
            return result;
        }
    } else if (Array.isArray(result) == true) {
        return result;
    }
    return JSON_target(result, 1);
}

function ArrayUnto(target = Array, param) {
    if (Array.isArray(target) == true & param !== 'undefined' & typeof(param) === 'number') {
        target.length = param;
        return target;
    }
    return `Not Array`;
}

// Превращяет объект в строку или наоборот парсит
// 0 - Объект; 1 - строка
function JSON_target(target, param = 0) {
    try {
        //Строка
        if (param == 1) {
            return JSON.stringify(target);
        }
        //Объект
        return JSON.parse(target);
    } catch(err) {
        return `Error type: ${target} param ${param == 1|0}`
    }
}