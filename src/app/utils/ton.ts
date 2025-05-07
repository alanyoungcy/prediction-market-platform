'use client';

export const createMarketTransaction = (
  question: string,
  description: string,
  category: string,
  endTime: number,
  initialLiquidity: string
) => {
  return {
    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 seconds
    messages: [
      {
        address: "EQD__________________________________________0",
        amount: initialLiquidity,
        payload: "base64encodedpayload==" // This would be the encoded CreateMarket message
      }
    ]
  };
};

export const buySharesTransaction = (
  marketId: string,
  outcome: boolean,
  amount: string
) => {
  return {
    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 seconds
    messages: [
      {
        address: "EQD__________________________________________0",
        amount: amount,
        payload: "base64encodedpayload==" // This would be the encoded BuyShares message
      }
    ]
  };
};

export const sellSharesTransaction = (
  marketId: string,
  outcome: boolean,
  amount: string
) => {
  return {
    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 seconds
    messages: [
      {
        address: "EQD__________________________________________0",
        amount: "10000000", // Minimum amount for gas
        payload: "base64encodedpayload==" // This would be the encoded SellShares message
      }
    ]
  };
};

export const resolveMarketTransaction = (
  marketId: string,
  outcome: boolean
) => {
  return {
    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 seconds
    messages: [
      {
        address: "EQD__________________________________________0",
        amount: "10000000", // Minimum amount for gas
        payload: "base64encodedpayload==" // This would be the encoded ResolveMarket message
      }
    ]
  };
};
