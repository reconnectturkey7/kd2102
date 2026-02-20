import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, MapPin, Ruler, FileText, User, Phone,
    ArrowRight, ArrowLeft, CheckCircle, Info, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import ankaraData from '@/data/ankara-locations.json';
import { submitToGoogleSheets } from '@/lib/googleSheets';

// Get sorted districts from JSON
const districts = Object.keys(ankaraData).sort((a, b) => a.localeCompare(b, 'tr'));

interface FormData {
    // Step 1: Location
    city: string;
    district: string;
    neighborhood: string;
    addressDetail: string;

    // Step 2: Type
    projectType: 'bina' | 'arsa';

    // Step 3: Data
    ada: string;
    parsel: string;
    area: string;
    emsal: string;
    currentFloors: string;
    buildingAge: string;

    // Step 4: Goal
    goal: 'offer' | 'report' | 'info';

    // Step 5: Contact
    name: string;
    phone: string;
    email: string;
    kvkk: boolean;
    contractorConsent?: boolean;
}

const initialData: FormData = {
    city: 'Ankara',
    district: '',
    neighborhood: '',
    addressDetail: '',
    projectType: 'bina',
    ada: '',
    parsel: '',
    area: '',
    emsal: '',
    currentFloors: '',
    buildingAge: '',
    goal: 'offer',
    name: '',
    phone: '',
    email: '',
    kvkk: false,
    contractorConsent: false,
};

export default function OnAnalizWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialData);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const totalSteps = 5;

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const handleBack = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const validateStep = (currentStep: number) => {
        switch (currentStep) {
            case 1: // Location
                return formData.district && formData.neighborhood;
            case 2: // Type
                return true;
            case 3: // Data
                return formData.area && (formData.projectType === 'bina' ? formData.currentFloors : true);
            case 4: // Goal
                return true;
            case 5: // Contact
                return formData.name && formData.phone && formData.kvkk;
            default:
                return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep(5)) {
            console.log('Form submitted:', formData);

            // Send to Google Sheets
            await submitToGoogleSheets({
                formType: 'on-analiz',
                ...formData,
                timestamp: new Date().toISOString(),
            });

            setIsSubmitted(true);
        }
    };

    if (isSubmitted) {
        return (
            <Card className="w-full bg-white shadow-xl min-h-[400px] flex items-center justify-center border-t-4 border-t-accent">
                <CardContent className="text-center p-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Analiz Talebiniz Alındı</h3>
                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                            Ön analiz raporunuz uzman ekibimiz tarafından hazırlanmaya başlandı.
                            <strong> 72 saat içinde</strong> size WhatsApp üzerinden dönüş yapılacaktır.
                        </p>
                        <div className="space-y-3">
                            <a
                                href={`https://wa.me/905336820942?text=Merhaba,%20${formData.district}%20${formData.neighborhood}%20bölgesindeki%20analiz%20talebim%20hakkında%20bilgi%20almak%20istiyorum.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full"
                            >
                                <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                                    WhatsApp'tan Hızlandır
                                </Button>
                            </a>
                            <Button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setStep(1);
                                    setFormData(initialData);
                                }}
                                variant="outline"
                                className="w-full"
                            >
                                Yeni Talep Oluştur
                            </Button>
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full bg-white text-gray-900 shadow-2xl border-t-4 border-t-accent overflow-hidden flex flex-col h-full max-h-[650px]">
            <CardHeader className="bg-slate-50 border-b border-gray-100 p-4 shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <CardTitle className="flex items-center gap-2 text-lg text-primary-900">
                        <Building2 className="w-5 h-5 text-accent" />
                        Ücretsiz Ön Analiz
                    </CardTitle>
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                        Adım {step}/{totalSteps}
                    </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </CardHeader>

            <CardContent className="p-6 overflow-y-auto grow">
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="grow"
                        >
                            {step === 1 && (
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg text-gray-900">Mülk Konumu</h3>
                                        <p className="text-sm text-gray-500">Analiz yapılacak mülkün konumu nedir?</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">İl</Label>
                                            <Select disabled value="Ankara">
                                                <SelectTrigger className="mt-1 bg-gray-50">
                                                    <SelectValue placeholder="İl Seçin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Ankara">Ankara</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="district">İlçe <span className="text-accent">*</span></Label>
                                            <Select
                                                value={formData.district}
                                                onValueChange={(value) => setFormData({ ...formData, district: value, neighborhood: '' })}
                                            >
                                                <SelectTrigger className="mt-1 ring-offset-0 focus:ring-accent">
                                                    <SelectValue placeholder="Seçiniz" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    {districts.map((d) => (
                                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="neighborhood">Mahalle <span className="text-accent">*</span></Label>
                                        <Select
                                            value={formData.neighborhood}
                                            onValueChange={(value) => setFormData({ ...formData, neighborhood: value })}
                                            disabled={!formData.district}
                                        >
                                            <SelectTrigger className="mt-1 ring-offset-0 focus:ring-accent">
                                                <SelectValue placeholder={formData.district ? "Mahalle Seçiniz" : "Önce İlçe Seçiniz"} />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[200px]">
                                                {formData.district && (ankaraData as Record<string, string[]>)[formData.district]?.map((m) => (
                                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Adres Detayı (İsteğe Bağlı)</Label>
                                        <Textarea
                                            id="address"
                                            placeholder="Cadde, sokak, site adı vb."
                                            className="mt-1 resize-none min-h-[80px]"
                                            value={formData.addressDetail}
                                            onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg text-gray-900">Proje Tipi</h3>
                                        <p className="text-sm text-gray-500">Mülkünüzün mevcut durumu nedir?</p>
                                    </div>

                                    <RadioGroup
                                        value={formData.projectType}
                                        onValueChange={(value: 'bina' | 'arsa') => setFormData({ ...formData, projectType: value })}
                                        className="grid grid-cols-1 gap-4"
                                    >
                                        <Label
                                            htmlFor="type-bina"
                                            className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition-all hover:bg-gray-50 ${formData.projectType === 'bina' ? 'border-accent ring-1 ring-accent bg-accent/5' : 'border-gray-200'}`}
                                        >
                                            <RadioGroupItem value="bina" id="type-bina" className="sr-only" />
                                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                                <Building2 className="w-6 h-6" />
                                            </div>
                                            <div className="grow">
                                                <div className="font-semibold text-gray-900">Bina Dönüşümü</div>
                                                <div className="text-sm text-gray-500">Mevcut binanızın yenilenmesi</div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${formData.projectType === 'bina' ? 'border-accent bg-accent text-white' : 'border-gray-300'}`}>
                                                {formData.projectType === 'bina' && <CheckCircle className="w-4 h-4" />}
                                            </div>
                                        </Label>

                                        <Label
                                            htmlFor="type-arsa"
                                            className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition-all hover:bg-gray-50 ${formData.projectType === 'arsa' ? 'border-accent ring-1 ring-accent bg-accent/5' : 'border-gray-200'}`}
                                        >
                                            <RadioGroupItem value="arsa" id="type-arsa" className="sr-only" />
                                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div className="grow">
                                                <div className="font-semibold text-gray-900">Arsa Projesi</div>
                                                <div className="text-sm text-gray-500">Boş arsa üzerine inşaat</div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${formData.projectType === 'arsa' ? 'border-accent bg-accent text-white' : 'border-gray-300'}`}>
                                                {formData.projectType === 'arsa' && <CheckCircle className="w-4 h-4" />}
                                            </div>
                                        </Label>
                                    </RadioGroup>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg text-gray-900">Tapu & Yapı Bilgileri</h3>
                                        <p className="text-sm text-gray-500">Daha doğru analiz için bildiğiniz verileri girin.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="ada">Ada No</Label>
                                            <Input
                                                id="ada"
                                                placeholder="Örn: 101"
                                                className="mt-1"
                                                value={formData.ada}
                                                onChange={(e) => setFormData({ ...formData, ada: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="parsel">Parsel No</Label>
                                            <Input
                                                id="parsel"
                                                placeholder="Örn: 5"
                                                className="mt-1"
                                                value={formData.parsel}
                                                onChange={(e) => setFormData({ ...formData, parsel: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="area">Arsa Alanı (m²) <span className="text-accent">*</span></Label>
                                        <div className="relative mt-1">
                                            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="area"
                                                type="number"
                                                placeholder="Örn: 500"
                                                className="pl-10"
                                                value={formData.area}
                                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {formData.projectType === 'bina' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="floors">Mevcut Kat</Label>
                                                <Select
                                                    value={formData.currentFloors}
                                                    onValueChange={(value) => setFormData({ ...formData, currentFloors: value })}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Seçiniz" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                                                            <SelectItem key={n} value={n.toString()}>{n} Kat</SelectItem>
                                                        ))}
                                                        <SelectItem value="13+">13+ Kat</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="age">Bina Yaşı</Label>
                                                <Select
                                                    value={formData.buildingAge}
                                                    onValueChange={(value) => setFormData({ ...formData, buildingAge: value })}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Seçiniz" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0-10">0-10 Yıl</SelectItem>
                                                        <SelectItem value="11-20">11-20 Yıl</SelectItem>
                                                        <SelectItem value="21-30">21-30 Yıl</SelectItem>
                                                        <SelectItem value="31+">31+ Yıl</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg text-gray-900">Başvuru Amacınız</h3>
                                        <p className="text-sm text-gray-500">Size en uygun hizmeti sunabilmemiz için hedefiniz nedir?</p>
                                    </div>

                                    <RadioGroup
                                        value={formData.goal}
                                        onValueChange={(value: 'offer' | 'report' | 'info') => setFormData({ ...formData, goal: value })}
                                        className="space-y-3"
                                    >
                                        {[
                                            { id: 'offer', label: 'Teklif Almak İstiyorum', desc: 'Müteahhitlik hizmetleri için fiyat/oran teklifi', icon: FileText },
                                            { id: 'report', label: 'Detaylı Rapor İstiyorum', desc: 'Mülkümün potansiyelini ve değerini öğrenmek', icon: CheckCircle },
                                            { id: 'info', label: 'Sadece Bilgi Alacağım', desc: 'Kentsel dönüşüm süreci hakkında genel bilgi', icon: Info },
                                        ].map((item) => (
                                            <Label
                                                key={item.id}
                                                htmlFor={`goal-${item.id}`}
                                                className={`flex items-start gap-4 border rounded-xl p-4 cursor-pointer transition-all hover:bg-gray-50 ${formData.goal === item.id ? 'border-accent ring-1 ring-accent bg-accent/5' : 'border-gray-200'}`}
                                            >
                                                <RadioGroupItem value={item.id} id={`goal-${item.id}`} className="sr-only" />
                                                <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${formData.goal === item.id ? 'border-accent bg-accent text-white' : 'border-gray-300'}`}>
                                                    {formData.goal === item.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{item.label}</div>
                                                    <div className="text-sm text-gray-500">{item.desc}</div>
                                                </div>
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg text-gray-900">İletişim Bilgileri</h3>
                                        <p className="text-sm text-gray-500">Analiz raporunuzu iletebilmemiz için bilgilerinizi girin.</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="fullname">Ad Soyad <span className="text-accent">*</span></Label>
                                        <div className="relative mt-1">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="fullname"
                                                placeholder="Adınız ve Soyadınız"
                                                className="pl-10"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="contact-phone">Telefon (WhatsApp) <span className="text-accent">*</span></Label>
                                        <div className="relative mt-1">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="contact-phone"
                                                type="tel"
                                                placeholder="05XX XXX XX XX"
                                                className="pl-10"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="contact-email">E-posta (İsteğe Bağlı)</Label>
                                        <div className="relative mt-1">
                                            <Input
                                                id="contact-email"
                                                type="email"
                                                placeholder="ornek@email.com"
                                                className="pl-3"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <Checkbox
                                            id="kvkk"
                                            checked={formData.kvkk}
                                            onCheckedChange={(checked) => setFormData({ ...formData, kvkk: checked as boolean })}
                                            className="mt-1 border-gray-400 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                                        />
                                        <Label htmlFor="kvkk" className="text-xs text-gray-600 leading-normal cursor-pointer">
                                            Mülkümle ilgili kentsel dönüşüm analizi ve değerleme raporunun hazırlanması, tarafıma teklif sunulması amacıyla kişisel verilerimin işlenmesini onaylıyorum.
                                        </Label>
                                    </div>

                                    <div className="flex items-start gap-3 mt-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <Checkbox
                                            id="contractorConsent"
                                            checked={formData.contractorConsent}
                                            onCheckedChange={(checked) => setFormData({ ...formData, contractorConsent: checked as boolean })}
                                            className="mt-1 border-blue-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <Label htmlFor="contractorConsent" className="text-xs text-blue-800 leading-normal cursor-pointer">
                                            <strong>Fırsat Havuzu:</strong> Mülk bilgilerimin (isim, telefon ve tam adres <u>hariç</u>) anlaşmalı müteahhitlerle paylaşılmasını ve teklif almayı kabul ediyorum.
                                        </Label>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 shrink-0">
                        {step > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                className="w-1/3 border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Geri
                            </Button>
                        )}

                        {step < totalSteps ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                disabled={!validateStep(step)}
                                className={`flex-1 bg-accent hover:bg-accent-600 text-white font-bold shadow-md shadow-accent/20 ${step === 1 ? 'w-full' : ''}`}
                            >
                                Devam Et
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={!validateStep(step)}
                                className="flex-1 bg-primary hover:bg-primary-800 text-white font-bold shadow-lg"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Analizi Başlat
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
