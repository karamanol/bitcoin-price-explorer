import { PriceProvidersType } from "../services/getPrices";
import { cn } from "../utils/cn";

type ListResultRowProps = {
  loading?: boolean;
  providerName: PriceProvidersType;
  amountInBtc?: string;
  erorString?: string;
  isBestPriceProvider?: boolean;
};

const logosAndAddresses: Record<
  PriceProvidersType,
  { logo: string; address: string }
> = {
  Banxa: {
    logo: "/icons-btc-providers/logo-banxa.svg",
    address: "https://openocean.banxa.com/",
  },
  Moonpay: {
    logo: "/icons-btc-providers/logo-moonpay.svg",
    address: "https://www.moonpay.com/buy",
  },
  Ramp: {
    logo: "/icons-btc-providers/logo-ramp.svg",
    address: "https://ramp.network/buy",
  },
  Simplex: {
    logo: "/icons-btc-providers/logo-simplex.svg",
    address: "https://www.simplex.com/account/buy",
  },
  Sardine: {
    logo: "/icons-btc-providers/logo-sardine.svg",
    address: "https://crypto.sardine.ai/buy",
  },
};

function ListResultRow({
  loading,
  providerName,
  amountInBtc,
  erorString,
  isBestPriceProvider,
}: ListResultRowProps) {
  // const isBestPrice = bestPriceProvider === providerName;
  return (
    <li
      key={providerName}
      className={cn([
        "relative overflow-hidden border min-h-14 border-white/10 rounded-md bg-gradient-to-r from-purple-400/20 to-indigo-500/20 my-1",

        isBestPriceProvider && !loading
          ? "animate-bestPrice bg-emerald-600/30"
          : "",
      ])}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={logosAndAddresses[providerName].address}
        className="flex gap-2 sm:gap-6 items-center h-100% p-3 hover:bg-violet-300/20 duration-300">
        <div className="w-14 sm:w-20 flex mr-2 ">
          <img src={logosAndAddresses[providerName].logo} alt="" />
        </div>
        <p className="sm:text-2xl tracking-wider text-gray-100/80 max-[340px]:hidden">
          {providerName}
        </p>
        <div className="ml-auto flex gap-2 items-center">
          <span className="font-semibold sm:text-xl text-gray-100/80">
            {amountInBtc?.padEnd(10, "0")}
          </span>
          <span className="text-xl text-gray-100/50 font-bold">BTC</span>
        </div>
      </a>
      {loading && (
        <div className="inset-0 absolute bg-gradient-to-r from-transparent via-violet-500/50 to-transparent skeleton-animation border-t border-white/20" />
      )}
      {erorString && (
        <div className="inset-0 absolute backdrop-blur-[0.1rem]"></div>
      )}
    </li>
  );
}

export default ListResultRow;
