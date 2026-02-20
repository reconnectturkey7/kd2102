// Müteahhit Mini Fizibilite (Contractor Feasibility) Calculator Page

import { useState, useEffect } from 'react';
import {
    Building2,
    TrendingUp,
    DollarSign,
    PieChart,
    ArrowRight,
    Info,
    CheckCircle2,
    AlertTriangle,
    Target,
    Share2
} from 'lucide-react';
import CalculatorLayout from '@/components/calculator/CalculatorLayout';
import CalculatorHeader from '@/components/calculator/CalculatorHeader';
import ResultCard from '@/components/calculator/ResultCard';
import LegalDisclaimer from '@/components/calculator/LegalDisclaimer';
import LeadModal from '@/components/calculator/LeadModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCalculatorState } from '@/hooks/useCalculatorState';
import { useSEO } from '@/hooks/useSEO';
import { calculateMuteahhitMini, validateMuteahhitMiniInputs } from '@/lib/calculators/muteahhit-mini';
import { formatCurrency, formatNumber } from '@/lib/calculators/utils';
import { openWhatsApp, generateResultSummary } from '@/lib/whatsapp';
import type { MuteahhitMiniInputs, MuteahhitMiniResults } from '@/types/calculator';

export default function MuteahhitMini() {
    useSEO(
        'Müteahhit Mini Fizibilite Analizi',
        'Müteahhitler için hızlı finansal fizibilite, kar marjı ve yatırım geri dönüşü analizi.'
    );
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [results, setResults] = useState<MuteahhitMiniResults | null>(null);

    // Initialize calculator state
    const { values, updateField } = useCalculatorState<MuteahhitMiniInputs>({
        formType: 'muteahhit-mini',
        initialValues: {
            arsaAlani: 0,
            emsal: 1.5,
            ortakAlanOrani: 25,
            satisFiyati: 0,
            maliyet: 35000,
            hedefKar: 30,
        },
    });

    // Calculate results whenever inputs change
    useEffect(() => {
        const validationErrors = validateMuteahhitMiniInputs(values);

        if (validationErrors.length === 0 && values.arsaAlani > 0 && values.satisFiyati > 0) {
            const calculatedResults = calculateMuteahhitMini(values);
            setResults(calculatedResults);
        } else {
            setResults(null);
        }
    }, [values]);

    return (
        <CalculatorLayout>
            <CalculatorHeader
                title="Müteahhit Mini Fizibilite"
                description="Arsa verileri ve maliyet öngörüleri ile projenizin temel finansal analizini yapın."
                requiredInfo={['Arsa alanı', 'Emsal', 'Tahmini maliyet ve satış fiyatı']}
                estimatedTime="3 dakika"
            />

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Form Inputs */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary-600" />
                            Proje & Arsa Verileri
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="arsaAlani">Arsa Alanı (m²)</Label>
                                <Input
                                    id="arsaAlani"
                                    type="number"
                                    value={values.arsaAlani || ''}
                                    onChange={(e) => updateField('arsaAlani', parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emsal">Emsal (KAKS)</Label>
                                <Input
                                    id="emsal"
                                    type="number"
                                    step="0.1"
                                    value={values.emsal || ''}
                                    onChange={(e) => updateField('emsal', parseFloat(e.target.value) || 0)}
                                    placeholder="1.5"
                                />
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Ortak Alan Artışı (%)</Label>
                                <span className="text-sm font-bold text-primary-600">%{values.ortakAlanOrani}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                step="1"
                                value={values.ortakAlanOrani}
                                onChange={(e) => updateField('ortakAlanOrani', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <p className="text-[10px] text-gray-400">Genellikle %20-%30 arasıdır (Sosyal alanlar, otopark vb.)</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            Finansal Öngörüler
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="maliyet">İnşaat Maliyeti (₺ / m²)</Label>
                                <div className="relative">
                                    <Input
                                        id="maliyet"
                                        type="number"
                                        value={values.maliyet || ''}
                                        onChange={(e) => updateField('maliyet', parseFloat(e.target.value) || 0)}
                                        className="pl-8"
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₺</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="satisFiyati">Tahmini Satış Fiyatı (₺ / m²)</Label>
                                <div className="relative">
                                    <Input
                                        id="satisFiyati"
                                        type="number"
                                        value={values.satisFiyati || ''}
                                        onChange={(e) => updateField('satisFiyati', parseFloat(e.target.value) || 0)}
                                        className="pl-8"
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₺</div>
                                </div>
                            </div>

                            <div className="pt-4 space-y-4 border-t border-gray-50">
                                <div className="flex justify-between items-center">
                                    <Label className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-orange-500" />
                                        Hedef Kar Marjı (%)
                                    </Label>
                                    <span className="text-sm font-bold text-orange-600">%{values.hedefKar}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={values.hedefKar}
                                    onChange={(e) => updateField('hedefKar', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Results Dashboard */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-primary-900/5 border border-primary-50">
                        <h2 className="text-lg font-bold text-primary-900 mb-8 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-primary-600" />
                            Fizibilite Özeti
                        </h2>

                        {results ? (
                            <div className="space-y-8">
                                {/* Physical Area Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-primary-50 rounded-xl p-4">
                                        <div className="text-[10px] uppercase font-bold text-primary-600 mb-1">Toplam İnşaat Alanı</div>
                                        <div className="text-xl font-black text-primary-900">{formatNumber(results.toplamInsaatAlani)} m²</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <div className="text-[10px] uppercase font-bold text-blue-600 mb-1">Satılabilir Brüt Alan</div>
                                        <div className="text-xl font-black text-blue-900">{formatNumber(results.satilabilirBrutAlan)} m²</div>
                                    </div>
                                </div>

                                {/* Financial Totals */}
                                <div className="space-y-4">
                                    <ResultCard
                                        title="Tahmini Toplam Maliyet"
                                        value={formatCurrency(results.toplamMaliyet)}
                                        icon={<DollarSign className="w-5 h-5" />}
                                        variant="default"
                                        subtitle="Tüm inşaat ve ortak alan masrafları dahil"
                                    />
                                    <ResultCard
                                        title="Tahmini Toplam Ciro"
                                        value={formatCurrency(results.toplamCiro)}
                                        icon={<TrendingUp className="w-5 h-5" />}
                                        variant="success"
                                        subtitle="Satılabilir alan üzerinden toplam gelir"
                                    />
                                    <ResultCard
                                        title="Projeksiyon Edilen Kar"
                                        value={formatCurrency(results.toplamCiro - results.toplamMaliyet)}
                                        icon={<DollarSign className="w-5 h-5" />}
                                        variant="info"
                                        subtitle={`Kar Marjı: %${formatNumber(results.karMarji, 1)}`}
                                    />
                                </div>

                                {/* Market Advice */}
                                <div className={`p-4 rounded-xl border flex gap-4 ${results.karMarji >= values.hedefKar ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                                    {results.karMarji >= values.hedefKar ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                                    ) : (
                                        <AlertTriangle className="w-6 h-6 text-orange-600 shrink-0" />
                                    )}
                                    <div className="text-sm leading-tight">
                                        <strong className={results.karMarji >= values.hedefKar ? 'text-green-900' : 'text-orange-900'}>
                                            {results.karMarji >= values.hedefKar ? 'Verimli Proje' : 'Düşük Kar Marjı'}
                                        </strong>
                                        <p className="text-gray-600 mt-1">
                                            {results.karMarji >= values.hedefKar
                                                ? 'Hesaplanan kar marjı hedefinizin üzerinde. Proje uygulanabilir görünüyor.'
                                                : 'Mevcut maliyet/satış dengesi hedef karınızın altında kalmaktadır.'}
                                        </p>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="space-y-3 pt-6 border-t border-gray-100">
                                    <Button
                                        onClick={() => setShowLeadModal(true)}
                                        className="w-full bg-accent hover:bg-accent/90 h-14 text-lg font-bold"
                                        size="lg"
                                    >
                                        Detaylı Teknik Analiz İste
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            const summary = generateResultSummary('muteahhit-mini', results);
                                            openWhatsApp({
                                                ilce: 'Ankara',
                                                mahalle: '',
                                                arsaTipi: 'muteahhit',
                                                sonucOzet: summary,
                                                telefon: '',
                                            });
                                        }}
                                        variant="outline"
                                        className="w-full h-12"
                                        size="lg"
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        WhatsApp ile Paylaş
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-400">
                                <PieChart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Arsa ve fiyat verilerini girerek<br />fizibiliteyi görün</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4">
                        <Info className="w-6 h-6 text-blue-600 shrink-0" />
                        <div className="text-xs text-blue-900 leading-relaxed">
                            Bu araç sadece temel ön fizibilite amaçlıdır. Vergi yükümlülükleri, arsa bedeli, kredi maliyetleri ve operasyonel giderler ayrıca hesaplanmalıdır.
                        </div>
                    </div>
                </div>
            </div>

            <LegalDisclaimer />

            <LeadModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                calculatorType="muteahhit-mini"
                calculatorData={results}
                preFilledData={{}}
            />
        </CalculatorLayout>
    );
}
