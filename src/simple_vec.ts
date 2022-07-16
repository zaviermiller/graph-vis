export interface SimpleVec {
  x: number;
  y: number;
}

type vector = Vec2d | SimpleVec;

export class Vec2d {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  simple(): SimpleVec {
    return {
      x: this.x,
      y: this.y,
    };
  }

  add(v: vector): Vec2d {
    return new Vec2d(this.x + v.x, this.y + v.y);
  }

  subtract(v: vector): Vec2d {
    return new Vec2d(this.x - v.x, this.y - v.y);
  }

  dot(v: vector): number {
    return this.x * v.x + this.y * v.y;
  }

  magnitudeSqr(): number {
    return this.x ** 2 + this.y ** 2;
  }

  magnitude(): number {
    return Math.sqrt(this.magnitudeSqr());
  }

  unit(): Vec2d {
    const mag = this.magnitude();
    return new Vec2d(this.x / mag, this.y / mag);
  }

  scalarMult(scalar: number): Vec2d {
    return new Vec2d(this.x * scalar, this.y * scalar);
  }
}
