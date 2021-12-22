export const shortAddress = (address) => {
  if (!address) return '';
  return !!address && `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
};
