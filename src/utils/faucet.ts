import { ethers } from 'ethers';
import { INFURA_ARBITRUM_SEPOLIA_RPC_KEY, FAUCET_MASTER_PRIVATE_KEY } from '../config/env';

const FAUCET_AMOUNT = ethers.parseEther('0.05');

export async function sendTestnetEth(recipientAddress: string) {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://sepolia.infura.io/v3/${INFURA_ARBITRUM_SEPOLIA_RPC_KEY}`
    );
    
    const wallet = new ethers.Wallet(FAUCET_MASTER_PRIVATE_KEY, provider);
    
    const tx = await wallet.sendTransaction({
      to: recipientAddress,
      value: FAUCET_AMOUNT
    });
    
    return await tx.wait();
  } catch (error) {
    console.error('Faucet error:', error);
    throw error;
  }
}