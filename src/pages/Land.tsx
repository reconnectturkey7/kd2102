import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, CheckCircle } from 'lucide-react';

export default function Land() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="bg-primary-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516156008625-3a9d60da9205?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Arsa & Kat Karşılığı Projeler</h1>
                    <p className="text-xl text-primary-200 max-w-2xl mx-auto mb-10">
                        Boş arsalarınız veya birleştirilmiş parselleriniz için en verimli proje modelini geliştiriyor, doğru müteahhit ile buluşturuyoruz.
                    </p>
                    <Link to="/on-analiz">
                        <Button size="lg" className="bg-accent hover:bg-accent-600 h-14 px-8">
                            Arsa Analizi Başlat
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Value Props */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Arsanızın Gerçek Değerini Biliyor Musunuz?</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Klasik emlakçı yaklaşımıyla değil, teknik geliştirici vizyonuyla hareket ediyoruz.
                                Arsanızın imar durumunu en üst verimle kullanacak avan projeler hazırlıyor, emsal artışı sağlayabilecek
                                tevhit (birleştirme) fırsatlarını değerlendiriyoruz.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Maksimum Emsal Kullanımı',
                                    'Fonktsiyonel Mimari Çözümler',
                                    'Doğru Paylaşım Oranı (%50 - %60 vb.)',
                                    'Kurumsal Müteahhit Ağı'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-gray-900">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-100 rounded-2xl p-2 h-96 relative overflow-hidden group">
                            {/* Abstract Visual Placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 to-primary-600 opacity-90" />
                            <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                <MapPin className="w-64 h-64" />
                            </div>
                            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                <div className="text-3xl font-bold text-white mb-1">%45 - %60</div>
                                <div className="text-primary-200 text-sm">Bölgesel Ortalama Paylaşım Oranları</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-8">Arsanız İçin Ücretsiz Expertiz</h2>
                    <div className="flex justify-center gap-4">
                        <Link to="/on-analiz">
                            <Button className="bg-primary text-white">Rapor Oluştur</Button>
                        </Link>
                        <Link to="/iletisim">
                            <Button variant="outline">Bizi Arayın</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
