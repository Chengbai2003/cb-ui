/**
 * 
 * @param prefixName 前缀
 * @param blockSuffix 代码块
 * @param element 元素
 * @param modifier 修饰
 */
function _bem(prefixName:string,blockSuffix:string,element:string,modifier:string) {
    if(blockSuffix){
        prefixName += `-${blockSuffix}`
    }
    if(element){
        prefixName += `__${element}`
    }
    if(modifier) {
        prefixName += `--${modifier}`
    }
    return prefixName
}

function createBEM(prefixName:string) {
    const b = (blockSuffix: string = '') => _bem(prefixName, blockSuffix, '', '')
    const e = (element:string = '') => element ? _bem(prefixName, '', element, '') : "";
    const m = (modifier:string = '') => modifier ? _bem(prefixName, '', '', modifier) : "";
    const be = (blockSuffix: string = '',element:string = '') =>
        blockSuffix && element ? _bem(prefixName, blockSuffix, element, '') : "";
    const bm = (blockSuffix: string = '',modifier:string = '') =>
        blockSuffix && modifier ? _bem(prefixName, blockSuffix, '', modifier) : "";
    const em = (element:string = '', modifier:string = '') =>
        element && modifier ? _bem(prefixName,'',element,modifier) : "";
    const bem = (blockSuffix:string = '',element:string = '',modifier:string = '') =>
        blockSuffix && element && prefixName ? _bem(prefixName,blockSuffix,element,modifier) : "";

    const is = (name:string, state:string | boolean) => (state ? `is-${name}` : '')
    return {
        b,
        e,
        m,
        be,
        bm,
        em,
        bem,
        is
    }
}

export function createNamespace(name:string) {
    const prefixName = `c-${name}`;
    return createBEM(prefixName);
}


