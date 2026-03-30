// Helper function to generate customer ID
export function generateCustomerId(companyName: string): string {
  if (!companyName) return "";

  // Use first 3 letters of company name + first letter of contact person
  const companyPrefix = companyName.split(" ");

  // Add a random 3-digit number
  const randomDigits = Math.floor(100 + Math.random() * 900);

  return `${companyPrefix[0][0]}${companyPrefix[1][0]}-${randomDigits}`;
}
