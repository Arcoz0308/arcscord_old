export type RGB = [number, number, number];

export class Color {
    static decimalToHex(color: number): string {
        return '#' + color.toString(16);
    }
    
    static hexToDecimal(color: string): number {
        if (color.includes('#')) color = color.replace('#', '');
        return parseInt(color, 16);
    }
    
    static decimalToRGB(color: number): RGB {
        return [(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff];
    }
    
    static RGBtoDecimal(color: RGB): number {
        return (color[0] << 16) + (color[1] << 8) + color[2];
    }
}
