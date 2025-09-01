export function isValidEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export async function sendEmail(to: string, body: string) {
  console.log(`Sending email to ${to}`);
  console.log("Email body:");
  console.log(body);
}
