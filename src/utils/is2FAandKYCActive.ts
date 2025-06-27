export const is2FAandKYCverified = (
  is2FAverified: boolean,
  is2KYCverified: boolean
) => {
  if (is2FAverified && is2KYCverified) {
    return true;
  }
  return false;
};
