import { RGBA } from "./ColorFormat/RGBA.js";
import { HSLA } from "./ColorFormat/HSLA.js";
import { HWBA } from "./ColorFormat/HWBA.js";
import { LABA } from "./ColorFormat/LABA.js";
import { LCHA } from "./ColorFormat/LCHA.js";
import { OKLABA } from "./ColorFormat/OKLABA.js";
import { OKLCHA } from "./ColorFormat/OKLCHA.js";
import { COLOR_NAME } from "./COLOR_NAME.js";
class Color extends COLOR_NAME {
    static HSLAToRGBA(color) {
        let h = color.H;
        let s = color.S;
        let l = color.L;
        let alpha = color.Alpha;
        // Normalize hue to the range [0, 1]
        h = ((h % 360) + 360) % 360 / 360;
        // Convert saturation and lightness to [0, 1]
        s /= 100;
        l /= 100;
        // Calculate chroma（计算色度）
        const chroma = (1 - Math.abs(2 * l - 1)) * s;
        // Calculate intermediate values（计算中间值）
        const x = chroma * (1 - Math.abs((h * 6) % 2 - 1));
        const m = l - chroma / 2;
        // Convert to RGB
        let r, g, b;
        if (h < 1 / 6) {
            [r, g, b] = [chroma, x, 0];
        }
        else if (h < 2 / 6) {
            [r, g, b] = [x, chroma, 0];
        }
        else if (h < 3 / 6) {
            [r, g, b] = [0, chroma, x];
        }
        else if (h < 4 / 6) {
            [r, g, b] = [0, x, chroma];
        }
        else if (h < 5 / 6) {
            [r, g, b] = [x, 0, chroma];
        }
        else {
            [r, g, b] = [chroma, 0, x];
        }
        // Add m to each channel
        r += m;
        g += m;
        b += m;
        // Round to 8-bit values
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);
        return new RGBA(r, g, b, alpha);
    }
    ;
    static HWBAToRGBA(color) {
        const [h, w, b, a] = [color.H, color.W, color.B, color.Alpha];
        // 将角度转换为弧度
        const hRad = (h * Math.PI) / 180;
        // 计算 RGB 颜色值
        const r = w + (b - w) * (1 + Math.cos(hRad)) / 2;
        const g = w + (b - w) * (1 - Math.cos(hRad)) / 2;
        const bValue = b;
        // 将透明度从 [0, 1] 转换为 [0, 255]
        const alpha = a;
        // 返回 RGBA 颜色值
        return new RGBA(Math.round(r * 255), Math.round(g * 255), Math.round(bValue * 255), alpha);
    }
    ;
    static LABAToRGBA(color) {
        const l = color.L;
        const a = color.A;
        const b = color.B;
        const alpha = color.Alpha;
        // Convert LAB to XYZ
        const y = (l + 16) / 116;
        const x = a / 500 + y;
        const z = y - b / 200;
        const x3 = x ** 3;
        const y3 = y ** 3;
        const z3 = z ** 3;
        const refX = 0.9642;
        const refY = 1.0;
        const refZ = 0.8249;
        const fx = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
        const fy = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
        const fz = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;
        const r = fx * refX;
        const g = fy * refY;
        const b2 = fz * refZ;
        // Convert XYZ to RGB
        const gammaCorrect = (value) => (value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055);
        const gammaCorrectedR = gammaCorrect(r);
        const gammaCorrectedG = gammaCorrect(g);
        const gammaCorrectedB = gammaCorrect(b2);
        // Round to 8-bit values
        const r8 = Math.round(gammaCorrectedR * 255);
        const g8 = Math.round(gammaCorrectedG * 255);
        const b8 = Math.round(gammaCorrectedB * 255);
        return new RGBA(r8, g8, b8, alpha);
    }
    ;
    static LCHAToRGBA(color) {
        const l = color.L;
        const c = color.C;
        const h = color.H;
        const alpha = color.Alpha;
        // Convert LCH to LAB
        const a = c * Math.cos((h * Math.PI) / 180);
        const b = c * Math.sin((h * Math.PI) / 180);
        // Convert LAB to XYZ (omitting D65 illuminant for simplicity)
        const y = (l + 16) / 116;
        const x = a / 500 + y;
        const z = y - b / 200;
        // Convert XYZ to RGB
        const gammaCorrect = (value) => (value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055);
        const gammaCorrectedR = gammaCorrect(x);
        const gammaCorrectedG = gammaCorrect(y);
        const gammaCorrectedB = gammaCorrect(z);
        // Round to 8-bit values
        const r8 = Math.round(gammaCorrectedR * 255);
        const g8 = Math.round(gammaCorrectedG * 255);
        const b8 = Math.round(gammaCorrectedB * 255);
        return new RGBA(r8, g8, b8, alpha);
    }
    ;
    static OKLABAToRGBA(color) {
        const l = color.L;
        const a = color.A;
        const b = color.B;
        const alpha = color.Alpha;
        // Convert OKLAB to XYZ (omitting D65 illuminant for simplicity)
        const y = (l + 16) / 116;
        const x = a / 500 + y;
        const z = y - b / 200;
        // Convert XYZ to RGB
        const gammaCorrect = (value) => (value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055);
        const gammaCorrectedR = gammaCorrect(x);
        const gammaCorrectedG = gammaCorrect(y);
        const gammaCorrectedB = gammaCorrect(z);
        // Round to 8-bit values
        const r8 = Math.round(gammaCorrectedR * 255);
        const g8 = Math.round(gammaCorrectedG * 255);
        const b8 = Math.round(gammaCorrectedB * 255);
        return new RGBA(r8, g8, b8, alpha);
    }
    ;
    static OKLCHAToRGBA(color) {
        const l = color.L;
        const c = color.C;
        const h = color.H;
        const alpha = color.Alpha;
        // Convert OKLCH to LAB
        const a = c * Math.cos((h * Math.PI) / 180);
        const b = c * Math.sin((h * Math.PI) / 180);
        // Convert LAB to XYZ (omitting D65 illuminant for simplicity)
        const y = (l + 16) / 116;
        const x = a / 500 + y;
        const z = y - b / 200;
        // Convert XYZ to RGB
        const gammaCorrect = (value) => (value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055);
        const gammaCorrectedR = gammaCorrect(x);
        const gammaCorrectedG = gammaCorrect(y);
        const gammaCorrectedB = gammaCorrect(z);
        // Round to 8-bit values
        const r8 = Math.round(gammaCorrectedR * 255);
        const g8 = Math.round(gammaCorrectedG * 255);
        const b8 = Math.round(gammaCorrectedB * 255);
        return new RGBA(r8, g8, b8, alpha);
    }
    ;
    static RGBAToHSLA(color) {
        const r = color.R / 255;
        const g = color.G / 255;
        const b = color.B / 255;
        const alpha = color.Alpha;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        let h = 0;
        let s = 0;
        let l = (max + min) / 2;
        if (delta !== 0) {
            s = delta / (1 - Math.abs(2 * l - 1));
            if (max === r) {
                h = ((g - b) / delta) % 6;
            }
            else if (max === g) {
                h = (b - r) / delta + 2;
            }
            else {
                h = (r - g) / delta + 4;
            }
            h *= 60;
        }
        return new HSLA(Math.round(h), Math.round(s * 100), Math.round(l * 100), alpha);
    }
    ;
    static RGBAToHWBA(color) {
        const r = color.R / 255;
        const g = color.G / 255;
        const b = color.B / 255;
        const alpha = color.Alpha;
        // Calculate the maximum and minimum values
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        // Calculate the chroma and lightness
        const chroma = max - min;
        const lightness = (max + min) / 2;
        // Calculate the hue
        let hue = 0;
        if (chroma !== 0) {
            if (max === r) {
                hue = ((g - b) / chroma) % 6;
            }
            else if (max === g) {
                hue = (b - r) / chroma + 2;
            }
            else {
                hue = (r - g) / chroma + 4;
            }
            hue *= 60;
        }
        return new HWBA(hue, chroma, lightness, alpha);
    }
    ;
    static RGBAToLABA(color) {
        const r = color.R / 255;
        const g = color.G / 255;
        const b = color.B / 255;
        const alpha = color.Alpha;
        // Convert RGB to XYZ
        const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
        const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
        const z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
        // Normalize XYZ to reference white (D65 illuminant)
        const xN = x / 0.95047;
        const yN = y / 1.00000;
        const zN = z / 1.08883;
        // Calculate LAB values
        const fX = xN > 0.008856 ? Math.cbrt(xN) : (903.3 * xN + 16) / 116;
        const fY = yN > 0.008856 ? Math.cbrt(yN) : (903.3 * yN + 16) / 116;
        const fZ = zN > 0.008856 ? Math.cbrt(zN) : (903.3 * zN + 16) / 116;
        const l = 116 * fY - 16;
        const a = 500 * (fX - fY);
        const b2 = 200 * (fY - fZ);
        return new LABA(l, a, b2, alpha);
    }
    ;
    static RGBAToLCHA(color) {
        const r = color.R / 255;
        const g = color.G / 255;
        const b = color.B / 255;
        const alpha = color.Alpha;
        // Convert RGB to XYZ
        const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
        const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
        const z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
        // Convert XYZ to LAB (omitting D65 illuminant for simplicity)
        const xN = x / 0.95047;
        const yN = y / 1.00000;
        const zN = z / 1.08883;
        const fX = xN > 0.008856 ? Math.cbrt(xN) : (903.3 * xN + 16) / 116;
        const fY = yN > 0.008856 ? Math.cbrt(yN) : (903.3 * yN + 16) / 116;
        const fZ = zN > 0.008856 ? Math.cbrt(zN) : (903.3 * zN + 16) / 116;
        const l = 116 * fY - 16;
        const c = Math.sqrt(fX ** 2 + fY ** 2 + fZ ** 2);
        const h = (Math.atan2(fZ, fX) * 180) / Math.PI;
        return new LCHA(l, c, h, alpha);
    }
    ;
    static RGBAToOKLABA(color) {
        const r = color.R / 255;
        const g = color.G / 255;
        const b = color.B / 255;
        const alpha = color.Alpha;
        // Convert RGB to linear sRGB
        const linearR = r <= 0.04045 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
        const linearG = g <= 0.04045 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
        const linearB = b <= 0.04045 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;
        // Convert linear sRGB to linear XYZ
        const x = 0.4124564 * linearR + 0.3575761 * linearG + 0.1804375 * linearB;
        const y = 0.2126729 * linearR + 0.7151522 * linearG + 0.0721750 * linearB;
        const z = 0.0193339 * linearR + 0.1191920 * linearG + 0.9503041 * linearB;
        // Convert linear XYZ to OKLAB
        const l = 0.2104542553 * y + 0.7936177850 * x - 0.0040720468 * z;
        const m = 1.9779984951 * y - 2.4285922050 * x + 0.4505937099 * z;
        const s = 0.0259040371 * y + 0.7827717662 * x - 0.8086757660 * z;
        // Scale and clip the values
        const lScaled = l ** (1 / 3);
        const mScaled = m ** (1 / 3);
        const sScaled = s ** (1 / 3);
        const lClipped = Math.max(0, Math.min(1, lScaled));
        const mClipped = Math.max(0, Math.min(1, mScaled));
        const sClipped = Math.max(0, Math.min(1, sScaled));
        return new OKLABA(lClipped, mClipped, sClipped, alpha);
    }
    ;
    static RGBAToOKLCHA(color) {
        const r = color.R / 255;
        const g = color.G / 255;
        const b = color.B / 255;
        const alpha = color.Alpha;
        // Convert RGB to linear sRGB
        const linearR = r <= 0.04045 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
        const linearG = g <= 0.04045 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
        const linearB = b <= 0.04045 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;
        // Convert linear sRGB to linear XYZ
        const x = 0.4124564 * linearR + 0.3575761 * linearG + 0.1804375 * linearB;
        const y = 0.2126729 * linearR + 0.7151522 * linearG + 0.0721750 * linearB;
        const z = 0.0193339 * linearR + 0.1191920 * linearG + 0.9503041 * linearB;
        // Convert linear XYZ to OKLCH
        const l = 0.2104542553 * y + 0.7936177850 * x - 0.0040720468 * z;
        const m = 1.9779984951 * y - 2.4285922050 * x + 0.4505937099 * z;
        const s = 0.0259040371 * y + 0.7827717662 * x - 0.8086757660 * z;
        // Scale and clip the values
        const lScaled = l ** (1 / 3);
        const mScaled = m ** (1 / 3);
        const sScaled = s ** (1 / 3);
        const lClipped = Math.max(0, Math.min(1, lScaled));
        const mClipped = Math.max(0, Math.min(1, mScaled));
        const sClipped = Math.max(0, Math.min(1, sScaled));
        return new OKLCHA(lClipped, mClipped, sClipped, alpha);
    }
    ;
}
Color.RGBA = RGBA;
Color.HSLA = HSLA;
Color.HWBA = HWBA;
Color.LABA = LABA;
Color.LCHA = LCHA;
Color.OKLABA = OKLABA;
Color.OKLCHA = OKLCHA;
export { Color };
