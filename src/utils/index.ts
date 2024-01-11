// 类型声明过滤关键字
import Log from "../log";
import * as ReservedWords from 'reserved-words';
import * as pinyin from "tiny-pinyin";

export function urlPathSplit(urlPath: string, splitter: string | RegExp = /[\/.]+/) {
    return urlPath.split(splitter).filter(v=>v.length>0);
}

export function getPathLastName(urlPath: string) {
    return urlPathSplit(urlPath).pop();
}

const resolveRegex = [/\{([^\{\}]*)\}/g, /\[([^\[\]]*)\]/g, /<(\w+)>(.+)<\/\1>/g, /<([^<>]*)>/g,];
export const resolveIdentifier = (typeName: string) => {
    const typeLastName =
        resolveRegex.reduce((str, reg) => {
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
    // 当model名称是number开头的时候，ts会报错。这种场景一般发生在后端定义的名称是中文
    if (name === '_' || /^\d+$/.test(name)) {
        Log('⚠️  models不能以number开头，原因可能是Model定义名称为中文, 建议联系后台修改');
        return `__OPENAPI_TO_SERVICE_${name}`;
    }
    if (!/[\u3220-\uFA29]/.test(name) && !/^\d$/.test(name)) {
        return name;
    }
    const noBlankName = name.replace(/ +/g, '');
    return pinyin.convertToPinyin(noBlankName, '', true);
};
