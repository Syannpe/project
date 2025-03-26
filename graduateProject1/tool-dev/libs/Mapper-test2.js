var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Mapping, RequestMapping } from "./Mapper.js";
const rand = Math.floor(Math.random() * 3);
class Test {
    a() {
        console.log('a');
    }
    b() {
        console.log('b');
    }
    c() {
        console.log('c');
    }
}
__decorate([
    Mapping(0, 0)
], Test.prototype, "a", null);
__decorate([
    Mapping(0, 1)
], Test.prototype, "b", null);
__decorate([
    Mapping(0, 2)
], Test.prototype, "c", null);
RequestMapping(0, rand);
