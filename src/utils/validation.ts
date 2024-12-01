import { isAddress } from 'ethers';

export const isValidEthereumAddress = (address: string): boolean => {
  return isAddress(address);
};

const STORAGE_KEY = 'faucet_requests';

interface RequestLog {
  ip: string;
  timestamp: number;
  count: number;
}

export const checkRequestLimit = async (): Promise<{
  canRequest: boolean;
  remainingRequests: number;
  timeUntilReset?: string;
}> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const { ip } = await response.json();
    
    const now = Date.now();
    const dayStart = new Date().setHours(0, 0, 0, 0);
    
    const stored = localStorage.getItem(STORAGE_KEY);
    const logs: Record<string, RequestLog> = stored ? JSON.parse(stored) : {};
    
    const userLog = logs[ip];
    
    if (!userLog || userLog.timestamp < dayStart) {
      logs[ip] = { ip, timestamp: now, count: 0 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      return { canRequest: true, remainingRequests: 5 };
    }
    
    if (userLog.count >= 5) {
      const nextDay = new Date(dayStart + 24 * 60 * 60 * 1000);
      const timeUntilReset = new Date(nextDay).toLocaleTimeString();
      return { 
        canRequest: false, 
        remainingRequests: 0,
        timeUntilReset
      };
    }
    
    return { 
      canRequest: true, 
      remainingRequests: 5 - userLog.count 
    };
  } catch (error) {
    console.error('Error checking request limit:', error);
    return { canRequest: false, remainingRequests: 0 };
  }
};

export const incrementRequestCount = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const { ip } = await response.json();
    
    const stored = localStorage.getItem(STORAGE_KEY);
    const logs: Record<string, RequestLog> = stored ? JSON.parse(stored) : {};
    
    if (logs[ip]) {
      logs[ip].count += 1;
      logs[ip].timestamp = Date.now();
    } else {
      logs[ip] = { ip, timestamp: Date.now(), count: 1 };
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error incrementing request count:', error);
  }
};