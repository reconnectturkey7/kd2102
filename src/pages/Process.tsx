import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Process() {
    const steps = [
        {
            no: '01',
            title: 'Analiz & Karar',
            desc: 'Mülkün mevcut durumu, imar hakları ve dönüşüm potansiyeli raporlanır. Hak sahipleri ile paylaşım modeli ve beklentiler netleştirilir.',
            details: ['İmar Durumu Sorgulama', 'Emsal Hesaplaması', 'Riskli Yapı Tespiti']
        },
        {
            no: '02',
            title: 'Proje & Teklif',
            desc: 'Belirlenen kriterlere uygun avan proje hazırlatılır ve teknik şartname oluşturulur. Seçkin müteahhit firmalardan teklifler toplanır.',
            details: ['Mimari Etüt', 'Teknik Şartname', 'Müteahhit İhalesi']
        },
        {
            no: '03',
            title: 'Sözleşme & Ruhsat',
            desc: 'En uygun teklifi veren firma ile hukuki koruyuculuğu yüksek bir sözleşme imzalanır. Belediye proje onayı ve ruhsat süreçleri takip edilir.',
            details: ['Hukuki Sözleşme Kontrolü', 'Noter Onayı', 'Ruhsat Alımı']
        },
        {
            no: '04',
            title: 'Yapım & Teslim',
            desc: 'İnşaat süreci düzenli olarak denetlenir, teknik şartnameye uygunluk kontrol edilir. İskan alımı ile süreç tamamlanır.',
            details: ['İnşaat Denetimi', 'Malzeme Kontrolü', 'İskan & Teslim']
        }
    ];

    return (
        <div className="py-16 bg-white min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Kentsel Dönüşüm Süreci</h1>
                    <p className="text-xl text-gray-600">
                        Adım adım güvenli dönüşüm rehberi. Sürecin her aşamasında yanınızdayız.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -z-10" />

                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Number Bubble */}
                                <div className="w-20 h-20 bg-white border-4 border-accent rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm">
                                    <span className="text-2xl font-bold text-accent">{step.no}</span>
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow w-full">
                                    <h3 className="text-2xl font-bold text-primary-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600 mb-6">{step.desc}</p>
                                    <div className="space-y-2">
                                        {step.details.map((detail, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                                <CheckCircle className="w-4 h-4 text-accent" />
                                                {detail}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Spacer for alternating layout */}
                                <div className="flex-1 hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <Link to="/on-analiz">
                        <Button size="lg" className="bg-primary hover:bg-primary-800 text-white px-8 h-14">
                            Süreci Başlatmak İçin Tıklayın
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
