"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "@/lib/utils";

export function WalletPill() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="rounded-full border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primary shadow-card transition hover:border-primary/40 hover:bg-primary-soft"
      >
        {shortenAddress(address)}
      </button>
    );
  }

  const preferredConnector =
    connectors.find((connector) => connector.name.toLowerCase().includes("coinbase")) ??
    connectors[0];

  return (
    <button
      onClick={() => {
        if (preferredConnector) connect({ connector: preferredConnector });
      }}
      disabled={!preferredConnector || isPending}
      className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-primary-deep disabled:opacity-60"
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
