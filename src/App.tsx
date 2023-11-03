import Input from "./components/Input";
import React, { useEffect, useState } from "react";
import ListResultRow from "./components/ListResultRow";
import { useFetchPrices } from "./hooks/useFetchPrices";

function App() {
  const [amount, setAmount] = useState("100");
  const [bestPriceProvider, setBestPriceProvider] = useState<string>();

  const { allProvidersPrice, isLoading, inputError } = useFetchPrices({
    amount,
    currency: "BTC",
  });

  useEffect(() => {
    if (allProvidersPrice) {
      const sortedPrices = Object.entries(allProvidersPrice).sort(
        (a, b) => parseFloat(a[1]) - parseFloat(b[1])
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
        <ListResultRow
          bestPriceProvider={bestPriceProvider}
          erorString={inputError}
          loading={isLoading}
          amountInBtc={allProvidersPrice?.Banxa}
          providerName="Banxa"
        />
        <ListResultRow
          bestPriceProvider={bestPriceProvider}
          erorString={inputError}
          loading={isLoading}
          amountInBtc={allProvidersPrice?.Moonpay}
          providerName="Moonpay"
        />
        <ListResultRow
          bestPriceProvider={bestPriceProvider}
          erorString={inputError}
          loading={isLoading}
          amountInBtc={allProvidersPrice?.Ramp}
          providerName="Ramp"
        />
        <ListResultRow
          bestPriceProvider={bestPriceProvider}
          erorString={inputError}
          loading={isLoading}
          amountInBtc={allProvidersPrice?.Sardine}
          providerName="Sardine"
        />
        <ListResultRow
          bestPriceProvider={bestPriceProvider}
          erorString={inputError}
          loading={isLoading}
          amountInBtc={allProvidersPrice?.Simplex}
          providerName="Simplex"
        />
      </ul>

      {/* Tooltip */}
      <div className="hidden sm:block has-tooltip absolute right-8 top-12">
        <span className="pl-4 tooltip rounded shadow-lg p-1 bg-slate-100/60 backdrop-blur-sm text-gray-900/60 mt-12 -ml-60 w-72 font-semibold text-xl">
          The final Bitcoin amount you get may vary based on the chosen payment
          method
        </span>
        <div className="h-10 w-10 ">
          <img src="/info-circle-svgrepo-com.svg" alt="info icon" />
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
