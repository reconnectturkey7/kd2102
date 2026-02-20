import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Home, Plus, Trash2, Share2 } from 'lucide-react';
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
import { calculateDaire, validateDaireInputs } from '@/lib/calculators/daire';
import { formatNumber } from '@/lib/calculators/utils';
import { openWhatsApp, generateResultSummary } from '@/lib/whatsapp';
import type { DaireInputs, DaireResults, DaireTipi, EmsalResults } from '@/types/calculator';

export default function Daire() {
    useSEO(
        'Daire Adedi ve Mix Hesaplama',
        'Toplam inşaat alanından kaç daire çıkacağını ve ideal daire karmasını (1+1, 2+1, 3+1) belirleyin.'
    );
    const navigate = useNavigate();
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [results, setResults] = useState<DaireResults | null>(null);

    // Initialize calculator state
    const { values, updateField, loadFromCalculator } = useCalculatorState<DaireInputs>({
        formType: 'daire',
        initialValues: {
            toplamInsaatAlani: 0,
            ortakAlanOrani: 25, // default 25%
            mode: 'single',
            daireBrutM2: 100, // default
            tipler: [
                { name: '2+1', brutM2: 100, oran: 50 },
                { name: '3+1', brutM2: 130, oran: 50 },
            ],
        },
    });

    // Try to load data from Emsal calculator on mount
    useEffect(() => {
        const loaded = loadFromCalculator<EmsalResults>('emsal', (emsalData) => ({
            toplamInsaatAlani: emsalData.toplamInsaatAlani,
        }));

        if (loaded) {
            console.log('Loaded construction area from Emsal calculator');
        }
    }, [loadFromCalculator]);

    // Calculate results whenever inputs change
    useEffect(() => {
        const validationErrors = validateDaireInputs(values);
        setErrors(validationErrors);

        if (validationErrors.length === 0 && values.toplamInsaatAlani > 0) {
            const calculatedResults = calculateDaire(values);
            setResults(calculatedResults);
        } else {
            setResults(null);
        }
    }, [values]);

    const handleAddTip = () => {
        const newTip: DaireTipi = {
            name: `${values.tipler!.length + 1}+1`,
            brutM2: 100,
            oran: 0,
        };
        updateField('tipler', [...(values.tipler || []), newTip]);
    };

    const handleRemoveTip = (index: number) => {
        const newTipler = values.tipler!.filter((_, i) => i !== index);
        updateField('tipler', newTipler);
    };

    const handleUpdateTip = (index: number, field: keyof DaireTipi, value: string | number) => {
        const newTipler = [...values.tipler!];
        newTipler[index] = { ...newTipler[index], [field]: value };
        updateField('tipler', newTipler);
    };

    return (
        <CalculatorLayout>
            <CalculatorHeader
                title="Daire Adedi & Mix"
                description="İnşaat alanından kaç daire çıkar? Hangi mix?"
                requiredInfo={['Toplam inşaat alanı', 'Ortak alan oranı']}
                estimatedTime="2 dakika"
            />

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Form Inputs */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-primary-900 mb-6">Bilgiler</h2>

                    <div className="space-y-6">
                        {/* Total Construction Area */}
                        <div>
                            <Label htmlFor="toplamInsaatAlani">
                                Toplam İnşaat Alanı (m²) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="toplamInsaatAlani"
                                type="number"
                                placeholder="örn. 1200"
                                value={values.toplamInsaatAlani || ''}
                                onChange={(e) => updateField('toplamInsaatAlani', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.01"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Emsal hesaplamasından otomatik yüklendi
                            </p>
                        </div>

                        {/* Common Area Ratio */}
                        <div>
                            <Label htmlFor="ortakAlanOrani">
                                Ortak Alan Oranı (%) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="ortakAlanOrani"
                                type="number"
                                placeholder="25"
                                value={values.ortakAlanOrani}
                                onChange={(e) => updateField('ortakAlanOrani', parseFloat(e.target.value) || 25)}
                                min="0"
                                max="100"
                                step="1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Tipik olarak %20-30 arasındadır
                            </p>
                        </div>

                        {/* Mode Selection */}
                        <div>
                            <Label>Daire Tipi Modu</Label>
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="single"
                                        checked={values.mode === 'single'}
                                        onChange={() => updateField('mode', 'single')}
                                        className="w-4 h-4 text-accent"
                                    />
                                    <span className="text-sm">Tek Tip</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="mix"
                                        checked={values.mode === 'mix'}
                                        onChange={() => updateField('mode', 'mix')}
                                        className="w-4 h-4 text-accent"
                                    />
                                    <span className="text-sm">Karışık (Mix)</span>
                                </label>
                            </div>
                        </div>

                        {/* Single Mode */}
                        {values.mode === 'single' && (
                            <div>
                                <Label htmlFor="daireBrutM2">
                                    Daire Brüt m² <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="daireBrutM2"
                                    type="number"
                                    placeholder="örn. 100"
                                    value={values.daireBrutM2 || ''}
                                    onChange={(e) => updateField('daireBrutM2', parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="1"
                                />
                            </div>
                        )}

                        {/* Mix Mode */}
                        {values.mode === 'mix' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Daire Tipleri</Label>
                                    <Button
                                        onClick={handleAddTip}
                                        variant="outline"
                                        size="sm"
                                        className="h-8"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Tip Ekle
                                    </Button>
                                </div>

                                {values.tipler?.map((tip, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Tip {index + 1}</span>
                                            {values.tipler!.length > 1 && (
                                                <button
                                                    onClick={() => handleRemoveTip(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <Label className="text-xs">Tip Adı</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="2+1"
                                                    value={tip.name}
                                                    onChange={(e) => handleUpdateTip(index, 'name', e.target.value)}
                                                    className="h-9"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Brüt m²</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="100"
                                                    value={tip.brutM2}
                                                    onChange={(e) => handleUpdateTip(index, 'brutM2', parseFloat(e.target.value) || 0)}
                                                    min="0"
                                                    className="h-9"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Oran (%)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="50"
                                                    value={tip.oran}
                                                    onChange={(e) => handleUpdateTip(index, 'oran', parseFloat(e.target.value) || 0)}
                                                    min="0"
                                                    max="100"
                                                    className="h-9"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Total Percentage Check */}
                                {values.tipler && values.tipler.length > 0 && (
                                    <div className="text-xs text-gray-600">
                                        Toplam Oran:{' '}
                                        <span
                                            className={
                                                Math.abs(values.tipler.reduce((sum, t) => sum + t.oran, 0) - 100) < 0.1
                                                    ? 'text-green-600 font-semibold'
                                                    : 'text-red-600 font-semibold'
                                            }
                                        >
                                            %{values.tipler.reduce((sum, t) => sum + t.oran, 0).toFixed(1)}
                                        </span>
                                        {' (hedef: %100)'}
                                    </div>
                                )}
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
                                {/* Saleable Area */}
                                <ResultCard
                                    title="Satılabilir Brüt Alan"
                                    value={`${formatNumber(results.satilabilirBrutAlan)} m²`}
                                    subtitle={`Ortak alanlar hariç (%${values.ortakAlanOrani})`}
                                    icon={<Home className="w-5 h-5" />}
                                    variant="info"
                                />

                                {/* Total Unit Count */}
                                <ResultCard
                                    title="Tahmini Daire Adedi"
                                    value={results.tahminiDaireAdedi}
                                    subtitle="Toplam konut sayısı"
                                    icon={<Home className="w-5 h-5" />}
                                    variant="success"
                                />

                                {/* Type Breakdown (Mix Mode) */}
                                {results.tipBazliAdetler && results.tipBazliAdetler.length > 0 && (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Tip Bazlı Dağılım</h3>
                                        <div className="space-y-2">
                                            {results.tipBazliAdetler.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">{item.tip}</span>
                                                    <span className="font-semibold text-primary-900">
                                                        {item.adet} adet × {item.brutM2} m²
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
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
                                            const summary = generateResultSummary('daire', results);
                                            openWhatsApp({
                                                ilce: 'Ankara',
                                                mahalle: '',
                                                arsaTipi: 'kentsel dönüşüm',
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
                                        onClick={() => navigate('/tools/paylasim')}
                                        variant="outline"
                                        className="w-full h-12"
                                        size="lg"
                                    >
                                        Paylaşım oranları nasıl olur? →
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <Home className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Bilgileri girin, sonuçlar burada görünecek</p>
                            </div>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">💡 Bilgi</h3>
                        <p className="text-sm text-blue-800">
                            Ortak alan oranı asansör, merdiven, koridor gibi alanları içerir. Gerçek daire sayısı
                            mimari projede netleşir.
                        </p>
                    </div>
                </div>
            </div>

            <LegalDisclaimer />

            {/* Lead Modal */}
            <LeadModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                calculatorType="daire"
                calculatorData={results}
                preFilledData={{}}
            />
        </CalculatorLayout>
    );
}
