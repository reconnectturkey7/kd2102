import { useState, useEffect } from 'react';
import {
    Trash2,
    Table,
    Calculator,
    Share2,
    PlusCircle,
    AlertCircle
} from 'lucide-react';
import CalculatorLayout from '@/components/calculator/CalculatorLayout';
import CalculatorHeader from '@/components/calculator/CalculatorHeader';
import LegalDisclaimer from '@/components/calculator/LegalDisclaimer';
import LeadModal from '@/components/calculator/LeadModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCalculatorState } from '@/hooks/useCalculatorState';
import { useSEO } from '@/hooks/useSEO';
import { calculateArsaPayi } from '@/lib/calculators/arsapayi';
import { formatNumber } from '@/lib/calculators/utils';
import { openWhatsApp, generateResultSummary } from '@/lib/whatsapp';
import type { ArsaPayiInputs, ArsaPayiResults } from '@/types/calculator';

export default function ArsaPayi() {
    useSEO(
        'Arsa Payı Dağılımı Hesaplama',
        'Bağımsız bölümlerin büyüklüklerine göre matematiksel arsa payı dağılımını hesaplayın.'
    );
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [results, setResults] = useState<ArsaPayiResults | null>(null);

    // Initialize calculator state
    const { values, updateField } = useCalculatorState<ArsaPayiInputs>({
        formType: 'arsapayi',
        initialValues: {
            bagimsisBolumler: [
                { no: '1', brutM2: 0 },
                { no: '2', brutM2: 0 },
            ],
            toplamArsaPayiOlcegi: 10000,
        },
    });

    // Calculate results whenever inputs change
    useEffect(() => {
        if (values.bagimsisBolumler.some(bb => bb.brutM2 > 0)) {
            const calculatedResults = calculateArsaPayi(values);
            setResults(calculatedResults);
        } else {
            setResults(null);
        }
    }, [values]);

    const addUnit = () => {
        const nextNo = values.bagimsisBolumler.length + 1;
        updateField('bagimsisBolumler', [
            ...values.bagimsisBolumler,
            { no: nextNo.toString(), brutM2: 0 }
        ]);
    };

    const removeUnit = (index: number) => {
        const newUnits = values.bagimsisBolumler.filter((_, i) => i !== index);
        updateField('bagimsisBolumler', newUnits);
    };

    const updateUnit = (index: number, field: 'no' | 'brutM2', value: any) => {
        const newUnits = [...values.bagimsisBolumler];
        newUnits[index] = { ...newUnits[index], [field]: value };
        updateField('bagimsisBolumler', newUnits);
    };

    return (
        <CalculatorLayout>
            <CalculatorHeader
                title="Arsa Payı Dağılımı"
                description="Bağımsız bölümlerin büyüklüklerine göre matematiksel arsa payı dağılımını hesaplayın."
                requiredInfo={['Bağımsız bölüm m² leri', 'Arsa payı ölçeği']}
                estimatedTime="2 dakika"
            />

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Inputs */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-primary-900">Bağımsız Bölümler</h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={addUnit}
                                className="text-primary-600 border-primary-100 hover:bg-primary-50"
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Yeni Ekle
                            </Button>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {values.bagimsisBolumler.map((bb, index) => (
                                <div key={index} className="flex items-end gap-3 p-3 rounded-lg border border-gray-50 bg-gray-50/30">
                                    <div className="flex-1">
                                        <Label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Bölüm No</Label>
                                        <Input
                                            value={bb.no}
                                            onChange={(e) => updateUnit(index, 'no', e.target.value)}
                                            placeholder="Örn: 1"
                                            className="bg-white h-10"
                                        />
                                    </div>
                                    <div className="flex-[2]">
                                        <Label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Brüt Alan (m²)</Label>
                                        <Input
                                            type="number"
                                            value={bb.brutM2 || ''}
                                            onChange={(e) => updateUnit(index, 'brutM2', parseFloat(e.target.value) || 0)}
                                            placeholder="0.00"
                                            className="bg-white h-10"
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeUnit(index)}
                                        disabled={values.bagimsisBolumler.length <= 1}
                                        className="text-gray-400 hover:text-red-500 h-10 w-10 shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <Label htmlFor="olcek" className="mb-2 block">Arsa Payı Ölçeği (Payda)</Label>
                            <div className="flex gap-2">
                                {[100, 1000, 10000, 24000].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => updateField('toplamArsaPayiOlcegi', val)}
                                        className={`
                      flex-1 py-2 px-3 rounded-lg border-2 text-xs font-bold transition-all
                      ${values.toplamArsaPayiOlcegi === val
                                                ? 'border-primary-600 bg-primary-50 text-primary-600'
                                                : 'border-gray-100 text-gray-500 hover:border-gray-200'}
                    `}
                                    >
                                        {val}
                                    </button>
                                ))}
                                <div className="flex-[2]">
                                    <Input
                                        type="number"
                                        value={values.toplamArsaPayiOlcegi}
                                        onChange={(e) => updateField('toplamArsaPayiOlcegi', parseFloat(e.target.value) || 0)}
                                        placeholder="Diğer..."
                                        className="h-9"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-4">
                        <AlertCircle className="w-6 h-6 text-orange-500 shrink-0" />
                        <div className="text-sm text-orange-900 leading-tight">
                            <strong>Önemli:</strong> Arsa payları Tapu Müdürlüğü kayıtlarında yer alan "resmi" değerlerdir. Burada yapılan hesaplama sadece matematiksel dağılımı gösterir.
                        </div>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-primary-900/5 border border-primary-50 sticky top-24">
                        <h2 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
                            <Table className="w-5 h-5 text-primary-600" />
                            Dağılım Analizi
                        </h2>

                        {results && results.sonuclar.length > 0 ? (
                            <div className="space-y-6">
                                {/* Summary Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-primary-50 rounded-xl p-4 text-center">
                                        <div className="text-[10px] uppercase font-bold text-primary-600 mb-1">Toplam Alan</div>
                                        <div className="text-xl font-black text-primary-900">{formatNumber(results.toplamM2)} m²</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                                        <div className="text-[10px] uppercase font-bold text-gray-600 mb-1">Ölçek</div>
                                        <div className="text-xl font-black text-gray-900">/ {results.inputs.toplamArsaPayiOlcegi}</div>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-hidden rounded-xl border border-gray-100">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-100 font-bold text-primary-900">
                                            <tr>
                                                <th className="px-4 py-3">No</th>
                                                <th className="px-4 py-3">Alan</th>
                                                <th className="px-4 py-3">Arsa Payı</th>
                                                <th className="px-4 py-3">Oran</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {results.sonuclar.map((s, i) => (
                                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-4 py-3 font-medium">{s.no}</td>
                                                    <td className="px-4 py-3 text-gray-600">{s.brutM2} m²</td>
                                                    <td className="px-4 py-3 font-bold text-primary-700">{s.arsaPayi}</td>
                                                    <td className="px-4 py-3 text-gray-500">%{formatNumber(s.oran, 2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* CTA Buttons */}
                                <div className="space-y-3 pt-6 border-t border-gray-100">
                                    <Button
                                        onClick={() => setShowLeadModal(true)}
                                        className="w-full bg-accent hover:bg-accent/90 h-14 text-lg font-bold"
                                        size="lg"
                                    >
                                        Detaylı Analiz İste
                                        <Calculator className="w-5 h-5 ml-2" />
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            const summary = generateResultSummary('arsapayi', results);
                                            openWhatsApp({
                                                ilce: 'Ankara',
                                                mahalle: '',
                                                arsaTipi: 'arsapayi',
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
                                <Table className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Alan verilerini girerek<br />analizi başlatın</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <LegalDisclaimer />

            <LeadModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                calculatorType="arsapayi"
                calculatorData={results}
                preFilledData={{}}
            />
        </CalculatorLayout>
    );
}
