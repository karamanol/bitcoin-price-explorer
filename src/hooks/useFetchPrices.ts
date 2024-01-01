import { useEffect, useState } from "react";
import {
  DataForFetcher,
  getPriceFromBanxa,
  getPriceFromMoonpay,
  getPriceFromRamp,
  getPriceFromSardine,
  getPriceFromSimplex,
} from "../services/getPrices";

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

export function useFetchPrices({ amount, currency }: DataForFetcher) {
  const [isLoading, setIsLoading] = useState(false);
  const [allProvidersPrice, setAllProvidersPrice] = useState<{
    [key: string]: string;
  } | null>(null);
  const [inputError, setInpuError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    // if emty string
    if (!amount) {
      setInpuError("Type a number in range 50 - 10,0000");
      setIsLoading(false);
      return;
      // if not a number
    } else if (!/^\d+$/.test(amount)) {
      setInpuError("Input must be a positive number");
      setIsLoading(false);
      return;
    } else {
      const numericValue = parseInt(amount);
      // if not in required range
      if (numericValue < 50 || numericValue > 10000) {
        setInpuError("Input must be a number between 50 and 10,000 ");
        setIsLoading(false);
        return;
      } else {
        setInpuError("");
      }
    }

    async function fetchAllPrices() {
      try {
        await delay(500); // to not fetch immediately
        setIsLoading(true);
        const [banxa, moonpay, ramp, sardine, simplex] = await Promise.all([
          getPriceFromBanxa({
            amount,
            currency,
            controller,
            setIsLoading,
            setInpuError,
          }),
          getPriceFromMoonpay({
            amount,
            currency,
            controller,
            setIsLoading,
            setInpuError,
          }),
          getPriceFromRamp({
            amount,
            currency,
            controller,
            setIsLoading,
            setInpuError,
          }),
          getPriceFromSardine({
            amount,
            currency,
            controller,
            setIsLoading,
            setInpuError,
          }),
          getPriceFromSimplex({
            amount,
            currency,
            controller,
            setIsLoading,
            setInpuError,
          }),
        ]);

        const providersPrice: { [key: string]: string } = {};

        if (banxa) providersPrice["Banxa"] = banxa;
        if (moonpay) providersPrice["Moonpay"] = moonpay;
        if (ramp) providersPrice["Ramp"] = ramp;
        if (sardine) providersPrice["Sardine"] = sardine;
        if (simplex) providersPrice["Simplex"] = simplex;

        if (Object.keys(providersPrice).length === 5) {
          setAllProvidersPrice(providersPrice);
          setIsLoading(false);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
          setInpuError(err.message);
        }
      }
    }
    fetchAllPrices();

    // cleanup
    return () => {
      // preventing race condition
      controller.abort();
    };
  }, [amount, currency]);

  return { allProvidersPrice, isLoading, inputError };
}
