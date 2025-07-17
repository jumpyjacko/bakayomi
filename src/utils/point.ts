export class Point {
    constructor(public x: number, public y: number) {}

    static zero(): Point {
        return new Point(0, 0);
    }

    add(other: Point): Point {
        return new Point(this.x + other.x, this.y + other.y);
    }
    
    subtract(other: Point): Point {
        return new Point(this.x - other.x, this.y - other.y);
    }
    
    scale(factor: number): Point {
        return new Point(this.x * factor, this.y * factor);
    }

    distance(other: Point): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;

        return Math.hypot(dx, dy);
    }
}
