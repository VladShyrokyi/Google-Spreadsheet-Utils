interface IUrl {
	[index: string]: string;
}
/**
 * Create template query to API
 * @param Query Keyword or domain
 * @param Token Token from API
 * @param ReportType Type
 * @param Base
 * @param SearchRegion
 * @param Params Example: "&key=value"
 * @customfunction
 */
function CreateQueryAPI(
	Query: string,
	Token: string,
	ReportType: string,
	Base: string,
	SearchRegion: string,
	Params?: Array<string>
): string {
	let URL: IUrl = { Base, ReportType, Query, Token, SearchRegion };
	for (let key in URL) {
		let component: string = URL[key];
		if (typeof component == `string`) {
			if (component == Base) {
				URL[key] = encodeURI(component);
			} else {
				URL[key] = encodeURIComponent(component);
			}
		}
	}
	let _URL = URL.Base;
	_URL += `${URL.ReportType}`;
	_URL += `?query=${URL.Query}`;
	_URL += `&token=${Token}`;
	_URL += `&se=${SearchRegion}`;
	if (typeof Params == `object` && Params != null) {
		for (let i = 0; i < Params.length; i++) {
			_URL += `&${Params[i]}=${Params[i + 1]}`;
			i++;
		}
	}
	return _URL;
}
/**
 * Create URL from template
 * @param URL Cells URL with "?query="
 * @param Query new value for "?query=value"
 * @customfunction
 */
function CreateUrlFromTemplate(URL: string, Query: string) {
	if (Query == null || Query == `` || Query == `undefined`) {
		return `No Query`;
	}
	let _Query = encodeURIComponent(Query);
	let q = `?query=`;
	let t = `&token=`;
	let start: number = URL.indexOf(q);
	let stop: number = URL.indexOf(t);
	if (start != -1) {
		let query = URL.slice(start + q.length, stop);
		let _URL = URL.replace(query, _Query);
		return _URL;
	}
	return `No Query`;
}
/**
 * Get Data from url. Add it to the cache.
 * @param URL Cells or string with URL
 * @customfunction
 */
function FetchToAPI(URL: string): string {
	if (URL == null || URL == `undefined` || URL == `` || URL == `No Query`) {
		return URL;
	}
	let cache = CacheService.getDocumentCache();
	let Key = URL.slice(0, 249);
	if (cache?.get(Key) != null || cache?.get(Key) != undefined || cache?.get(Key) != ``) {
		let content = UrlFetchApp.fetch(URL).getContentText();
		cache?.remove(Key);
		cache?.put(Key, content);
	}	else if (cache == null) {
		return `Not cache`;
	}
	return Key;
}
/**
 * Outputting data along a path from the cache.
 * Options: CountMax - maximum rows to output
 * @param Key Cache key entry
 * @param Path String Path/to data/or params
 * @param Options Example: {"HideParam", "CountMax = 10", "JSON"}
 * @customfunction
 */
function GiveFromCache(Key: string, Path: string, ...Options: string[]) {
	let cache = CacheService.getDocumentCache();
	if (cache == null) {
		return `No cache`;
	}
	let content = cache.get(Key);
	if (content == null) {
		return `-`;
	}
	let data: element = JSON.parse(content);
	let _Options: OptionsValid = {};
	if (Options != null) {
		_Options = new OptionsValid(...Options);
	}
	if (Path != null) {
		let PathArr = Path.split(`/`);
		for (let i = 0; i < PathArr.length; i++) {
			data = ValidateElement(data, PathArr[i]);
		}
	} else {
		return `No Path`;
	}
	return CreateOutput(data, _Options);
}
type element = elementArray | elementObj | string;
interface elementObj {
	[key: string]: element;
}
interface elementArray extends Array<element> {
	[index: number]: element;
}
function ValidateElement(e: element, Path: string): element {
	if (Array.isArray(e)) {
		let arr: elementArray = [];
		for (let i = 0; i < e.length; i++) {
			let _e = e[i];
			let result = ValidateElement(_e, Path);
			arr.push(result);
		}
		return arr;
	} else if (typeof e == `object`) {
		return ValidateObject(e, Path);
	} else {
		return e;
	}
}
function ValidateObject(e: elementObj, Path: string): element {
	for (let property in e) {
		if (property == Path) {
			return e[property];
		}
	}
	return `Element empty`;
}
function CreateOutput(data: element, Options: OptionsValid) {
	if (typeof data == `string`) {
		return data.toString();
	} else if (typeof data == `number`) {
		return parseInt(data);
	} else if (Array.isArray(data)) {
		let DoubleArr: Array<string[] | string> = [];
		for (let y = 0; y < data.length; y++) {
			let Value: element = data[y];
			if (typeof Value == "string" || typeof Value == `number`) {
				DoubleArr[y] = Value;
			} else if (Array.isArray(Value)) {
				let Arr: string[] = [];
				for (let x = 0; x < Value.length; x++) {
					let element = Value[x];
					if (typeof element == `object`) {
						Arr[x] = JSON.stringify(element);
					} else {
						Arr[x] = element;
					}
				}
				DoubleArr.push(Arr);
			} else {
				let Arr: string[] = [];
				for (let x in Value) {
					Arr.push(JSON.stringify(Value[x]));
				}
				DoubleArr.push(Arr);
			}
			if (
				Options != null &&
				Options[`isCountMax`] == true &&
				Options[`CountMax`] == y
			) {
				break;
			}
		}
		return DoubleArr;
	} else {
		return JSON.stringify(data);
	}
}
interface IOptions {
	[key: string]: Boolean | number;
}
class OptionsValid implements IOptions {
	[key: string]: number | Boolean;
	constructor(...Options: string[]) {
		Options.find((e: string | string[]) => {
			if (typeof e == `string` && e.includes(` = `)) e = e.split(` = `);
			this[`is${e[0]}`] = true;
			this[e[0]] = parseInt(e[1]) - 1;
		}, this);
	}
}
