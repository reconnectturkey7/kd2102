import { useState, useEffect } from 'react';
import {
    ArrowRight,
    HandCoins,
    MapPin,
    UserCircle2,
    CalendarClock,
    Info,
    Share2
} from 'lucide-react';
import CalculatorLayout from '@/components/calculator/CalculatorLayout';
import CalculatorHeader from '@/components/calculator/CalculatorHeader';
import ResultCard from '@/components/calculator/ResultCard';
import LegalDisclaimer from '@/components/calculator/LegalDisclaimer';
import LeadModal from '@/components/calculator/LeadModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useCalculatorState } from '@/hooks/useCalculatorState';
import { useSEO } from '@/hooks/useSEO';
import { calculateDestek, validateDestekInputs, RENT_SUPPORT_RATES } from '@/lib/calculators/destek';
import { formatCurrency } from '@/lib/calculators/utils';
import { openWhatsApp, generateResultSummary } from '@/lib/whatsapp';
import type { DestekInputs, DestekResults } from '@/types/calculator';

export default function Destek() {
    useSEO(
        'Kira Yardımı ve Taşınma Desteği',
        'Kentsel dönüşüm sürecinde devletin sağladığı kira yardımı ve taşınma desteği tutarlarını öğrenin.'
    );
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [results, setResults] = useState<DestekResults | null>(null);

    // Initialize calculator state
    const { values, updateField } = useCalculatorState<DestekInputs>({
        formType: 'destek',
        initialValues: {
            il: 'ankara',
            statu: 'malik',
            aySayisi: 18,
            aylikTahminiDestek: 0,
        },
    });

    // Calculate results whenever inputs change
    useEffect(() => {
        const validationErrors = validateDestekInputs(values);
        setErrors(validationErrors);

        if (validationErrors.length === 0) {
            const calculatedResults = calculateDestek(values);
            setResults(calculatedResults);
        } else {
            setResults(null);
        }
    }, [values]);

    const cities = Object.keys(RENT_SUPPORT_RATES).map(c => ({
        value: c,
        label: c.charAt(0).toUpperCase() + c.slice(1)
    }));

    return (
        <CalculatorLayout>
            <CalculatorHeader
                title="Kira Yardımı & Destek"
                description="Devlet tarafından sağlanan kentsel dönüşüm desteğini hesaplayın."
                requiredInfo={['Bulunulan il', 'Hak sahipliği statüsü']}
                estimatedTime="1 dakika"
            />

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Form Inputs */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary-600" />
                            Lokasyon ve Statü Bilgileri
                        </h2>

                        <div className="space-y-6">
                            {/* City Selection */}
                            <div>
                                <Label htmlFor="il">Bulunulan İl</Label>
                                <Select
                                    value={values.il}
                                    onValueChange={(val) => updateField('il', val)}
                                >
                                    <SelectTrigger id="il" className="mt-1">
                                        <SelectValue placeholder="İl seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((city) => (
                                            <SelectItem key={city.value} value={city.value}>
                                                {city.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500 mt-2">
                                    Destek miktarı illere göre Çevre ve Şehircilik Bakanlığı'nca belirlenir.
                                </p>
                            </div>

                            {/* Status Selection */}
                            <div>
                                <Label className="mb-3 block">Hak Sahipliği Statüsü</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => updateField('statu', 'malik')}
                                        className={`
                      flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                      ${values.statu === 'malik'
                                                ? 'border-primary-600 bg-primary-50'
                                                : 'border-gray-100 bg-white hover:border-primary-100'
                                            }
                    `}
                                    >
                                        <UserCircle2 className={`${values.statu === 'malik' ? 'text-primary-600' : 'text-gray-400'}`} />
                                        <span className="font-bold text-sm">Mülk Sahibi</span>
                                    </button>
                                    <button
                                        onClick={() => updateField('statu', 'kiraci')}
                                        className={`
                      flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                      ${values.statu === 'kiraci'
                                                ? 'border-primary-600 bg-primary-50'
                                                : 'border-gray-100 bg-white hover:border-primary-100'
                                            }
                    `}
                                    >
                                        <UserCircle2 className={`${values.statu === 'kiraci' ? 'text-primary-600' : 'text-gray-400'}`} />
                                        <span className="font-bold text-sm">Kiracı</span>
                                    </button>
                                </div>
                            </div>

                            {/* Months Input */}
                            <div>
                                <Label htmlFor="aySayisi">Destek Süresi (Ay)</Label>
                                <div className="relative">
                                    <Input
                                        id="aySayisi"
                                        type="number"
                                        value={values.aySayisi}
                                        onChange={(e) => updateField('aySayisi', parseInt(e.target.value) || 0)}
                                        min="1"
                                        max="48"
                                        className="mt-1 pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Ay</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    * Genellikle mülk sahipleri için 18-48 ay, kiracılar için toplu ödeme yapılır.
                                </p>
                            </div>
                        </div>
                    </div>

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

                {/* Right: Results */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-primary-900/5 border border-primary-50 h-full">
                        <h2 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
                            <HandCoins className="w-5 h-5 text-primary-600" />
                            Destek Özeti
                        </h2>

                        {results ? (
                            <div className="space-y-6">
                                <div className="grid gap-4">
                                    <ResultCard
                                        title="Aylık Kira Desteği"
                                        value={formatCurrency(results.aylikDestek)}
                                        subtitle={`${values.il.toUpperCase()} için belirlenen tutar`}
                                        icon={<HandCoins className="w-5 h-5" />}
                                        variant="info"
                                    />

                                    <ResultCard
                                        title="Toplam Tahmini Destek"
                                        value={formatCurrency(results.toplamDestek)}
                                        subtitle={`${values.aySayisi} ay boyunca ödenecek toplam`}
                                        icon={<CalendarClock className="w-5 h-5" />}
                                        variant="success"
                                    />
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="flex gap-3">
                                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <div className="text-xs text-gray-600 leading-relaxed">
                                            <strong>Not:</strong> Kiracılara genellikle aylık yardım yerine 2 aylık kira yardımı tutarında toplu ödeme yapılır. Riskli yapı tespiti sonrası başvuru yapılması gereklidir.
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="space-y-3 pt-6">
                                    <Button
                                        onClick={() => setShowLeadModal(true)}
                                        className="w-full bg-accent hover:bg-accent/90 h-14 text-lg font-bold"
                                        size="lg"
                                    >
                                        Resmi Başvuru Sürecini Başlat
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            const summary = generateResultSummary('destek', results);
                                            openWhatsApp({
                                                ilce: values.il,
                                                mahalle: '',
                                                arsaTipi: 'kira yardımı',
                                                sonucOzet: summary,
                                                telefon: '',
                                            });
                                        }}
                                        variant="outline"
                                        className="w-full h-12"
                                        size="lg"
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        WhatsApp ile Sor
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 text-gray-400">
                                <HandCoins className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>İl ve statü seçin,<br />destek miktarı burada görünecek</p>
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
                calculatorType="destek"
                calculatorData={results}
                preFilledData={{}}
            />
        </CalculatorLayout>
    );
}
