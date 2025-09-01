import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
  validateUserInput,
} from "../src/core";

describe("getCoupons", () => {
  it("should return an array of coupon objects", () => {
    const coupons = getCoupons();
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0)
  });

  it("should return an array with valid coupon codes", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(typeof coupon.code).toBe("string");
      expect(coupon.code).toBeTruthy();
    });
  });

  it("should return an array with valid discount values", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon.discount).toBe("number");
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

// Positive and Negative Testing Examples
describe("calculateDiscount", () => {
  // Positive Test
  it("should return discounted price if given valid code", () => {
    expect(calculateDiscount(100, "SUMMER2024")).toBe(90);
    expect(calculateDiscount(200, "WINTER2024")).toBe(160);
  });

  // Negative Tests
  it("should handle non-numeric price", () => {
    const result = calculateDiscount(NaN, "SUMMER2024");
    expect(result).toMatch("Invalid price");
  });

  it("should handle negative price", () => {
    const result = calculateDiscount(-5, "SUMMER2024");
    expect(result).toMatch("Invalid price");
  });

  it("should handle zero price", () => {
    const result = calculateDiscount(0, "SUMMER2024");
    expect(result).toMatch("Invalid price");
  });

  it("should handle empty discount code", () => {
    const result = calculateDiscount(10, "");
    expect(result).toMatch("Invalid discount");
  });

  it("should handle whitespace discount code", () => {
    const result = calculateDiscount(10, "   ");
    expect(result).toMatch("Invalid discount");
  });

  it("should handle non-string discount code", () => {
    // @ts-expect-error Testing invalid input
    const result = calculateDiscount(10, 123);
    expect(result).toMatch("Invalid discount");
  });
});

describe("validateUserInput", () => {
  // Positive Test
  it("should return success if given valid input", () => {
    expect(validateUserInput("Alice", 25)).toMatch(/success/i);
  });

  // Negative Tests
  it("should handle short username", () => {
    const result = validateUserInput("Al", 25);
    expect(result).toMatch(/invalid/i);
  });

  it("should handle empty username", () => {
    const result = validateUserInput("", 25);
    expect(result).toMatch(/invalid/i);
  });

  it("should handle whitespace username", () => {
    const result = validateUserInput("   ", 25);
    expect(result).toMatch(/invalid/i);
  });

  it("should handle long username", () => {
    const longUsername = "A".repeat(1000);
    const result = validateUserInput(longUsername, 25);
    expect(result).toMatch(/invalid/i);
  });

  it("should handle non-string username", () => {
    // @ts-expect-error Testing invalid input
    const result = validateUserInput(123, 25);
    expect(result).toMatch(/invalid/i);
  });

  it("should handle underage user", () => {
    const result = validateUserInput("Alice", 16);
    expect(result).toMatch(/invalid/i);
  });

  it("should handle overage user", () => {
    const result = validateUserInput("Alice", 101);
    expect(result).toMatch(/invalid/i);
  });

  it("should handle non-numeric age", () => {
    // @ts-expect-error Testing invalid input
    const result = validateUserInput("Alice", "twenty");
    expect(result).toMatch(/invalid/i);
  });

  it("should return all errors if multiple inputs are invalid", () => {
    const result = validateUserInput("Al", 16);
    expect(result).toMatch(/invalid username/i);
    expect(result).toMatch(/invalid age/i);
    expect(result.split(", ").length).toBe(2);
  });
});

// Boundary Testing Examples
describe("isPriceInRange", () => {
  it("should return true for price within the range", () => {
    expect(isPriceInRange(15, 10, 20)).toBe(true);
    expect(isPriceInRange(10.01, 10, 20)).toBe(true);
    expect(isPriceInRange(19.99, 10, 20)).toBe(true);
  });

  it("should return true for price equal to the boundaries", () => {
    expect(isPriceInRange(10, 10, 20)).toBe(true);
    expect(isPriceInRange(20, 10, 20)).toBe(true);
  });

  it("should return false for price outside the range", () => {
    expect(isPriceInRange(-25, 10, 20)).toBe(false);
    expect(isPriceInRange(25, 10, 20)).toBe(false);
  });

  it("should return false for price just below min boundary", () => {
    expect(isPriceInRange(9.99, 10, 20)).toBe(false);
  });

  it("should return false for price just above max boundary", () => {
    expect(isPriceInRange(20.01, 10, 20)).toBe(false);
  });
});

describe("isValidUsername", () => {
  const minLength = 3;
  const maxLength = 15;

  it("should return false for username is too short", () => {
    expect(isValidUsername("a".repeat(minLength - 1))).toBe(false);
  });

  it("should return false for username is too long", () => {
    expect(isValidUsername("a".repeat(maxLength + 1))).toBe(false);
  });

  it("should return true for username at min or max length", () => {
    expect(isValidUsername("a".repeat(minLength))).toBe(true);
    expect(isValidUsername("a".repeat(maxLength))).toBe(true);
  });

  it("should return true for username at within valid length", () => {
    expect(isValidUsername("a".repeat(minLength + 1))).toBe(true);
    expect(isValidUsername("a".repeat(maxLength - 1))).toBe(true);
  });

  it("should return false for invalid input types", () => {
    // @ts-expect-error Testing invalid input
    expect(isValidUsername(null)).toBe(false);

    // @ts-expect-error Testing invalid input
    expect(isValidUsername(undefined)).toBe(false);

    // @ts-expect-error Testing invalid input
    expect(isValidUsername(123)).toBe(false);
  });
});

describe("canDrive", () => {
  it("should return true for age 16 for US and age 17 for UK", () => {
    expect(canDrive(16, "US")).toMatch(/Allowed/);
    expect(canDrive(17, "UK")).toMatch(/Allowed/);
  });

  it("should return false for invalid country codes", () => {
    expect(canDrive(18, "CA")).toMatch(/Invalid country code/);
    expect(canDrive(18, "AU")).toMatch(/Invalid country code/);
  });

  it("should return false for underage drivers", () => {
    expect(canDrive(15, "US")).toMatch(/Not allowed/);
    expect(canDrive(16, "UK")).toMatch(/Not allowed/);
  });
});

// Parameterized Tests
describe("isPriceInRange - Parameterized", () => {
  it.each([
    { price: 15, min: 10, max: 20, expected: true },
    { price: 10, min: 10, max: 20, expected: true },
    { price: 20, min: 10, max: 20, expected: true },
    { price: 9.99, min: 10, max: 20, expected: false },
    { price: 20.01, min: 10, max: 20, expected: false },
    { price: -5, min: 10, max: 20, expected: false },
    { price: 25, min: 10, max: 20, expected: false },
  ])(
    "should return $expected for price $price with range $min-$max",
    ({ price, min, max, expected }) => {
      expect(isPriceInRange(price, min, max)).toBe(expected);
    },
  );
});

// Asynchronous Tests
describe("fetchData", () => {
  it("should return a promise that will resolve to an array of numbers", async () => {
    try {
      const data = await fetchData();
      expect(Array.isArray(data)).toBe(true);

      // @ts-expect-error Testing unknown type
      expect(data.length).toBeGreaterThan(0);
    } catch (error) {
      expect(error).toHaveProperty("message");
      expect(error.message).toMatch(/fail/i);
    }
  });
});

// Setup and Teardown Examples
describe("test suite", () => {
  beforeAll(() => {
    console.log("Before all called");
  });

  beforeEach(() => {
    console.log("Before each called");
  });

  afterAll(() => {
    console.log("After all called");
  });

  afterEach(() => {
    console.log("After each called");
  });

  it("test 1", () => {});
  it("test 2", () => {});
  it("test 3", () => {});
});

describe("Stack", () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  it("should add an item to the stack", () => {
    stack.push(1);
    expect(stack.size()).toBe(1);
  });

  it("should remove and return the top item from the stack", () => {
    stack.push(1);
    stack.push(2);

    expect(stack.pop()).toBe(2);
    expect(stack.size()).toBe(1);
  });

  it("should throw an error when popping from an empty stack", () => {
    expect(() => stack.pop()).toThrow("Stack is empty");
  });

  it("should return the top item without removing it", () => {
    stack.push(1);
    stack.push(2);

    expect(stack.peek()).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it("should throw an error when peeking into an empty stack", () => {
    expect(() => stack.peek()).toThrow("Stack is empty");
  });

  it("isEmpty should return true if the stack is empty", () => {
    expect(stack.isEmpty()).toBe(true);
  });

  it("isEmpty should return false if the stack has items", () => {
    stack.push(1);
    expect(stack.isEmpty()).toBe(false);
  });

  it("size should return the number of items in the stack", () => {
    expect(stack.size()).toBe(0);
    stack.push(1);
    expect(stack.size()).toBe(1);
  });

  it("clear should remove all items from the stack", () => {
    stack.push(1);
    stack.push(2);
    stack.clear();
    expect(stack.size()).toBe(0);
    expect(stack.isEmpty()).toBe(true);
  });
});
