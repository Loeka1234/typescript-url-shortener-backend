export interface ISchema {
    [key: string]: "string" | "boolean" | "number" | "object" | "undefined";
}

interface Obj {
    [key: string]: any
}

export const checkTypes = (obj: Obj, schema: ISchema): IError | undefined => {
    for (const key of Object.keys(schema)) {
        if(!obj.hasOwnProperty(key)) return {
            field: key,
            message: `Missing field ${key}.`,
            typeError: true
        }
        if(typeof obj[key] !== schema[key]) return {
            field: key,
            message: `${key} has to be a ${schema[key]}`,
            typeError: true
        }

    }
}