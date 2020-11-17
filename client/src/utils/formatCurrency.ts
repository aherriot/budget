function formatCurrency(val: number) {
  return "$" + (val / 100).toFixed(2);
}

export default formatCurrency;
