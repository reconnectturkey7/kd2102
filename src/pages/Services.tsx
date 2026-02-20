import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function Services() {
    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Hizmet Paketleri</h1>
                    <p className="text-xl text-gray-600">
                        Kentsel dönüşüm sürecinin her aşaması için, ihtiyacınıza özel profesyonel çözümler sunuyoruz.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Package 1 */}
                    <Card className="flex flex-col border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-900">Ön Uygunluk & Yol Haritası</CardTitle>
                            <CardDescription>Sürecin başında olanlar için</CardDescription>
                        </CardHeader>
                        <CardContent className="grow space-y-6">
                            <div className="text-4xl font-bold text-primary">₺2.500 <span className="text-sm font-normal text-gray-500">+ KDV</span></div>
                            <p className="text-sm text-gray-600">
                                Binanızın veya arsanızın dönüşüme uygunluğunu, temel imar verilerini ve potansiyel riskleri analiz ettiğimiz başlangıç paketidir.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Resmi İmar Durumu Sorgulama',
                                    'Bölgesel Emsal Analizi',
                                    'Temel Risk Tespiti',
                                    'Süreç Yol Haritası Sunumu',
                                    '1 Saatlik Uzman Görüşmesi'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Link to="/iletisim" className="w-full">
                                <Button className="w-full" variant="outline">Hemen Başvur</Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Package 2 */}
                    <Card className="flex flex-col border-accent border-2 shadow-xl relative scale-105 z-10">
                        <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                            EN ÇOK TERCİH EDİLEN
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-900">Detaylı Dönüşüm Raporu</CardTitle>
                            <CardDescription>Karar aşamasında olanlar için</CardDescription>
                        </CardHeader>
                        <CardContent className="grow space-y-6">
                            <div className="text-4xl font-bold text-primary">₺7.500 <span className="text-sm font-normal text-gray-500">+ KDV</span></div>
                            <p className="text-sm text-gray-600">
                                Mimari etütler, maliyet hesapları ve paylaşım senaryolarını içeren kapsamlı teknik rapordur. Müteahhit görüşmelerine eliniz güçlü gidin.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Taslak Mimari Etüt Çalışması',
                                    'Detaylı İnşaat Maliyet Hesabı',
                                    'Daire/Arsa Payı Değerleme',
                                    'Müteahhit Kar/Zarar Analizi',
                                    'Olası Paylaşım Oranları',
                                    'Hukuki Risk Önlemleri',
                                    '3 Farklı Senaryo Analizi'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Link to="/on-analiz" className="w-full">
                                <Button className="w-full bg-accent hover:bg-accent-600 text-white shadow-lg">Analiz Talep Et</Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Package 3 */}
                    <Card className="flex flex-col border-gray-200 shadow-lg hover:shadow-xl transition-shadow bg-primary-950 text-white">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-white">Tam Süreç Yönetimi</CardTitle>
                            <CardDescription className="text-gray-400">Anahtar teslim danışmanlık</CardDescription>
                        </CardHeader>
                        <CardContent className="grow space-y-6">
                            <div className="text-4xl font-bold text-white">
                                %1 - %2
                                <span className="text-sm font-normal text-gray-400 block mt-2">
                                    Hizmet Bedeli
                                    <span className="block text-xs opacity-80">(Müteahhit Firmadan Alınır)</span>
                                </span>
                            </div>
                            <p className="text-sm text-gray-300">
                                Müteahhit seçiminden anahtar teslimine kadar tüm sürecin teknik, hukuki ve finansal olarak yönetilmesidir.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Müteahhit İhale Dosyası Hazırlığı',
                                    'Teklif Toplama ve Değerlendirme',
                                    'Sözleşme Görüşmeleri & İmza',
                                    'Proje Ruhsat Kontrolü',
                                    'İnşaat İlerleme Denetimi',
                                    'Hakediş Kontrolleri',
                                    'Teslim Alma & Eksik Tespiti'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Link to="/iletisim" className="w-full">
                                <Button className="w-full bg-white text-primary-950 hover:bg-gray-100">Teklif İste</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>

                <div className="mt-20 max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Kararsız mısınız?</h3>
                        <p className="text-gray-600">Uzmanlarımızla 15 dakikalık ücretsiz ön görüşme yapın, size en uygun yolu gösterelim.</p>
                    </div>
                    <Link to="/iletisim">
                        <Button size="lg" className="bg-primary hover:bg-primary-800">
                            Randevu Oluştur <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
