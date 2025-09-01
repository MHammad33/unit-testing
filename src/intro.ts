export function max(a: number, b: number): number {
  return a > b ? a : b;
}

export function fizzBuzz(n: number): string {
  return n % 3 === 0 && n % 5 === 0
    ? "FizzBuzz"
    : n % 3 === 0
      ? "Fizz"
      : n % 5 === 0
        ? "Buzz"
        : n.toString();
}

export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return NaN;
  const sum = numbers.reduce((sum, current) => sum + current, 0);
  return sum / numbers.length;
}

export function calculateFactorial(n: number): number {
  if (n < 0) throw new Error("Factorial is not defined for negative numbers");
  if (n === 0 || n === 1) return 1;
  return n * calculateFactorial(n - 1);
}
