export const INFURA_ARBITRUM_SEPOLIA_RPC_KEY = import.meta.env.VITE_INFURA_ARBITRUM_SEPOLIA_RPC_KEY;
export const FAUCET_MASTER_PRIVATE_KEY = import.meta.env.VITE_FAUCET_MASTER_PRIVATE_KEY;

if (!INFURA_ARBITRUM_SEPOLIA_RPC_KEY || !FAUCET_MASTER_PRIVATE_KEY) {
  throw new Error('Required environment variables are not set');
}