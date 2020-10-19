"use strict";
function onOpen() {
    let SS = SpreadsheetApp.getActiveSpreadsheet();
    let UI = SpreadsheetApp.getUi();
    let MENU = new Menu(UI);
}
function TEST() {
    let Service = ScriptApp.getService();
    let URL = Service.getUrl();
    let isEnable = Service.isEnabled();
    CustomUI.showMessageBox("Service", `URL: ${URL} \r\nEnable: ${isEnable}`);
}
var SERVICE_NAME = "Google Search Console";
var SERVICE_AUTH_URL = "https://accounts.google.com/o/oauth2/auth";
var SERVICE_AUTH_TOKEN_URL = "https://accounts.google.com/o/oauth2/token";
var CLIENT_ID = "661788518396-h62gh4qe5hpmrvf7snk1t14jet25revk.apps.googleusercontent.com";
var CLIENT_SECRET = "IQlDMP0Wos6WE38kCHtt3Pqj";
var SERVICE_SCOPE_REQUESTS = `https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly`;
//method GET give info
//method PUT set info
//method DELETE -- info
//method POST
//method HOST
var CANCEL = () => SpreadsheetApp.getUi().Button.CANCEL;
var OK = () => SpreadsheetApp.getUi().Button.OK;
/**
 * Save property in document
 * @param {string} Key
 * @param {string} Property
 * @customfunction
 */
function SaveProperty(Key, Property) {
    let property = PropertiesService.getDocumentProperties();
    property.setProperty(Key, Property);
    return Key;
}
function GetProperties() {
    let property = PropertiesService.getDocumentProperties();
    let prop = property.getKeys();
    let values = [];
    prop.map((e) => {
        values.push(property.getProperty(e) || ``);
    });
    let text = [prop, values];
    CustomUI.showMessageBox(`Test`, text[0].map((e, i) => `${e}: ${text[1][i]}`).join(` \r\n`));
}
