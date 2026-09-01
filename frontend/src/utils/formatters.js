export const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {style: 'currency', currency: 'INR'}).format(val || 0);
