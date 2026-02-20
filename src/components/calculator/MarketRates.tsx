import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Euro, Coins, Landmark, RefreshCcw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Rate {
    Kod: string;
    Alis: string;
    Satis: string;
    GuncellenmeZamani: string;
}

export default function MarketRates() {
    const [rates, setRates] = useState<Rate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<string>('');

    const fetchRates = async () => {
        try {
            setLoading(true);
            setError(false);

            // Use Truncgil Financial API (more stable and CORS friendly)
            const response = await fetch('https://finans.truncgil.com/v3/today.json');
            const data = await response.json();

            if (!data) throw new Error('No data received');

            const allRates: Rate[] = [
                {
                    Kod: 'USD',
                    Alis: data['USD']?.Buying || '0',
                    Satis: data['USD']?.Selling || '0',
                    GuncellenmeZamani: data['Update_Date']
                },
                {
                    Kod: 'EUR',
                    Alis: data['EUR']?.Buying || '0',
                    Satis: data['EUR']?.Selling || '0',
                    GuncellenmeZamani: data['Update_Date']
                },
                {
                    Kod: 'GBP',
                    Alis: data['GBP']?.Buying || '0',
                    Satis: data['GBP']?.Selling || '0',
                    GuncellenmeZamani: data['Update_Date']
                },
                {
                    Kod: 'GA',
                    Alis: data['gram-altin']?.Buying || '0',
                    Satis: data['gram-altin']?.Selling || '0',
                    GuncellenmeZamani: data['Update_Date']
                }
            ];

            setRates(allRates);
            setLastUpdate(data['Update_Date']);
            setLoading(false);
        } catch (err) {
            console.error('Market rates fetch failed:', err);
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
        const interval = setInterval(fetchRates, 5 * 60 * 1000); // 5 minutes
        return () => clearInterval(interval);
    }, []);

    const iconMap: Record<string, any> = {
        'USD': <DollarSign className="w-4 h-4" />,
        'EUR': <Euro className="w-4 h-4" />,
        'GBP': <Landmark className="w-4 h-4" />,
        'GA': <Coins className="w-4 h-4" />,
    };

    const labelMap: Record<string, string> = {
        'USD': 'Dolar',
        'EUR': 'Euro',
        'GBP': 'Sterlin',
        'GA': 'Gram Altın',
    };

    if (error) {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span className="text-sm text-amber-900 font-medium">Canlı piyasa verileri şu an yüklenemiyor.</span>
                </div>
                <button onClick={fetchRates} className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                    <RefreshCcw className="w-3 h-3" /> Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-primary-900 px-6 py-2 flex justify-between items-center">
                <div className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold uppercase tracking-wider">Canlı Piyasa Verileri</span>
                </div>
                {lastUpdate && (
                    <span className="text-[10px] text-primary-300 font-medium">{lastUpdate} Güncellemesi</span>
                )}
            </div>

            <div className="p-4 overflow-x-auto">
                <div className="flex gap-4 min-w-max md:grid md:grid-cols-4 md:gap-6">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="animate-pulse space-y-2 py-2 px-4 border-r md:border-r last:border-0 border-gray-100 min-w-[120px]">
                                <div className="h-3 w-12 bg-gray-200 rounded"></div>
                                <div className="h-5 w-20 bg-gray-100 rounded"></div>
                            </div>
                        ))
                    ) : (
                        rates.map((rate) => (
                            <motion.div
                                key={rate.Kod}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col py-2 px-4 border-r last:border-0 border-gray-100 min-w-[130px]"
                            >
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="p-1 bg-primary-50 rounded text-primary-600">
                                        {iconMap[rate.Kod]}
                                    </div>
                                    <span className="text-xs font-bold text-gray-500">{labelMap[rate.Kod]}</span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-sm font-black text-primary-900">
                                        ₺{rate.Satis}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-gray-400 font-medium">Alış: ₺{rate.Alis}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
