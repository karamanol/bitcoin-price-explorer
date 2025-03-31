import { useEffect, useState } from "react";
import {
  DataForFetcherType,
  PriceProvidersType,
  getPriceFromBanxa,
  getPriceFromMoonpay,
  getPriceFromRamp,
  getPriceFromSardine,
  // getPriceFromSimplex,
} from "../services/getPrices";

export type ProvidersPriceType = Record<
  PriceProvidersType,
  { name: PriceProvidersType; cryptoAmount: string }
>;

export function useFetchPrices({ amount, currency }: DataForFetcherType) {
  const [isLoading, setIsLoading] = useState(false);
  const [allProvidersPrice, setAllProvidersPrice] =
    useState<ProvidersPriceType | null>(null);
  const [inputError, setInpuError] = useState("");

  useEffect(() => {
    (async () => {
      const controller = new AbortController();
      // if emty string
      if (!amount) {
        setInpuError("Type a number in range 50 - 20,0000");
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
        if (numericValue < 50 || numericValue > 20000) {
          setInpuError("Input must be a number between 50 and 20,000 ");
          setIsLoading(false);
          return;
        } else {
          setInpuError("");
        }
      }

      async function fetchAllPrices() {
        try {
          setIsLoading(true);
          const [
            banxa,
            moonpay,
            ramp,
            sardine,
            //  simplex
          ] = await Promise.all([
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
            // getPriceFromSimplex({
            //   amount,
            //   currency,
            //   controller,
            //   setIsLoading,
            //   setInpuError,
            // }),
          ]);

          const providersPrice: ProvidersPriceType = {
            Banxa: { name: "Banxa", cryptoAmount: banxa || "" },
            Moonpay: { name: "Moonpay", cryptoAmount: moonpay || "" },
            Ramp: { name: "Ramp", cryptoAmount: ramp || "" },
            Sardine: { name: "Sardine", cryptoAmount: sardine || "" },
            // Simplex: { name: "Simplex", cryptoAmount: simplex || "" },
          };

          setAllProvidersPrice(providersPrice);
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          if (err instanceof Error) {
            // console.error(err.message);
            setInpuError(err.message);
          }
        }
      }

      await fetchAllPrices();

      // cleanup
      return () => {
        // preventing race condition
        controller.abort();
      };
    })();
  }, [amount, currency]);

  return { allProvidersPrice, isLoading, inputError };
}
