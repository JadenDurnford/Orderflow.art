import { LabelType } from "./types";

export const sankeyFrontendColors: Record<string, string> = {
  "Uniswap Website & Wallet: Default": "#FF258E",
  "Uniswap Universal Router": "#FF258E",
  "Uniswap V2": "#FF258E",
  "Uniswap V3": "#FF258E",
  "Uniswap Website: Uniswap X ON": "#e62180",
  "Uniswap X": "#e62180",
  "Unknown: Uniswap V2 Router": "#cc1e72",
  "Uniswap V2 Router": "#cc1e72",
  "Unknown: Uniswap V3 Router 1": "#b31a63",
  "Uniswap V3 Router 1": "#b31a63",
  "Unknown: Uniswap V3 Router 2": "#991655",
  "Uniswap V3 Router 2": "#991655",
  "1inch Integrators": "#16354E",
  "1inch Router": "#16354E",
  "Cowswap Integrators": "#C2EAFB",
  Cowswap: "#C2EAFB",
  "Cowswap Frontend": "#C2EAFB",
  "Gnosis Safe App (Filled by Cowswap ONLY)": "#08fc6c",
  "DefiLlama (Filled by Cowswap ONLY)": "#0457D3",
  "MEV Blocker": "#C2EAFB",
  "1inch Website: Default": "#16354E",
  "1inch Fusion": "#16354E",
  "Curvefi Frontend": "#C0C0C0",
  "Curvefi Router": "#C0C0C0",
  Curve: "#C0C0C0",
  "Paraswap Integrators": "#045BE4",
  "Paraswap Router": "#045BE4",
  "MetaMask Swaps": "#F47204",
  "MetaMask: Swap Router": "#F47204",
  "Maestro Telegram Bot": "#544FFA",
  "Maestro Router": "#544FFA",
  "Banana Gun Telegram Bot": "#FFED00",
  "Banana Gun Router": "#FFED00",
  "DefiLlama (Filled by 0x API ONLY)": "#0457D3",
  "DefiLlama (0x API)": "#0457D3",
  DefiLlama: "#0457D3",
  "Tokenlon Integrators": "#4DD1E1",
  "Tokenlon Router": "#4DD1E1",
  "0x API Integrators": "#95E355",
  "Coinbase Wallet": "#0054FF",
  "Coinbase Swaps Router": "#0054FF",
  Matcha: "#ACE57D",
  "Trust Wallet": "#FAB304",
  "Trust Wallet Router": "#FAB304",
  "Kyber Integrators": "#04CC9B",
  "Kyber Router": "#04CC9B",
  "Unibot Telegram Bot": "#C83CFC",
  "Unibot Router": "#C83CFC",
  Rizzolver: "#78CC04",
  Wintermute: "#78CC04",
  "Wintermute PMM": "#78CC04",
  "rsync-builder": "#78CC04",
  PLM: "#8E7870",
  SCP: "#8E7870",
  beaverbuild: "#8E7870",
  "The T": "#7986FF",
  "Tokka Labs": "#7986FF",
  "Tokka Labs PMM": "#7986FF",
  Flashbots: "#000000",
  "Flashbots Protect": "#000000",
  "Balancer Frontend": "#1E1E1E",
  Balancer: "#1E1E1E",
  Pancakeswap: "#D68C4C",
  Maverick: "#6300FF",
  Dodo: "#FFF704",
  Hashflow: "#2A2E38",
  "1inch RFQ": "#16354E",
  Sushiswap: "#5D93DD",
  "0x RFQ": "#95E355",
  Integral: "#4B2DA3",
  "1inch Limit Orders": "#16354E",
  Clipper: "#E4C662",
  "Airswap RFQ": "#2C70FF",
  Bancor: "#010D2B",
  Kyberswap: "#2FCC9F",
  Fraxswap: "#282828",
  Shibaswap: "#FFA409",
  Mstable: "#1a1a1a",
  Defiswap: "#037FF4",
  Verse_dex: "#0285FF",
  "Uniswap V1": "#FF258E",
  Carbon_defi: "#4D4D4D",
  Airswap: "#2C70FF",
  Dfx: "#AC3BDD",
  Swapr: "#2A17A8",
  Apeswap: "#A16552",
  "0x API Router": "#95E355",
  "Bebop Router": "#F74901",
  "Gravity Frontend": "#D3AE61",
  "Integral Frontend": "#4B2DA3",
  "Openocean Integrators": "#333333",
  "Aave Frontend": "#9A67A7",
  "DeFiSaver Frontend": "#38AF6F",
  "Odos Frontend": "#FF4B00",
  "OKX Wallet": "#313131",
  "Bitget Wallet": "#1EA3B4",
  "Hashflow Frontend": "#2A2E38",
  "FireBird Frontend": "#F8732F",
  "DODO Integrators": "#FFF704",
  "DEXView Telegram Bot": "#1A1B41",
  "SushiSwap Frontend": "#5D93DD",
  "Unknown: Uniswap Old Universal Router": "#b31a63",
  "PancakeSwap Frontend": "#D68C4C",
  "InstaDapp Frontend": "#4075FF",
  "Avocado Wallet": "#08F282",
  "Rainbow Wallet": "#004095",
  "ShibaSwap Frontend": "#FFA409",
  "Bebop Frontend": "#F74901",
  "Frax Finance Frontend": "#282828",
  "Integral Relayer": "#4B2DA3",
  "DODO X": "#FFF704",
  kyberswap: "#2FCC9F",
  "1inch Labs": "#16354E",
  Barter: "#FB73A0",
  Gnosis_1inch: "#16354E",
  Otex: "#5f5f5f",
  "Arctic Bastion": "#5C6E87",
  Gnosis_0x: "#95E355",
  Enso: "#FE6F42",
  Seawise: "#75CDF9",
  "Openocean Router": "#333333",
  "Integral TWAPDelay": "#4B2DA3",
  Gnosis_ParaSwap: "#045BE4",
  PropellerSwap: "#FFCC00",
  "Airswap Router": "#2C70FF",
  "Odos Router": "#FF4B00",
  "Balancer Router": "#1E1E1E",
  "OKX Router": "#313131",
  "Hashflow Router": "#2A2E38",
  "FireBird Router": "#F8732F",
  "DEXView Router": "#1A1B41",
  "SushiSwap Router": "#5D93DD",
  "Uniswap Old Universal Router": "#b31a63",
  "DODO Router": "#FFF704",
  "PancakeSwap Router": "#D68C4C",
  "Aave Router": "#9A67A7",
  "Bitget Router": "#1EA3B4",
  "ShibaSwap Router": "#FFA409",
  Gnosis_BalancerSOR: "#1E1E1E",
  Baseline: "#101010",
  "InstaDapp Router": "#4075FF",
  "DeFiSaver Router": "#38AF6F",
  Amber: "#474747",
  "Frax Finance Router": "#282828",
  OpenOcean_Aggregator: "#333333",
  "Avocado Router": "#08F282",
  "Rainbow Router": "#004095",
  "Gravity Router": "#D3AE61",
  "SCP PMM": "#8E7870",
  "Kyber PMM": "#04CC9B",
  "OneBit Quant PMM": "#222C2E",
  "Alpha Lab PMM": "#1F2227",
  "1inch Labs PMM": "#16354E",
  "0x PMM": "#95E355",
  "The T PMM": "#7986FF",
  "Arctic Bastion PMM": "#5C6E87",
  "1inch PMM": "#16354E",
  "1inch PMMs": "#16354E",
  "Cowswap Limit Order (CoW)": "#C2EAFB",
  "Seawise PMM": "#75CDF9",
  "Amber PMM": "#474747",
  "Airswap PMM": "#2C70FF",
  "Kronos PMM": "#FF8A3A",
  "DWF PMM": "#242424",
  "public mempool": "#c75a2c",
  "private mempool": "#14c94b",
  Seasolver: "#363636",
  "Flashbots Protect & MEV Blocker": "#000000",
  bloXroute: "#361C77",
  Titan: "#00D992",
  edennetwork: "#80E952",
  "Gambit Labs": "#214158",
  "boba-builder": "#ACD904",
  payload: "#202124",
  tbuilder: "#00D992",
  Manifold: "#12171C",
  Blocksmith: "#EC4F59",
  EigenPhi: "#EE2310",
  lightspeedbuilder: "#FFEC60",
  Bitget: "#1EA3B4",
  "pandabuilder.io": "#868785",
  "0x328...8bb": "#FF626A",
  "0x328...8bb PMM": "#FF626A",
};

export const entityColumns = {
  orderflow: ["frontend", "metaaggregator", "solver", "mempool", "ofa", "builder"],
  liquidity: ["frontend", "metaaggregator", "solver", "aggregator", "liquidity_src", "pmm"],
};

export const timeframeList = [
  {
    label: "1d",
    value: "1d",
  },
  {
    label: "7d",
    value: "7d",
  },
  {
    label: "30d",
    value: "30d",
  },
  {
    label: "All",
    value: "All",
  },
];

export const categoryTokens = {
  "eth/btc": [
    "ETH-USDC",
    "USDC-WETH",
    "ETH-USDT",
    "USDT-WETH",
    "DAI-WETH",
    "DAI-ETH",
    "USDC-WBTC",
    "USDT-WBTC",
    "DAI-WBTC",
    "WBTC-WETH",
  ],
  stableswaps: [
    "USDC-USDT",
    "DAI-USDC",
    "DAI-USDT",
    "ETH-stETH",
    "WETH-wstETH",
    "rETH-WETH",
    "USDC.e-WETH",
    "BUSD-USDC.e",
    "USDC-USDC.e",
    "USDC.e-USDT",
    "BUSD-USDT",
    "crvUSD-USDC",
    "crvUSD-USDT",
    "FRAX-USDC",
    "TUSD-USDT",
    "cbETH-WETH",
    "LUSD-USDC",
    "sUSD-USDC.e",
    "DAI-USDC.e",
    "rETH-wstETH",
    "stETH-WETH",
  ],
};

export const tableName = {
  orderflow: "prodof",
  liquidity: "prodlq",
};

export const pairGroupLabels: {
  "Select all ETH/BTC token pairs": LabelType;
  "Select all stableswap token pairs": LabelType;
  "Select top 100 long-tail token pairs": LabelType;
} = {
  "Select all ETH/BTC token pairs": "ethbtcPairs",
  "Select all stableswap token pairs": "stableswapPairs",
  "Select top 100 long-tail token pairs": "longtailPairs",
};
