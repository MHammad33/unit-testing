export const getShippingQuote = (
  destination: string,
): {
  cost: number;
  estimatedDays: number;
} => {
  if (destination === "US") {
    return { cost: 5, estimatedDays: 3 };
  } else if (destination === "EU") {
    return { cost: 15, estimatedDays: 7 };
  } else if (destination === "ASIA") {
    return { cost: 25, estimatedDays: 10 };
  }

  return { cost: 50, estimatedDays: 15 };
};
