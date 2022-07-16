import { describe, expect, it } from 'vitest';
import Vec2d from '../src/vec2d';

describe('SimpleVec tests', () => {
  it('should add two vectors', () => {
    const v1 = new Vec2d(1, 2);
    const v2 = new Vec2d(3, 4);
    const v3 = v1.add(v2);
    expect(v3.x).toBe(4);
    expect(v3.y).toBe(6);
  });

  it('should subtract two vectors', () => {
    const v1 = new Vec2d(1, 2);
    const v2 = new Vec2d(3, 4);
    const v3 = v1.subtract(v2);
    expect(v3.x).toBe(-2);
    expect(v3.y).toBe(-2);
  });

  it('should dot two vectors', () => {
    const v1 = new Vec2d(1, 2);
    const v2 = new Vec2d(3, 4);
    const v3 = v1.dot(v2);
    expect(v3).toBe(11);
  });

  it('should compute magnitude squared', () => {
    const v1 = new Vec2d(1, 2);
    const v2 = v1.magnitudeSqr();
    expect(v2).toBe(5);
  });

  it('should compute magnitude', () => {
    const v1 = new Vec2d(1, 2);
    const v2 = v1.magnitude();
    expect(v2).toBe(Math.sqrt(5));
  });

  it('should compute unit vector', () => {
    const v1 = new Vec2d(1, 2);
    const v2 = v1.unit();
    expect(v2.x).toBe(1 / Math.sqrt(5));
    expect(v2.y).toBe(2 / Math.sqrt(5));
  });

  it('should scalar multiply', () => {
    const v1 = new Vec2d(1, 2);
    const v2 = v1.scalarMult(2);
    expect(v2.x).toBe(2);
    expect(v2.y).toBe(4);
  });

  it('should return object from .simple()', () => {
    const v1 = new Vec2d(1, 2);
    const v2 = v1.simple();
    expect(v2).toEqual({ x: 1, y: 2 });
  });
});
