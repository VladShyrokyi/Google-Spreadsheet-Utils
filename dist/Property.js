"use strict";
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
