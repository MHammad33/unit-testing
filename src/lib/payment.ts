import delay from "delay";

// TODO: Integrate with real payment gateway
export async function processPayment(creditCard: string, amount: number) {
  console.log(`Charging Credit Card ${creditCard} for $${amount}`);
  await delay(2000);
  return { status: "success" };
}
