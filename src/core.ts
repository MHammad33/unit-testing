export function getCoupons() {
  return [
    { code: "SUMMER2024", discount: 0.2 },
    { code: "WINTER2024", discount: 0.25 },
  ];
}

// Positive and Negative Testing Examples
export function calculateDiscount(
  price: number,
  discountCode: string,
): number | string {
  if (typeof price !== "number" || price <= 0 || isNaN(price)) {
    return "Invalid price";
  }

  if (typeof discountCode !== "string" || !discountCode.trim()) {
    return "Invalid discount code";
  }

  let discount = 0;
  if (discountCode === "SUMMER2024") {
    discount = 0.1;
  } else if (discountCode === "WINTER2024") {
    discount = 0.2;
  }

  return price - price * discount;
}

export function validateUserInput(username: string, age: number): string {
  const errors = [];

  if (
    typeof username !== "string" ||
    username.trim().length < 3 ||
    username.trim().length > 255
  ) {
    errors.push("Invalid username");
  }

  if (typeof age !== "number" || age < 18 || age > 100 || isNaN(age)) {
    errors.push("Invalid age");
  }

  return errors.length === 0 ? "Validation successful" : errors.join(", ");
}

// Boundary Testing Examples
export function isPriceInRange(price: number, min: number, max: number) {
  return price >= min && price <= max;
}

export function isValidUsername(username: string) {
  if (typeof username !== "string") return false;

  const minLength = 3;
  const maxLength = 15;
  return username.length >= minLength && username.length <= maxLength;
}

export function canDrive(age: number, countryCode: string): string {
  const legalDrivingAge: { [key: string]: number } = {
    US: 16,
    UK: 17,
  };

  if (!legalDrivingAge[countryCode]) {
    return "Invalid country code";
  }

  return age >= legalDrivingAge[countryCode]
    ? "Allowed to drive"
    : "Not allowed to drive";
}

// Asynchronous Testing
export async function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = [1, 2, 3, 4, 5];
      resolve(data);
    });
  });
}

// Setup and Teardown Examples

export class Stack {
  // @ts-expect
  private items: number[];

  constructor() {
    this.items = [];
  }

  push(item: number) {
    this.items.push(item);
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}
