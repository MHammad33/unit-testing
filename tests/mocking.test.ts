import { vi, it, expect, describe, beforeEach } from "vitest";
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/lib/currency";
import { getShippingQuote } from "../src/lib/shipping";
import { trackPageView } from "../src/lib/analytics";
import { processPayment } from "../src/lib/payment";
import { sendEmail } from "../src/lib/email";
import security from "../src/lib/security";

// Create a mock function
describe("test suite", () => {
  it("test case", () => {
    const greet = vi.fn();

    // Mocking examples
    greet.mockReturnValue("Hello, World!");
    greet.mockResolvedValue("Hello, World!");
    greet.mockImplementation((name) => `Hello, ${name || "World"}!`);

    greet("Hammad");

    expect(greet).toHaveBeenCalled();
    expect(greet).toHaveBeenCalledWith("Hammad");
    expect(greet).toHaveReturnedWith("Hello, Hammad!");
  });

  it("test case 2", () => {
    const sendText = vi.fn();
    sendText.mockImplementation(() => "ok");

    const result = sendText("message");

    expect(sendText).toHaveBeenCalledWith("message");
    expect(result).toBe("ok");
  });
});

vi.mock("../src/lib/currency"); // This will make all functions mock functions
vi.mock("../src/lib/shipping"); // This will make all functions mock functions
vi.mock("../src/lib/analytics"); // This will make all functions mock functions
vi.mock("../src/lib/payment"); // This will make all functions mock functions

// Partial mocking - keep original implementations except the ones we override
vi.mock("../src/lib/email", async (importOriginal) => {
  const originalModule =
    await importOriginal<typeof import("../src/lib/email")>();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

// Mocking modules
describe("getPriceInCurrency", () => {
  it("should return price in target currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(0.85);
    const price = getPriceInCurrency(100, "EUR");
    expect(price).toBe(85);
  });
});

describe("getShippingInfo", () => {
  it("should return shipping unavailable if quote cannot be fetched", () => {
    const info = getShippingInfo("Karachi");
    expect(info).toMatch(/unavailable/);
  });

  it("should return price in target currency", () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 5 });
    const info = getShippingInfo("US");
    expect(info).toBe("Shipping cost: $10 (5 days)");
  });
});

// Interaction testing
describe("renderPage", () => {
  it("should return correct content", async () => {
    const result = await renderPage();
    expect(result).toMatch(/Home Page/);
  });

  it("should call analytics", async () => {
    await renderPage();
    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  const order = { totalAmount: 100 };
  const creditCard = "4111111111111111";

  it("should handle payment failure", async () => {
    vi.mocked(processPayment).mockResolvedValue({
      status: "failed",
    });

    const result = await submitOrder(order, creditCard);
    expect(processPayment).toHaveBeenCalledWith(creditCard, order.totalAmount);
    expect(result).toEqual({ success: false, message: "Payment failed" });
  });

  it("should handle payment success", async () => {
    vi.mocked(processPayment).mockResolvedValue({
      status: "success",
    });

    const result = await submitOrder(order, creditCard);
    expect(processPayment).toHaveBeenCalledWith(creditCard, order.totalAmount);
    expect(result).toEqual({
      success: true,
      message: "Order placed successfully",
    });
  });
});

// Partial mocking
describe("signUp", () => {
  const email = "name@domain.com";

  beforeEach(() => {
    vi.mocked(sendEmail).mockClear();
    vi.clearAllMocks();
  });

  it("should return false for invalid email", async () => {
    const result = await signUp("a");
    expect(result).toBe(false);
  });

  it("should return true for valid email", async () => {
    const result = await signUp("name@domain.com");
    expect(result).toBe(true);
  });

  it("should send welcome email for valid email", async () => {
    await signUp(email);

    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/Welcome/i);

    expect(sendEmail).toHaveBeenCalledOnce();
  });
});

// Spying on functions
describe("login", () => {
  const email = "name@domain.com";
  it("should email the one-time login code", async () => {
    const spy = vi.spyOn(security, "generateCode");
    await login(email);

    const securityCode = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

// Mocking Date/Time
describe("isOnline", () => {
  it("should return false outside available hours", () => {
    vi.setSystemTime("2025-01-01 07:59");
    expect(isOnline()).toBe(false);

    vi.setSystemTime("2025-01-01 21:01");
    expect(isOnline()).toBe(false);
  });

  it("should return true during available hours", () => {
    vi.setSystemTime("2025-01-01 08:00");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2025-01-01 20:59");
    expect(isOnline()).toBe(true);
  });
});

describe("getDiscount", () => {
  it("should return 0% discount on normal days", () => {
    vi.setSystemTime("2025-01-01");
    expect(getDiscount()).toBe(0);

    vi.setSystemTime("2025-12-01");
    expect(getDiscount()).toBe(0);

    vi.setSystemTime("2025-03-11");
    expect(getDiscount()).toBe(0);
  });

  it("should return 20% discount on important dates", () => {
    vi.setSystemTime("2025-03-12 00:00");
    expect(getDiscount()).toBe(0.2);

    vi.setSystemTime("2025-03-12 23:59");
    expect(getDiscount()).toBe(0.2);
  });
});
