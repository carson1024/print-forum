import { pairsCache } from "cache";
import { CallReportType } from "types/calls";

export const checkCall = async (address: string): Promise<CallReportType | null> => {
  if (pairsCache[address]) {
    return pairsCache[address];
  }

  let tokenAddress = '';

  try {
    const getPairUrl = `https://api.dexscreener.com/latest/dex/pairs/solana/${address}`;
    let response = await fetch(getPairUrl);
    let pairData = await response.json();

    if (pairData.pairs && pairData.pairs.length > 0) {
      if (pairData.pairs[0].quoteToken.symbol != "SOL") return null;
      const baseToken = pairData.pairs[0].baseToken.address;
      // const quoteToken = data.pairs[0].quoteToken.address;
      tokenAddress = baseToken;
    }else {
      const getTokenUrl = `https://api.dexscreener.com/latest/dex/tokens/${address}`;
      response = await fetch(getTokenUrl);
      pairData = await response.json();
      if (pairData.pairs && pairData.pairs.length > 0) {
        if (pairData.pairs[0].quoteToken.symbol != "SOL") return null;
        const baseToken = pairData.pairs[0].baseToken.address;
        // const quoteToken = data.pairs[0].quoteToken.address;
        tokenAddress = baseToken;
      }
    }

    // console.log("Token Name", tokenAddress);
    if (!tokenAddress) {
      return null;
    }

    const rugCheckUrl = `https://api.rugcheck.xyz/v1/tokens/${tokenAddress}/report`;
    response = await fetch(rugCheckUrl);
    const rugCheckData = await response.json();

    // console.log("Rug Check Result", data);
    const result: CallReportType = {
      ...pairData.pairs[0],
      ...rugCheckData
    };
    pairsCache[result.pairAddress] = result;

    return result;
  } catch (error) {
  }

  return null;
}

export function formatShortAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function formatNumber(value: number): string {
  if (!value) return '0';
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}b`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}m`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}k`;
  }
  return value.toFixed(2);
}

export function formatTimestamp(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const seconds = diffInSeconds % 60;
  const minutes = Math.floor((diffInSeconds / 60) % 60);
  const hours = Math.floor((diffInSeconds / 3600) % 24);
  const days = Math.floor((diffInSeconds / 86400) % 30);
  const months = Math.floor((diffInSeconds / (86400 * 30)) % 12);
  const years = Math.floor(diffInSeconds / (86400 * 365));

  let result = '';
  let unitCount = 0;

  if (years > 0 && unitCount < 2) {
    result += `${years}yr `;
    unitCount++;
  }
  if (months > 0 && unitCount < 2) {
    result += `${months}mo `;
    unitCount++;
  }
  if (days > 0 && unitCount < 2) {
    result += `${days}d `;
    unitCount++;
  }
  if (hours > 0 && unitCount < 2) {
    result += `${hours}h `;
    unitCount++;
  }
  if (minutes > 0 && unitCount < 2) {
    result += `${minutes}m `;
    unitCount++;
  }
  if (seconds > 0 && unitCount === 0) {
    result += `${seconds}s `;
  }

  return result.trim();
}