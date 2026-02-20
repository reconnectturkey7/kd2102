import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, ShieldCheck, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contractors() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Müteahhit Çözüm Ortaklığı</h1>
                        <p className="text-gray-600 text-lg">
                            Analiz edilmiş, hukuki sorunu olmayan ve yapım aşamasına hazır projelere erişin.
                        </p>
                        <div className="flex justify-center gap-4 mt-6">
                            <Link to="/firsatlar">
                                <Button size="lg" className="bg-accent hover:bg-accent-600 text-white font-bold h-12 px-8 shadow-lg shadow-accent/20">
                                    Fırsat Havuzunu İncele <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {[
                            { icon: ShieldCheck, title: 'Güvenilir Projeler', desc: 'Mülkiyet sorunları çözülmüş, hak sahipleri uzlaşmış hazır portföy.' },
                            { icon: Briefcase, title: 'Profesyonel Süreç', desc: 'Teknik şartname ve sözleşme süreçlerinde kurumsal yönetim.' },
                            { icon: Building2, title: 'Sürekli İş Akışı', desc: 'Ankara genelinde sürekli güncellenen kentsel dönüşüm havuzu.' }
                        ].map((item, i) => (
                            <Card key={i} className="text-center border-none shadow-md">
                                <CardContent className="pt-6">
                                    <div className="mx-auto w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-900 mb-4">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-t-4 border-t-accent shadow-lg">
                        <CardHeader className="bg-white">
                            <CardTitle>Çözüm Ortağı Başvuru Formu</CardTitle>
                            <CardDescription>Firmanızı veritabanımıza ekleyin, uygun projelerde sizi davet edelim.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Firma Ünvanı</Label>
                                        <Input id="company" placeholder="Şirket Tam Adı" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="author">Yetkili Kişi</Label>
                                        <Input id="author" placeholder="Ad Soyad" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telefon</Label>
                                        <Input id="phone" placeholder="05XX XXX XX XX" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-posta</Label>
                                        <Input id="email" type="email" placeholder="kurumsal@firma.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="refs">Referans Projeler (Link veya Liste)</Label>
                                    <Textarea id="refs" placeholder="Tamamlanan önemli projelerinizden bahsedin..." className="min-h-[100px]" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="zones">Çalışma Bölgeleri ve Tercihler</Label>
                                    <Textarea id="zones" placeholder="Örn: Çankaya, Yenimahalle. 2000 m² üzeri projeler..." />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms" />
                                    <Label htmlFor="terms" className="text-sm font-normal text-gray-600">
                                        Paylaştığım bilgilerin KD Ankara proje veritabanına kaydedilmesini onaylıyorum.
                                    </Label>
                                </div>

                                <Button className="w-full bg-primary hover:bg-primary-800 h-12 text-lg">Başvuruyu Gönder</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
