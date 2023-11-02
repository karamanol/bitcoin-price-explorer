import { cn } from "../utils/utils";

type ListResultRowProps = {
  loading?: boolean;
  providerName: PriceProviders;
  amountInBtc?: string;
  erorString?: string;
  bestPriceProvider?: string;
};
type PriceProviders = "Banxa" | "Moonpay" | "Ramp" | "Sardine" | "Simplex";

const logosAndAddresses: Record<
  PriceProviders,
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
  bestPriceProvider,
}: ListResultRowProps) {
  const isBestPrice = bestPriceProvider === providerName;
  return (
    <li
      key={amountInBtc}
      className={cn([
        "relative overflow-hidden border min-h-14 border-white/10 rounded-md bg-gradient-to-r from-purple-400/20 to-indigo-500/20 my-1",

        isBestPrice && !loading ? "animate-bestPrice bg-emerald-600/30" : "",
      ])}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={logosAndAddresses[providerName].address}
        className="flex gap-6 items-center h-100% p-3 hover:bg-violet-300/20 duration-300">
        <div className="w-20 flex mr-2">
          <img
            src={logosAndAddresses[providerName].logo}
            alt={`${providerName} logo`}
          />
        </div>
        <p className="text-2xl tracking-wider text-gray-100">
          {providerName || "Provider"}
        </p>
        <div className="ml-auto flex gap-2">
          <span className="font-semibold text-xl text-gray-100/80">
            {amountInBtc?.padEnd(10, "0") || "0.0000"}
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
