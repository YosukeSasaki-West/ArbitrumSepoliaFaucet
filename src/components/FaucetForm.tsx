import React, { useState, useEffect } from 'react';
import { sendTestnetEth } from '../utils/faucet';
import { isValidEthereumAddress, checkRequestLimit, incrementRequestCount } from '../utils/validation';
import toast from 'react-hot-toast';
import { Droplets } from 'lucide-react';

export function FaucetForm() {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [requestStatus, setRequestStatus] = useState<{
    canRequest: boolean;
    remainingRequests: number;
    timeUntilReset?: string;
  }>({ canRequest: true, remainingRequests: 5 });

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkRequestLimit();
      setRequestStatus(status);
    };
    checkStatus();
  }, []);

  useEffect(() => {
    setIsValid(isValidEthereumAddress(address));
  }, [address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !isValid || !requestStatus.canRequest) return;

    setIsLoading(true);
    try {
      await sendTestnetEth(address);
      await incrementRequestCount();
      const newStatus = await checkRequestLimit();
      setRequestStatus(newStatus);
      
      toast.success('テストネットETHの送信に成功しました！');
      setAddress('');
    } catch (error) {
      toast.error('送信に失敗しました。もう一度お試しください。');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            受取用アドレス
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
              ${isValid 
                ? 'border-green-300 focus:ring-green-200 dark:border-green-600 dark:focus:ring-green-800' 
                : 'border-gray-300 focus:ring-gray-200 dark:border-gray-600 dark:focus:ring-gray-800'}
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
            disabled={isLoading || !requestStatus.canRequest}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !isValid || !requestStatus.canRequest}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors
            ${isLoading || !isValid || !requestStatus.canRequest
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'}
            disabled:opacity-50`}
        >
          <Droplets className="w-5 h-5 mr-2" />
          {isLoading ? '送信中...' : 'テストネットETHを取得'}
        </button>
      </form>

      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>残り利用回数: {requestStatus.remainingRequests}回</p>
        {requestStatus.timeUntilReset && (
          <p>制限解除時刻: {requestStatus.timeUntilReset}</p>
        )}
      </div>
    </div>
  );
}