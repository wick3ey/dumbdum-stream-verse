
export const abbreviateNumber = (num: number): string => {
  const abbreviations = [
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" }
  ];

  const item = abbreviations.find(item => num >= item.value);
  if (item) {
    const abbreviated = (num / item.value).toFixed(1).replace(/\.0$/, '');
    return `$${abbreviated}${item.symbol}`;
  }
  
  return `$${num.toFixed(0)}`;
};
