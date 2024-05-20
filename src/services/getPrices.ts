import React from "react";

export type DataForFetcherType = {
  amount: string;
  currency: "BTC";
  controller?: AbortController;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setInpuError?: React.Dispatch<React.SetStateAction<string>>;
};
export type PriceProvidersType =
  | "Banxa"
  | "Moonpay"
  | "Ramp"
  | "Sardine"
  | "Simplex";

export async function getPriceFromBanxa({
  amount,
  currency,
  controller,
  setIsLoading,
  setInpuError,
}: DataForFetcherType): Promise<string | undefined> {
  const banxaUrl = `https://bitpay.com/crypto-widget/api/buy/quote/banxa?fiatAmount=${amount}&cryptoCurrency=${currency}&fiatCurrency=USD`;
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
}: DataForFetcherType): Promise<string | undefined> {
  const moonpayUrl = `https://bitpay.com/crypto-widget/api/buy/quote/moonpay?fiatAmount=${amount}&cryptoCurrency=${currency}&fiatCurrency=USD&transactionMethod=credit_debit_card`;
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
}: DataForFetcherType): Promise<string | undefined> {
  const rampFormatCurrency = currency + "_" + currency;
  const rampUrl = `https://bitpay.com/crypto-widget/api/buy/quote/ramp?fiatAmount=${amount}&cryptoCurrency=${rampFormatCurrency}&fiatCurrency=USD`;
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
}: DataForFetcherType): Promise<string | undefined> {
  const sardineUrl = `https://bitpay.com/crypto-widget/api/buy/quote/sardine?fiatAmount=${amount}&cryptoCurrency=${currency}&fiatCurrency=USD&cryptoChain=bitcoin&transactionMethod=credit`;
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
}: DataForFetcherType): Promise<string | undefined> {
  const simplexUrl = `https://bitpay.com/crypto-widget/api/buy/quote/simplex?fiatAmount=${amount}&cryptoCurrency=${currency}&fiatCurrency=USD&userId=67ef04b8-1520-4669-95aa-576e7bc84cb2&transactionMethod=credit_card`;
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
