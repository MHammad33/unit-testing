import delay from "delay";

export async function trackPageView(pagePath: string): Promise<void> {
  console.log("Sending analytics...");
  console.log(`Page viewed: ${pagePath}`);
  await delay(3000);
}
