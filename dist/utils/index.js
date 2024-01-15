"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveIdentifier = exports.getPathLastName = exports.getByPath = exports.urlPathSplit = void 0;
const log_1 = require("../log");
const ReservedWords = require("reserved-words");
const pinyin = require("tiny-pinyin");
function urlPathSplit(urlPath, splitter = /[\/.]+/) {
    return urlPath.split(splitter).filter(v => v.length > 0);
}
exports.urlPathSplit = urlPathSplit;
function getByPath(obj, paths) {
    let item = obj;
    for (const key of paths) {
        if (Object.hasOwn(item, key)) {
            item = item[key];
        }
        else {
            return undefined;
        }
    }
    return item;
}
exports.getByPath = getByPath;
function getPathLastName(urlPath) {
    return urlPathSplit(urlPath).pop();
}
exports.getPathLastName = getPathLastName;
const resolveRegex = [/\{([^\{\}]*)\}/g, /\[([^\[\]]*)\]/g, /<(\w+)>(.+)<\/\1>/g, /<([^<>]*)>/g,];
const resolveIdentifier = (typeName) => {
    const typeLastName = resolveRegex.reduce((str, reg) => {
        str.replace(reg, function () {
            const match = arguments[arguments.length - 3];
            return match[0].toUpperCase() + match.slice(1);
        });
        return str;
    }, getPathLastName(typeName));
    let name = typeLastName
        .replace(/[-_ ](\w)/g, (_all, letter) => letter.toUpperCase())
        .replace(/[^\w^\s^\u4e00-\u9fa5]/gi, '');
    if (ReservedWords.check(name)) {
        name = `__OPENAPI_TO_SERVICE_${name}__`;
    }
    if (name === '_' || /^\d+$/.test(name)) {
        (0, log_1.default)('⚠️  models不能以number开头，原因可能是Model定义名称为中文, 建议联系后台修改');
        return `__OPENAPI_TO_SERVICE_${name}`;
    }
    if (!/[\u3220-\uFA29]/.test(name) && !/^\d$/.test(name)) {
        return name;
    }
    const noBlankName = name.replace(/ +/g, '');
    return pinyin.convertToPinyin(noBlankName, '', true);
};
exports.resolveIdentifier = resolveIdentifier;
