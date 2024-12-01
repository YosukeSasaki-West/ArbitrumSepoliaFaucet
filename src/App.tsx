import React from 'react';
import { FaucetForm } from './components/FaucetForm';
import { ThemeToggle } from './components/ThemeToggle';
import { Toaster } from 'react-hot-toast';
import { Droplets } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Toaster position="top-right" />
      <ThemeToggle />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Droplets className="w-16 h-16 text-gray-900 dark:text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Arbitrum Sepolia Faucet
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              テストネット用のETHを無料で取得できます。
              開発やテストにご活用ください。
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm">
            <FaucetForm />
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>1回の取得につき0.05 ETHが送信されます</p>
            <p>※テストネット用のETHのため、実際の価値はありません</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;