import { trackPageView } from "./lib/analytics";
import { getExchangeRate } from "./lib/currency";
import { isValidEmail, sendEmail } from "./lib/email";
import { processPayment } from "./lib/payment";
import security from "./lib/security";
import { getShippingQuote } from "./lib/shipping";

export function getPriceInCurrency(price: number, currency: string): number {
  const rate = getExchangeRate("USD", currency);
  return price * rate;
}

export function getShippingInfo(destination: string) {
  const quote = getShippingQuote(destination);
  if (!quote) return "Shipping unavailable";
  return `Shipping cost: $${quote.cost} (${quote.estimatedDays} days)`;
}

// Interaction testing
export async function renderPage() {
  trackPageView("/home");
  return "<h1>Home Page</h1>";
}

export async function submitOrder(
  order: { totalAmount: number },
  creditCard: string,
) {
  const paymentResult = await processPayment(creditCard, order.totalAmount);
  console.log(paymentResult);

  if (paymentResult.status === "failed") {
    return { success: false, message: "Payment failed" };
  }

  return { success: true, message: "Order placed successfully" };
}

// Partial mocking
export async function signUp(email: string) {
  if (!isValidEmail(email)) return false;
  await sendEmail(email, "Welcome Aboard!");
  return true;
}

// Spying on functions
export async function login(email: string) {
  const code = security.generateCode();
  await sendEmail(email, code.toString());
}

// Mocking Date/Time
export function isOnline() {
  const availableHours = [8, 21];
  const [open, close] = availableHours;
  const currentHour = new Date().getHours();
  return currentHour >= open && currentHour < close;
}

export function getDiscount() {
  const today = new Date();
  const isImportantDate = today.getDate() === 12 && today.getMonth() === 2;
  return isImportantDate ? 0.2 : 0;
}
