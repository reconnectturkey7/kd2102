import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Layers, TrendingUp, Share2 } from 'lucide-react';
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
import { calculateEmsal, validateEmsalInputs } from '@/lib/calculators/emsal';
import { formatNumber } from '@/lib/calculators/utils';
import { openWhatsApp, generateResultSummary } from '@/lib/whatsapp';
import type { EmsalInputs, EmsalResults } from '@/types/calculator';

export default function Emsal() {
    useSEO(
        'Emsal (TAKS-KAKS) Hesaplama',
        'Arsanızın TAKS-KAKS değerlerine göre toplam inşaat alanını ve kat sayısını hesaplayın.'
    );
    const navigate = useNavigate();
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [results, setResults] = useState<EmsalResults | null>(null);

    // Initialize calculator state
    const { values, updateField } = useCalculatorState<EmsalInputs>({
        formType: 'emsal',
        initialValues: {
            arsaAlani: 0,
            kaks: undefined,
            taks: undefined,
            katYuksekligi: 3, // default floor height
        },
    });

    // Calculate results whenever inputs change
    useEffect(() => {
        const validationErrors = validateEmsalInputs(values);
        setErrors(validationErrors);

        if (validationErrors.length === 0 && values.arsaAlani > 0 && values.kaks) {
            const calculatedResults = calculateEmsal(values);
            setResults(calculatedResults);
        } else {
            setResults(null);
        }
    }, [values]);

    const handleKaksUnknown = () => {
        // Redirect to lead form if user doesn't know KAKS
        navigate('/on-analiz');
    };

    const handleTaksUnknown = () => {
        // Just clear TAKS field
        updateField('taks', undefined);
    };

    return (
        <CalculatorLayout>
            <CalculatorHeader
                title="Emsal Hesaplama"
                description="TAKS ve KAKS değerlerinden toplam inşaat alanını hesaplayın"
                requiredInfo={['Arsa m²', 'KAKS/Emsal']}
                estimatedTime="1 dakika"
            />

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Form Inputs */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-primary-900 mb-6">Bilgiler</h2>

                    <div className="space-y-6">
                        {/* Location (Optional) */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="il">İl (Opsiyonel)</Label>
                                <Input
                                    id="il"
                                    type="text"
                                    placeholder="Ankara"
                                    value={values.il || ''}
                                    onChange={(e) => updateField('il', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="ilce">İlçe</Label>
                                <Input
                                    id="ilce"
                                    type="text"
                                    placeholder="Çankaya"
                                    value={values.ilce || ''}
                                    onChange={(e) => updateField('ilce', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="mahalle">Mahalle</Label>
                                <Input
                                    id="mahalle"
                                    type="text"
                                    placeholder="Konutkent"
                                    value={values.mahalle || ''}
                                    onChange={(e) => updateField('mahalle', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Land Area */}
                        <div>
                            <Label htmlFor="arsaAlani">
                                Arsa Alanı (m²) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="arsaAlani"
                                type="number"
                                placeholder="örn. 1000"
                                value={values.arsaAlani || ''}
                                onChange={(e) => updateField('arsaAlani', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* KAKS/Emsal */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label htmlFor="kaks">
                                    KAKS / Emsal <span className="text-red-500">*</span>
                                </Label>
                                <button
                                    onClick={handleKaksUnknown}
                                    className="text-xs text-accent hover:underline"
                                >
                                    Bilmiyorum
                                </button>
                            </div>
                            <Input
                                id="kaks"
                                type="number"
                                placeholder="örn. 1.20"
                                value={values.kaks || ''}
                                onChange={(e) => updateField('kaks', parseFloat(e.target.value) || undefined)}
                                min="0"
                                step="0.01"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                İmar durumu belgenizde veya belediyeden öğrenebilirsiniz
                            </p>
                        </div>

                        {/* TAKS (Optional) */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label htmlFor="taks">TAKS (Opsiyonel)</Label>
                                <button
                                    onClick={handleTaksUnknown}
                                    className="text-xs text-accent hover:underline"
                                >
                                    Bilmiyorum
                                </button>
                            </div>
                            <Input
                                id="taks"
                                type="number"
                                placeholder="örn. 0.30"
                                value={values.taks || ''}
                                onChange={(e) => updateField('taks', parseFloat(e.target.value) || undefined)}
                                min="0"
                                max="1"
                                step="0.01"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                TAKS varsa daha detaylı kat sayısı tahmini yapabiliriz
                            </p>
                        </div>

                        {/* Floor Height (Optional) */}
                        {values.taks && (
                            <div>
                                <Label htmlFor="katYuksekligi">Kat Yüksekliği (m)</Label>
                                <Input
                                    id="katYuksekligi"
                                    type="number"
                                    placeholder="3"
                                    value={values.katYuksekligi || 3}
                                    onChange={(e) => updateField('katYuksekligi', parseFloat(e.target.value) || 3)}
                                    min="2.5"
                                    max="5"
                                    step="0.1"
                                />
                            </div>
                        )}

                        {/* Validation Errors */}
                        {errors.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <ul className="text-sm text-red-600 space-y-1">
                                    {errors.map((error, index) => (
                                        <li key={index}>• {error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Results */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-primary-900 mb-6">Sonuçlar</h2>

                        {results ? (
                            <div className="space-y-4">
                                {/* Total Construction Area */}
                                <ResultCard
                                    title="Toplam İnşaat Hakkı"
                                    value={`${formatNumber(results.toplamInsaatAlani)} m²`}
                                    subtitle="Emsale dahil toplam inşaat alanı"
                                    icon={<Building2 className="w-5 h-5" />}
                                    variant="success"
                                />

                                {/* Base Footprint */}
                                {results.tabanOturumu ? (
                                    <ResultCard
                                        title="Tahmini Taban Oturumu"
                                        value={`${formatNumber(results.tabanOturumu)} m²`}
                                        subtitle="Zemin kat alanı (TAKS)"
                                        icon={<Layers className="w-5 h-5" />}
                                        variant="info"
                                    />
                                ) : (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <p className="text-sm text-orange-800">
                                            <strong>TAKS girilmedi.</strong> TAKS değeri eklerseniz taban oturumu ve kat
                                            sayısı tahmini yapabiliriz.
                                        </p>
                                    </div>
                                )}

                                {/* Estimated Floor Count */}
                                {results.tahminiKatSayisi && (
                                    <ResultCard
                                        title="Tahmini Kat Sayısı"
                                        value={results.tahminiKatSayisi}
                                        subtitle="Yaklaşık kat adedi"
                                        icon={<TrendingUp className="w-5 h-5" />}
                                        variant="default"
                                    />
                                )}

                                {/* CTA Buttons */}
                                <div className="space-y-3 pt-4">
                                    <Button
                                        onClick={() => setShowLeadModal(true)}
                                        className="w-full bg-accent hover:bg-accent/90 h-12"
                                        size="lg"
                                    >
                                        Bu sonucu 72 saatte rapora bağlayalım
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            const summary = generateResultSummary('emsal', results);
                                            openWhatsApp({
                                                ilce: values.ilce || 'Ankara',
                                                mahalle: values.mahalle || '',
                                                arsaTipi: 'kentsel dönüşüm',
                                                arsaM2: values.arsaAlani,
                                                emsal: values.kaks,
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

                                    <Button
                                        onClick={() => navigate('/tools/daire')}
                                        variant="outline"
                                        className="w-full h-12"
                                        size="lg"
                                    >
                                        Kaç daire çıkar? →
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Bilgileri girin, sonuçlar burada görünecek</p>
                            </div>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">💡 Bilgi</h3>
                        <p className="text-sm text-blue-800">
                            Bu sonuç bilgilendirme amaçlıdır. Plan notları, çekme mesafeleri, emsale dahil/harici
                            alanlar ve ruhsat projesiyle netleşir.
                        </p>
                    </div>
                </div>
            </div>

            <LegalDisclaimer />

            {/* Lead Modal */}
            <LeadModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                calculatorType="emsal"
                calculatorData={results}
                preFilledData={{
                    ilce: values.ilce,
                    mahalle: values.mahalle,
                }}
            />
        </CalculatorLayout>
    );
}
