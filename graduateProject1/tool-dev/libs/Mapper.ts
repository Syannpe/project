//和Mapper为依赖关系

/**
 * MapperObserveKey 类，用于观察和处理键列表。
 */
class MapperObserveKey extends Object {
    // 存储键的列表
    public keylist: any = [];

    /**
     * 添加一个键到键列表中。
     * @param key 任意类型的键
     * @returns 当前的 MapperObserveKey 实例
     */
    public addKey(key: any): MapperObserveKey {
        this.keylist.push(key);
        return this;
    }

    /**
     * 清空键列表。
     * @returns 当前的 MapperObserveKey 实例
     */
    public clearKeyList(): MapperObserveKey {
        this.keylist.length = 0;
        return this;
    }

    /**
     * 根据键列表从对象中获取值。
     * @param obj 目标对象
     * @returns 获取的值
     */
    public getValue(obj: Object): any {
        let value: any = obj;

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
    public key: any;
    public target: Mapper;
    public customData: Array<any>;

    /**
     * 构造函数
     * @param key 事件的键
     * @param target 目标 Mapper 对象
     * @param customData 自定义数据
     */
    constructor(key: any, target: Mapper, customData: Array<any>) {
        super();

        this.key = key;
        this.target = target;
        this.customData = customData;
    }
}

/**
 * MapperOptions 接口，定义 Mapper 的选项。
 */
interface MapperOptions {
    observeKey: MapperObserveKey;
}

/**
 * Mapper 类，用于键值映射和事件处理。
 */
class Mapper extends Object {
    public target: any;
    public options: MapperOptions;
    #map: Map<any, Array<Function>> = new Map();
    #symbolDefault: Symbol = Symbol("default");
    #symbolFinally: Symbol = Symbol("finally");

    /**
     * 添加一个键和回调函数的映射。
     * @param key 任意类型的键
     * @param callback 回调函数
     * @returns 当前的 Mapper 实例
     */
    public map(key: any, callback: Function): Mapper {
        if (!this.#map.get(key)) {
            this.#map.set(key, [callback]);
        } else {
            this.#map.get(key).push(callback);
        }
        return this;
    }

    /**
     * 设置默认的回调函数。
     * @param callback 可调用的回调函数
     * @returns 当前的 Mapper 实例
     */
    default(callback: CallableFunction): Mapper {
        if (!this.#map.get(this.#symbolDefault)) {
            this.#map.set(this.#symbolDefault, [callback]);
        } else {
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
    public finally(callback: CallableFunction): Mapper {
        if (!this.#map.get(this.#symbolFinally)) {
            this.#map.set(this.#symbolFinally, [callback]);
        } else {
            //@ts-ignore:
            this.#map.get(this.#symbolFinally).push(callback);
        }
        return this;
    }

    /**
     * 调用映射的回调函数。
     * @param params 任意参数数组
     */
    public call(...params: Array<any>): void {
        let target: any;
        if (typeof this.target === "object" && this.options.observeKey) {
            target = this.options.observeKey.getValue(this.target);
        } else {
            target = this.target;
        }

        let callbacks: Function[] | undefined = this.#map.get(target);
        if (!callbacks) callbacks = this.#map.get(this.#symbolDefault);
        if (!callbacks) return;
        let finallyCBs: Function[] | undefined = this.#map.get(this.#symbolFinally);

        let mapperEvent: MapperEvent = new MapperEvent(target, this, params);

        callbacks?.forEach((cb: Function) => {
            cb(mapperEvent);
        });
        finallyCBs?.forEach((cb: Function) => {
            cb(mapperEvent);
        });
    }

    /**
     * 异步调用映射的回调函数。
     * @param params 任意参数数组
     */
    public async callSync(...params: Array<any>): Promise<void> {
        let target: any;
        if (typeof this.target === "object" && this.options.observeKey) {
            target = this.options.observeKey.getValue(this.target);
        } else {
            target = this.target;
        }

        let callbacks: Function[] | undefined = this.#map.get(target);
        if (!callbacks) callbacks = this.#map.get(this.#symbolDefault);
        if (!callbacks) return;
        let finallyCBs: Function[] | undefined = this.#map.get(this.#symbolFinally);

        const mapperEvent: MapperEvent = new MapperEvent(target, this, params);

        if (callbacks) {
            for (const cb of callbacks) {
                await cb(mapperEvent);
            }
        }
        if (!finallyCBs) return;
        for (const cb of finallyCBs) {
            await cb(mapperEvent);
        }
    }

    /**
     * 构造函数
     * @param target 目标对象
     * @param options Mapper 配置选项
     */
    constructor(target: any, options: MapperOptions | null = null) {
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
function Mapping(id: any, value: any = null) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let mapper: Mapper;
        // 检查 innerMap 中是否已经有该对象的映射
        if (innerMap.has(id)) {
            // 如果有，获取现有的 Mapper 实例
            mapper = innerMap.get(id);
        } else {
            // 如果没有，创建一个新的 Mapper 实例并存储在 innerMap 中
            mapper = new Mapper(id);
            innerMap.set(id, mapper);
        }

        let cb = target instanceof Function ? target : target[propertyKey].bind(target);

        if (value) {
            // 将目标方法映射到指定的键上
            mapper.map(value, cb);
        } else {
            mapper.default(cb)
        }
        return descriptor;
    }
}

/**
 * RequestMapping 函数，用于触发指定对象的映射方法。
 * @param id 目标对象
 * @param value 请求值，用于设置 Mapper 的目标
 */
function RequestMapping(id: any, value: any) {
    let mapper: Mapper;
    // 检查 innerMap 中是否有该对象的映射
    if (!innerMap.has(id)) return;
    // 获取现有的 Mapper 实例
    mapper = innerMap.get(id);
    // 设置 Mapper 实例的目标
    mapper.target = value;
    // 调用映射的回调函数
    mapper.call();
}


export {Mapper, MapperObserveKey, MapperOptions, MapperEvent, Mapping, RequestMapping}