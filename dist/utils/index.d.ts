export declare function urlPathSplit(urlPath: string, splitter?: string | RegExp): string[];
export declare function getByPath<T>(obj: Object, paths: string[]): T | undefined;
export declare function getPathLastName(urlPath: string): string;
export declare function toPinyin(name: string): string;
export declare function resolveIdentifier(typeName: string, convertPinyin?: boolean): string;
