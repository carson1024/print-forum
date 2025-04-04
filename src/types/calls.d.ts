export interface CallReportType {
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  },
  fdv: number;
  marketCap: number;
  info: {
    imageUrl: string;
    header: string;
    openGraph: string;
  },
  fileMeta: {
    image: string;
    description: string;
    name: string;
    symbol: string;
  },
  tokenMeta: {
    name: string;
    symbol: string;
  },
  topHolders: [{
    address: string;
    pct: number;
    uiAmount: number;
  }],
  token: {
    mintAuthority: string;
    supply: number;
    decimals: number;
    isInitialized: boolean;
    freezeAuthority: string;
  }
}