import { Link } from 'react-router-dom';
import { Calculator, Home, TrendingUp, DollarSign, Calendar, Users, FileText, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';
import MarketRates from '@/components/calculator/MarketRates';

interface ToolCard {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    requiredInfo: string[];
    estimatedTime: string;
    category: 'owner' | 'contractor';
}

const tools: ToolCard[] = [
    // Property Owner Tools
    {
        id: 'emsal',
        title: 'Emsal Hesaplama',
        description: 'TAKS-KAKS değerlerinden toplam inşaat alanını hesaplayın',
        icon: <Calculator className="w-6 h-6" />,
        path: '/tools/emsal',
        requiredInfo: ['Arsa m²', 'KAKS/Emsal'],
        estimatedTime: '1 dk',
        category: 'owner',
    },
    {
        id: 'daire',
        title: 'Daire Adedi & Mix',
        description: 'İnşaat alanından kaç daire çıkar? Hangi mix?',
        icon: <Home className="w-6 h-6" />,
        path: '/tools/daire',
        requiredInfo: ['İnşaat alanı', 'Daire tipi'],
        estimatedTime: '2 dk',
        category: 'owner',
    },
    {
        id: 'paylasim',
        title: 'Paylaşım Simülatörü',
        description: 'Kat karşılığı paylaşım oranlarını hesaplayın',
        icon: <TrendingUp className="w-6 h-6" />,
        path: '/tools/paylasim',
        requiredInfo: ['Satış fiyatı', 'Maliyet'],
        estimatedTime: '3 dk',
        category: 'owner',
    },
    {
        id: 'maliyet',
        title: 'Maliyet Bandı',
        description: '3 senaryo ile maliyet tahmini',
        icon: <DollarSign className="w-6 h-6" />,
        path: '/tools/maliyet',
        requiredInfo: ['İnşaat alanı', 'Kalite'],
        estimatedTime: '1 dk',
        category: 'owner',
    },
    {
        id: 'destek',
        title: 'Kira Yardımı & Destek',
        description: 'Taşınma ve kira desteği bilgilendirmesi',
        icon: <FileText className="w-6 h-6" />,
        path: '/tools/destek',
        requiredInfo: ['İl', 'Statü'],
        estimatedTime: '1 dk',
        category: 'owner',
    },
    {
        id: 'takvim',
        title: 'Süreç & Takvim',
        description: 'Kentsel dönüşüm süreci ne kadar sürer?',
        icon: <Calendar className="w-6 h-6" />,
        path: '/tools/takvim',
        requiredInfo: ['Başlangıç durumu'],
        estimatedTime: '1 dk',
        category: 'owner',
    },
    {
        id: 'arsapayi',
        title: 'Arsa Payı Dağılımı',
        description: 'Bağımsız bölümlere göre arsa payı hesabı',
        icon: <Users className="w-6 h-6" />,
        path: '/tools/arsapayi',
        requiredInfo: ['BB listesi', 'm² bilgisi'],
        estimatedTime: '2 dk',
        category: 'owner',
    },
    // Contractor Tools
    {
        id: 'muteahhit-mini',
        title: 'Mini Fizibilite',
        description: 'Müteahhit için hızlı fizibilite özeti',
        icon: <Building2 className="w-6 h-6" />,
        path: '/tools/muteahhit-mini',
        requiredInfo: ['Arsa', 'Emsal', 'Fiyat', 'Maliyet'],
        estimatedTime: '2 dk',
        category: 'contractor',
    },
];

export default function ToolsHub() {
    useSEO(
        'Hesaplama Merkezi',
        'Kentsel dönüşüm sürecinde mülk sahipleri ve müteahhitler için 1-3 dakikada sonuç veren 8 ana hesaplama aracı.'
    );
    const ownerTools = tools.filter((t) => t.category === 'owner');
    const contractorTools = tools.filter((t) => t.category === 'contractor');

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-primary-900 mb-4">Hesaplama Merkezi</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Duygusal değil, veriye dayalı ön senaryo. 1–3 dakikada sonuç, istersen 72 saatte rapor.
                    </p>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            🔒
                        </div>
                        <span className="font-medium">Spam yok</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            🛡️
                        </div>
                        <span className="font-medium">Veri gizliliği</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            ℹ️
                        </div>
                        <span className="font-medium">Bilgilendirme amaçlı</span>
                    </div>
                </div>

                {/* Live Market Rates Widget */}
                <div className="mb-12">
                    <MarketRates />
                </div>

                {/* Property Owner Tools */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-primary-900 mb-6 font-display">Mülk Sahibi Araçları</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ownerTools.map((tool) => (
                            <ToolCardComponent key={tool.id} tool={tool} />
                        ))}
                    </div>
                </div>

                {/* Contractor Tools */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-primary-900 mb-6">Müteahhit Araçları</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contractorTools.map((tool) => (
                            <ToolCardComponent key={tool.id} tool={tool} />
                        ))}
                    </div>
                </div>

                {/* Mini FAQ */}
                <div className="bg-white rounded-xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-primary-900 mb-6">Sık Sorulan Sorular</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <FAQItem
                            question="Emsal nereden bulunur?"
                            answer="İmar durumu belgenizde veya belediyenin imar müdürlüğünden öğrenebilirsiniz."
                        />
                        <FAQItem
                            question="TAKS şart mı?"
                            answer="Hayır, ancak TAKS varsa daha detaylı kat sayısı tahmini yapabiliriz."
                        />
                        <FAQItem
                            question="Paylaşım neden değişir?"
                            answer="Satış fiyatı, maliyet, kâr hedefi ve piyasa koşullarına göre değişkenlik gösterir."
                        />
                        <FAQItem
                            question="72 saat rapor ne içerir?"
                            answer="Detaylı fizibilite, imar analizi, maliyet kırılımı ve önerilen aksiyon planı."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Tool Card Component
function ToolCardComponent({ tool }: { tool: ToolCard }) {
    return (
        <Link to={tool.path}>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-accent h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                        {tool.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-500">{tool.estimatedTime}</span>
                </div>

                <h3 className="text-lg font-bold text-primary-900 mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{tool.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {tool.requiredInfo.map((info, index) => (
                        <span
                            key={index}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                        >
                            {info}
                        </span>
                    ))}
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90">
                    Hesapla
                </Button>
            </div>
        </Link>
    );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div>
            <h4 className="font-semibold text-primary-900 mb-2">{question}</h4>
            <p className="text-gray-600 text-sm">{answer}</p>
        </div>
    );
}
