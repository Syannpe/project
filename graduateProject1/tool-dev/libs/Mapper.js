//和Mapper为依赖关系
/**
 * MapperObserveKey 类，用于观察和处理键列表。
 */
class MapperObserveKey extends Object {
    // 存储键的列表
    keylist = [];
    /**
     * 添加一个键到键列表中。
     * @param key 任意类型的键
     * @returns 当前的 MapperObserveKey 实例
     */
    addKey(key) {
        this.keylist.push(key);
        return this;
    }
    /**
     * 清空键列表。
     * @returns 当前的 MapperObserveKey 实例
     */
    clearKeyList() {
        this.keylist.length = 0;
        return this;
    }
    /**
     * 根据键列表从对象中获取值。
     * @param obj 目标对象
     * @returns 获取的值
     */
    getValue(obj) {
        let value = obj;
        this.keylist.forEach(key => {
            value = value[key];
        });
        return value;
    }
}
/**
 * MapperEvent 类，用于事件映射。
 */
class MapperEvent extends Object {
    key;
    target;
    customData;
    /**
     * 构造函数
     * @param key 事件的键
     * @param target 目标 Mapper 对象
     * @param customData 自定义数据
     */
    constructor(key, target, customData) {
        super();
        this.key = key;
        this.target = target;
        this.customData = customData;
    }
}
/**
 * Mapper 类，用于键值映射和事件处理。
 */
class Mapper extends Object {
    target;
    options;
    #map = new Map();
    #symbolDefault = Symbol("default");
    #symbolFinally = Symbol("finally");
    /**
     * 添加一个键和回调函数的映射。
     * @param key 任意类型的键
     * @param callback 回调函数
     * @returns 当前的 Mapper 实例
     */
    map(key, callback) {
        if (!this.#map.get(key)) {
            this.#map.set(key, [callback]);
        }
        else {
            this.#map.get(key).push(callback);
        }
        return this;
    }
    /**
     * 设置默认的回调函数。
     * @param callback 可调用的回调函数
     * @returns 当前的 Mapper 实例
     */
    default(callback) {
        if (!this.#map.get(this.#symbolDefault)) {
            this.#map.set(this.#symbolDefault, [callback]);
        }
        else {
            //@ts-ignore:
            this.#map.get(this.#symbolDefault).push(callback);
        }
        return this;
    }
    /**
     * 设置最终执行的回调函数。
     * @param callback 可调用的回调函数
     * @returns 当前的 Mapper 实例
     */
    finally(callback) {
        if (!this.#map.get(this.#symbolFinally)) {
            this.#map.set(this.#symbolFinally, [callback]);
        }
        else {
            //@ts-ignore:
            this.#map.get(this.#symbolFinally).push(callback);
        }
        return this;
    }
    /**
     * 调用映射的回调函数。
     * @param params 任意参数数组
     */
    call(...params) {
        let target;
        if (typeof this.target === "object" && this.options.observeKey) {
            target = this.options.observeKey.getValue(this.target);
        }
        else {
            target = this.target;
        }
        let callbacks = this.#map.get(target);
        if (!callbacks)
            callbacks = this.#map.get(this.#symbolDefault);
        if (!callbacks)
            return;
        let finallyCBs = this.#map.get(this.#symbolFinally);
        let mapperEvent = new MapperEvent(target, this, params);
        callbacks?.forEach((cb) => {
            cb(mapperEvent);
        });
        finallyCBs?.forEach((cb) => {
            cb(mapperEvent);
        });
    }
    /**
     * 异步调用映射的回调函数。
     * @param params 任意参数数组
     */
    async callSync(...params) {
        let target;
        if (typeof this.target === "object" && this.options.observeKey) {
            target = this.options.observeKey.getValue(this.target);
        }
        else {
            target = this.target;
        }
        let callbacks = this.#map.get(target);
        if (!callbacks)
            callbacks = this.#map.get(this.#symbolDefault);
        if (!callbacks)
            return;
        let finallyCBs = this.#map.get(this.#symbolFinally);
        const mapperEvent = new MapperEvent(target, this, params);
        if (callbacks) {
            for (const cb of callbacks) {
                await cb(mapperEvent);
            }
        }
        if (!finallyCBs)
            return;
        for (const cb of finallyCBs) {
            await cb(mapperEvent);
        }
    }
    /**
     * 构造函数
     * @param target 目标对象
     * @param options Mapper 配置选项
     */
    constructor(target, options = null) {
        super();
        this.target = target;
        this.options = options;
    }
}
/*
    @Mapping(obj, value)
    @Mapping(obj, value)
 */
// 内部 Map 对象，用于存储对象与 Mapper 实例的映射关系
const innerMap = new Map();
/**
 * Mapping 装饰器，用于将方法映射到指定对象的键上。
 * @param id 映射id
 * @param value 映射值
 * @returns 一个装饰器函数，该函数会将目标方法映射到对象的键上
 */
function Mapping(id, value = null) {
    return function (target, propertyKey, descriptor) {
        let mapper;
        // 检查 innerMap 中是否已经有该对象的映射
        if (innerMap.has(id)) {
            // 如果有，获取现有的 Mapper 实例
            mapper = innerMap.get(id);
        }
        else {
            // 如果没有，创建一个新的 Mapper 实例并存储在 innerMap 中
            mapper = new Mapper(id);
            innerMap.set(id, mapper);
        }
        let cb = target instanceof Function ? target : target[propertyKey].bind(target);
        if (value) {
            // 将目标方法映射到指定的键上
            mapper.map(value, cb);
        }
        else {
            mapper.default(cb);
        }
        return descriptor;
    };
}
/**
 * RequestMapping 函数，用于触发指定对象的映射方法。
 * @param id 目标对象
 * @param value 请求值，用于设置 Mapper 的目标
 */
function RequestMapping(id, value) {
    let mapper;
    // 检查 innerMap 中是否有该对象的映射
    if (!innerMap.has(id))
        return;
    // 获取现有的 Mapper 实例
    mapper = innerMap.get(id);
    // 设置 Mapper 实例的目标
    mapper.target = value;
    // 调用映射的回调函数
    mapper.call();
}
export { Mapper, MapperObserveKey, MapperEvent, Mapping, RequestMapping };
