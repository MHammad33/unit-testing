import { describe, it, expect } from "vitest";
import {
  max,
  fizzBuzz,
  calculateAverage,
  calculateFactorial,
} from "../src/intro";

describe("max", () => {
  it("should return the first argument if it is greater", () => {
    expect(max(5, 3)).toBe(5);
  });
  it("should return the second argument if it is greater", () => {
    expect(max(3, 5)).toBe(5);
  });
  it("should return either argument if they are equal", () => {
    expect(max(4, 4)).toBe(4);
  });
});

describe("fizzBuzz", () => {
  it("should return 'Fizz' for multiples of 3", () => {
    expect(fizzBuzz(9)).toBe("Fizz");
  });
  it("should return 'Buzz' for multiples of 5", () => {
    expect(fizzBuzz(10)).toBe("Buzz");
  });
  it("should return 'FizzBuzz' for multiples of both 3 and 5", () => {
    expect(fizzBuzz(15)).toBe("FizzBuzz");
  });
  it("should return the number as a string for non-multiples of 3 or 5", () => {
    expect(fizzBuzz(7)).toBe("7");
  });
});

describe("calculateAverage", () => {
  it("should return NaN for an empty array", () => {
    expect(calculateAverage([])).toBeNaN();
  });

  it("should return the first number of an array, if it contains only one number", () => {
    expect(calculateAverage([42])).toBe(42);
  });

  it("should calculate average of an array with 2 elements", () => {
    expect(calculateAverage([2, 4])).toBe(3);
  });

  it("should calculate average of an array with multiple elements", () => {
    expect(calculateAverage([1, 2, 3, 4, 5])).toBe(3);
  });
});

describe("calculateFactorial", () => {
  it("should throw an error for negative numbers", () => {
    expect(() => calculateFactorial(-5)).toThrow(
      "Factorial is not defined for negative numbers",
    );
  });

  it("should return 1 for an input of 0", () => {
    expect(calculateFactorial(0)).toBe(1);
  });

  it("should return 1 for an input of 1", () => {
    expect(calculateFactorial(1)).toBe(1);
  });

  it("should return 2 for an input of 2", () => {
    expect(calculateFactorial(2)).toBe(2);
  });

  it("should return 120 for an input of 5", () => {
    expect(calculateFactorial(5)).toBe(120);
  });

  it("should return 3628800 for an input of 10", () => {
    expect(calculateFactorial(10)).toBe(3628800);
  });
});
