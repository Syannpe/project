import {Mapping, RequestMapping} from "./Mapper.js";

const rand = Math.floor(Math.random() * 3);

class Test {
    @Mapping(0, 0)
    a() {
        console.log('a');
    }

    @Mapping(0, 1)
    b() {
        console.log('b');
    }

    @Mapping(0, 2)
    c() {
        console.log('c');
    }
}

RequestMapping(0, rand);