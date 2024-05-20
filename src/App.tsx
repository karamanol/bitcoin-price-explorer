import Input from "./components/Input";
import React, { useEffect, useState } from "react";
import ListResultRow from "./components/ListResultRow";
import { ProvidersPriceType, useFetchPrices } from "./hooks/useFetchPrices";
import { useDebounce } from "./hooks/useDebounce";
import { PriceProvidersType } from "./services/getPrices";

const amountDefaultValue = "100";
const providersPlaceholder: ProvidersPriceType = {
  Banxa: { name: "Banxa", cryptoAmount: "" },
  Moonpay: { name: "Moonpay", cryptoAmount: "" },
  Ramp: { name: "Ramp", cryptoAmount: "" },
  Sardine: { name: "Sardine", cryptoAmount: "" },
  Simplex: { name: "Simplex", cryptoAmount: "" },
};

function App() {
  const [amount, setAmount] = useState(amountDefaultValue);
  const [bestPriceProvider, setBestPriceProvider] = useState<string>("");

  const debouncedAmount = useDebounce(amount, 800);
  const { allProvidersPrice, isLoading, inputError } = useFetchPrices({
    amount: debouncedAmount || amount,
    currency: "BTC",
  });

  useEffect(() => {
    if (allProvidersPrice) {
      const sortedPrices = Object.entries(allProvidersPrice).sort(
        (a, b) => parseFloat(a[1].cryptoAmount) - parseFloat(b[1].cryptoAmount)
      );
      setBestPriceProvider(sortedPrices[sortedPrices.length - 1][0]);
    }
  }, [allProvidersPrice]);

  return (
    <main className="max-w-2xl min-w-[260px] mx-auto px-5 py-10 min-h-screen flex flex-col">
      <h1 className="font-mono bg-gradient-to-l from-rose-500 via-pink-600 to-blue-300 bg-clip-text text-transparent text-4xl sm:text-6xl uppercase text-center font-semibold tracking-wide">
        Find the Most Affordable Bitcoin Offers
      </h1>

      <Input
        inputError={inputError}
        value={amount}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setAmount(e.target.value);
        }}
      />

      <ul className="mt-6">
        {Object.entries(allProvidersPrice || providersPlaceholder).map(
          (provider) => {
            return (
              <ListResultRow
                key={provider[0]}
                providerName={provider[0] as PriceProvidersType}
                amountInBtc={provider[1].cryptoAmount}
                isBestPriceProvider={provider[0] === bestPriceProvider}
                erorString={inputError}
                loading={isLoading}
              />
            );
          }
        )}
      </ul>

      {/* Tooltip */}
      <div className="hidden sm:block has-tooltip absolute right-8 top-12">
        <span className="pl-4 tooltip rounded shadow-lg p-1 bg-slate-100/60 backdrop-blur-sm text-gray-900/60 mt-12 -ml-60 w-72 font-semibold text-xl">
          The final Bitcoin amount you get may vary based on the chosen payment
          method
        </span>
        <div className="h-10 w-10 ">
          <img src="/info-circle.svg" alt="info icon" />
        </div>
      </div>
      <div className="mt-auto">
        <div className="sm:hidden border border-white/10 rounded-md mt-5 backdrop-blur-3xl">
          <p className=" text-gray-200/50 p-2 text-center">
            <span className="text-gray-100/70">IMPORTANT</span>: The final
            Bitcoin amount you get may vary based on the chosen payment method
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;
