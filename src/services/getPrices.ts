import React from "react";

export type DataForFetcher = {
  amount: string;
  currency: "BTC";
  controller?: AbortController;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setInpuError?: React.Dispatch<React.SetStateAction<string>>;
};

export async function getPriceFromBanxa({
  amount,
  currency,
  controller,
  setIsLoading,
  setInpuError,
}: DataForFetcher): Promise<string | undefined> {
  const banxaUrl = `https://bitpay.com/buy/quote/banxa?fiat=USD&amount=${amount}&crypto=${currency}`;
  try {
    const res = await fetch(banxaUrl, { signal: controller?.signal });
    if (!res.ok)
      throw new Error(`Error fetching banxa data. Status: ${res.status}`);
    const data = await res.json();
    if (data?.data?.prices && data.data.prices.length > 0) {
      const priceBanxa = data.data.prices[0].coin_amount;
      return priceBanxa;
    } else {
      throw new Error("Unexpected data format received from Banxa");
    }
  } catch (err) {
    if (err instanceof Error && err.name !== "AbortError") {
      setInpuError?.(err.message);
      setIsLoading?.(false);
    }
  }
}

export async function getPriceFromMoonpay({
  amount,
  currency,
  controller,
  setIsLoading,
  setInpuError,
}: DataForFetcher): Promise<string | undefined> {
  const moonpayUrl = `https://bitpay.com/buy/quote/moonpay?fiat=USD&amount=${amount}&crypto=${currency}`;
  try {
    const res = await fetch(moonpayUrl, { signal: controller?.signal });
    if (!res.ok)
      throw new Error(`Error fetching Moonpay data. Status: ${res.status}`);
    const data = await res.json();
    const priceMoonpay = data?.quoteCurrencyAmount;
    return priceMoonpay.toString();
  } catch (err) {
    if (err instanceof Error && err.name !== "AbortError") {
      setInpuError?.(err.message);
      setIsLoading?.(false);
    }
  }
}

const SATOSHI_IN_ONE_BTC = 100_000_000;

export async function getPriceFromRamp({
  amount,
  currency,
  controller,
  setIsLoading,
  setInpuError,
}: DataForFetcher): Promise<string | undefined> {
  const rampFormatCurrency = currency + "_" + currency;
  const rampUrl = `https://bitpay.com/buy/quote/ramp?fiat=USD&amount=${amount}&crypto=${rampFormatCurrency}`;
  try {
    const res = await fetch(rampUrl, { signal: controller?.signal });
    if (!res.ok)
      throw new Error(`Error fetching price from Ramp. Status: ${res.status}`);
    const data = await res.json();
    if (data?.CARD_PAYMENT?.cryptoAmount) {
      const rampPrice =
        parseInt(data.CARD_PAYMENT.cryptoAmount) / SATOSHI_IN_ONE_BTC; // Converting to btc from satoshi
      return rampPrice.toString();
    }
  } catch (err) {
    if (err instanceof Error && err.name !== "AbortError") {
      setInpuError?.(err.message);
      setIsLoading?.(false);
    }
  }
}

export async function getPriceFromSardine({
  amount,
  currency,
  controller,
  setIsLoading,
  setInpuError,
}: DataForFetcher): Promise<string | undefined> {
  const sardineUrl = `https://bitpay.com/buy/quote/sardine?fiat=USD&amount=${amount}&crypto=${currency}&chain=bitcoin`;
  try {
    const res = await fetch(sardineUrl, { signal: controller?.signal });
    if (!res.ok)
      throw new Error(`Error fetching sardine data. Status: ${res.status}`);
    const data = await res.json();

    if (data?.quantity) {
      const priceSardine = data.quantity.toString();
      return priceSardine;
    } else {
      throw new Error("Unexpected data format received from Sardine");
    }
  } catch (err) {
    if (err instanceof Error && err.name !== "AbortError") {
      setInpuError?.(err.message);
      setIsLoading?.(false);
    }
  }
}
export async function getPriceFromSimplex({
  amount,
  currency,
  controller,
  setIsLoading,
  setInpuError,
}: DataForFetcher): Promise<string | undefined> {
  const simplexUrl = `https://bitpay.com/buy/quote/simplex?fiat=USD&amount=${amount}&crypto=${currency}`;
  try {
    const res = await fetch(simplexUrl, { signal: controller?.signal });
    if (!res.ok)
      throw new Error(`Error fetching simplex data. Status: ${res.status}`);
    const data = await res.json();

    if (data?.digital_money?.amount) {
      const priceSimplex = data.digital_money.amount.toString();
      return priceSimplex;
    } else {
      throw new Error("Unexpected data format received from Simplex");
    }
  } catch (err) {
    if (err instanceof Error && err.name !== "AbortError") {
      setInpuError?.(err.message);
      setIsLoading?.(false);
    }
  }
}
