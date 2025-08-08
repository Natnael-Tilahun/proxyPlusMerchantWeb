

export function formatAccountNumber(accountId: string) {
  if (accountId) {
    // Handle different length scenarios
    if (accountId.length < 6) {
      if (accountId.length <= 2) {
        return "*".repeat(accountId.length); // Mask everything if too short
      }
      // For 3-5 characters, show first and last, mask the middle
      const firstChar = accountId.substring(0, 1);
      const lastChar = accountId.substring(accountId.length - 1);
      const asterisks = "*".repeat(accountId.length - 2);
      return `${firstChar}${asterisks}${lastChar}`;
    }
    
    const firstFourDigits = accountId.substring(0, 4);
    const lastTwoDigits = accountId.substring(accountId.length - 2);
    const asterisks = "*".repeat(accountId.length - 6);
    return `${firstFourDigits}${asterisks}${lastTwoDigits}`;
  }
  return ""; // Return empty string instead of undefined
}