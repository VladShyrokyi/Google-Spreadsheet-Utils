var CANCEL = () => { SpreadsheetApp.getUi().Button.CANCEL; }
var OK = () => { SpreadsheetApp.getUi().Button.OK; }

var SERVICE_NAME = 'searchconsole';
var SERVICE_AUTH_URL = 'https://accounts.google.com/o/oauth2/auth';
var SERVICE_AUTH_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token';
var CLIENT_ID = '661788518396-h62gh4qe5hpmrvf7snk1t14jet25revk.apps.googleusercontent.com';
var CLIENT_SECRET = 'IQlDMP0Wos6WE38kCHtt3Pqj';
var SERVICE_SCOPE_REQUESTS = `https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly`;

//method GET give info
//method PUT set info
//method DELETE -- info
//method POST 
//method HOST

//SITES
var SERVICE_Sites = 'https://www.googleapis.com/webmasters/v3/sites';
function SERVICE_Site(siteUrl) {
    return `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}`;
}

//SITEMAP
function SERVICE_Sitemap(siteUrl, feedpath) {
    return `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${feedpath}`
}
function SERVICE_Sitemaps(siteUrl) {
    return `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps`
}