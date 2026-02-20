import { useState, useEffect } from 'react';
import {
    ArrowRight,
    Calendar,
    Clock,
    CheckCircle2,
    Info,
    Share2,
    AlertTriangle
} from 'lucide-react';
import CalculatorLayout from '@/components/calculator/CalculatorLayout';
import CalculatorHeader from '@/components/calculator/CalculatorHeader';
import LegalDisclaimer from '@/components/calculator/LegalDisclaimer';
import LeadModal from '@/components/calculator/LeadModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCalculatorState } from '@/hooks/useCalculatorState';
import { useSEO } from '@/hooks/useSEO';
import { calculateTakvim } from '@/lib/calculators/takvim';
import { openWhatsApp, generateResultSummary } from '@/lib/whatsapp';
import type { TakvimInputs, TakvimResults, BaslangicDurumu } from '@/types/calculator';

export default function Takvim() {
    useSEO(
        'Kentsel Dönüşüm Süreç Takvimi',
        'Kentsel dönüşüm projenizin başlangıçtan anahtar teslimine kadar ne kadar süreceğini planlayın.'
    );
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [results, setResults] = useState<TakvimResults | null>(null);

    // Initialize calculator state
    const { values, updateField } = useCalculatorState<TakvimInputs>({
        formType: 'takvim',
        initialValues: {
            baslangicDurumu: 'tespit-yok',
            scenario: 'realistic'
        },
    });

    // Calculate results whenever inputs change
    useEffect(() => {
        if (values.baslangicDurumu) {
            const calculatedResults = calculateTakvim(values);
            setResults(calculatedResults);
        } else {
            setResults(null);
        }
    }, [values]);

    const statusOptions: { value: BaslangicDurumu; label: string; description: string }[] = [
        { value: 'tespit-yok', label: 'Henüz Başlamadık', description: 'Risk tespiti yapılmadı, süreç başında.' },
        { value: 'tespit-var', label: 'Bina Riskli İlan Edildi', description: 'Resmi risk raporu alındı.' },
        { value: 'cogunluk-var', label: 'Anlaşma Sağlandı', description: 'Malikler arası 2/3 çoğunluk kararı alındı.' },
        { value: 'ruhsat-alindi', label: 'Proje & Ruhsat Hazır', description: 'Eski bina yıkıldı, yeni proje ruhsatı alındı.' },
    ];

    return (
        <CalculatorLayout>
            <CalculatorHeader
                title="Süreç & Takvim"
                description="Kentsel dönüşüm projenizin ne kadar süreceğini tahmin edin."
                requiredInfo={['Mevcut proje durumu']}
                estimatedTime="1 dakika"
            />

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Form Inputs */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-primary-900 mb-6">Neredesiniz?</h2>

                        <div className="space-y-4">
                            <Label className="mb-2 block">Projenizin Mevcut Durumu</Label>
                            <div className="grid gap-3">
                                {statusOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => updateField('baslangicDurumu', opt.value)}
                                        className={`
                      relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left
                      ${values.baslangicDurumu === opt.value
                                                ? 'border-primary-600 bg-primary-50 ring-4 ring-primary-50'
                                                : 'border-gray-100 bg-white hover:border-primary-200'
                                            }
                    `}
                                    >
                                        <div className={`
                      mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${values.baslangicDurumu === opt.value ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}
                    `}>
                                            {values.baslangicDurumu === opt.value && <CheckCircle2 className="w-4 h-4 text-white" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-primary-900">{opt.label}</div>
                                            <div className="text-xs text-gray-500">{opt.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                            <Info className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-sm text-blue-900 leading-relaxed">
                            <strong>Biliyor muydunuz?</strong> En uzun aşama genellikle "Anlaşma & Karar" sürecidir. Malikler arası uzlaşma ne kadar hızlı sağlanırsa, süreç o kadar kısalır.
                        </div>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-primary-900/5 border border-primary-50">
                        <h2 className="text-lg font-bold text-primary-900 mb-8 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary-600" />
                            Tahmini Proje Takvimi
                        </h2>

                        {results ? (
                            <div className="space-y-8">
                                {/* Total Duration Highlights */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-primary-50 rounded-xl p-4 text-center">
                                        <div className="text-[10px] uppercase font-bold text-primary-600 mb-1">Minimum Süre</div>
                                        <div className="text-2xl font-black text-primary-900">{results.toplamMinAy} Ay</div>
                                    </div>
                                    <div className="bg-orange-50 rounded-xl p-4 text-center border-2 border-orange-100">
                                        <div className="text-[10px] uppercase font-bold text-orange-600 mb-1">Maksimum Süre</div>
                                        <div className="text-2xl font-black text-orange-900">{results.toplamMaxAy} Ay</div>
                                    </div>
                                </div>

                                {/* Vertical Timeline */}
                                <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                                    {results.fazlar.map((faz, idx) => (
                                        <div key={idx} className="relative">
                                            {/* Timeline Dot */}
                                            <div className="absolute -left-[37px] top-1 w-6 h-6 rounded-full bg-white border-4 border-primary-600 z-10" />

                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-primary-900">{faz.name}</h3>
                                                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                                                    {faz.minAy}-{faz.maxAy} Ay
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                {faz.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                                    <p className="text-[10px] text-gray-500 leading-tight">
                                        * Süreler; idari izinler, inşaat mevsimleri ve finansal koşullara göre değişkenlik gösterebilir.
                                    </p>
                                </div>

                                {/* CTA Buttons */}
                                <div className="space-y-3 pt-6 border-t border-gray-100">
                                    <Button
                                        onClick={() => setShowLeadModal(true)}
                                        className="w-full bg-accent hover:bg-accent/90 h-14 text-lg font-bold"
                                        size="lg"
                                    >
                                        Detaylı Süreç Haritasını Al
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            const summary = generateResultSummary('takvim', results);
                                            openWhatsApp({
                                                ilce: 'Ankara',
                                                mahalle: '',
                                                arsaTipi: 'takvim',
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
                            <div className="text-center py-16 text-gray-400">
                                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Mevcut durumu seçin,<br />takvim burada görünecek</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <LegalDisclaimer />

            {/* Lead Modal */}
            <LeadModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                calculatorType="takvim"
                calculatorData={results}
                preFilledData={{}}
            />
        </CalculatorLayout>
    );
}
