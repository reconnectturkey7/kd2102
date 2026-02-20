import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Calendar, Filter, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { mockLeads } from '@/data/mock-leads';
import { submitToGoogleSheets } from '@/lib/googleSheets';

export default function LeadPool() {
    const [filterDistrict, setFilterDistrict] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [selectedLead, setSelectedLead] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filteredLeads = mockLeads.filter(lead => {
        const matchDistrict = filterDistrict === 'all' || lead.district === filterDistrict;
        const matchType = filterType === 'all' || lead.type === filterType;
        return matchDistrict && matchType;
    });

    const districts = Array.from(new Set(mockLeads.map(l => l.district))).sort();

    const handleApplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        await submitToGoogleSheets({
            formType: 'firsat-havuzu',
            leadId: selectedLead,
            companyName: formData.get('companyName'),
            phone: formData.get('phone'),
            notes: formData.get('notes'),
            timestamp: new Date().toISOString(),
        });

        toast.success(`Fırsat #${selectedLead} için talebiniz alındı. Detaylar e-posta adresinize gönderildi.`);
        setIsDialogOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-20">
            {/* Header */}
            <div className="bg-primary-900 text-white py-20 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-accent/20 px-3 py-1 rounded-full text-accent-200 text-sm font-medium mb-6">
                            <Lock className="w-4 h-4" />
                            Müteahhit Paneli
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Fırsat Havuzu</h1>
                        <p className="text-xl text-primary-200 leading-relaxed">
                            Ankara genelindeki kentsel dönüşüm ve kat karşılığı proje fırsatlarını inceleyin,
                            ilgilendiğiniz projelere teklif verin.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-10">
                {/* Filters */}
                <Card className="mb-8 shadow-lg border-0 bg-white">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="w-full md:w-1/3">
                                <Label className="mb-2 block">İlçe Filtrele</Label>
                                <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tüm İlçeler" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tüm İlçeler</SelectItem>
                                        {districts.map(d => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full md:w-1/3">
                                <Label className="mb-2 block">Proje Tipi</Label>
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tüm Tipler" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tüm Tipler</SelectItem>
                                        <SelectItem value="Bina">Bina Dönüşümü</SelectItem>
                                        <SelectItem value="Arsa">Arsa Projesi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full md:w-1/3">
                                <Button variant="outline" className="w-full" onClick={() => { setFilterDistrict('all'); setFilterType('all'); }}>
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtreleri Temizle
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLeads.map((lead, index) => (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-accent h-full flex flex-col bg-white">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${lead.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {lead.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {lead.date}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        {lead.type === 'Bina' ? <Building2 className="w-5 h-5 text-accent" /> : <MapPin className="w-5 h-5 text-green-600" />}
                                        {lead.district}
                                    </CardTitle>
                                    <CardDescription>{lead.neighborhood}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 grow">
                                    <hr className="border-gray-100" />
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Proje Tipi</p>
                                            <p className="font-semibold">{lead.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Alan</p>
                                            <p className="font-semibold">{lead.area} m²</p>
                                        </div>
                                        {lead.floors && (
                                            <div>
                                                <p className="text-muted-foreground">Mevcut Kat</p>
                                                <p className="font-semibold">{lead.floors} Kat</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-muted-foreground">İl</p>
                                            <p className="font-semibold">{lead.city}</p>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800 flex gap-2">
                                        <Lock className="w-4 h-4 shrink-0" />
                                        <span>Tam adres ve iletişim bilgileri talebiniz onaylandıktan sonra paylaşılacaktır.</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full bg-primary-900 hover:bg-primary-800"
                                        onClick={() => {
                                            setSelectedLead(lead.id);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        İlgileniyorum / Talip Ol
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredLeads.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground">Seçilen kriterlere uygun fırsat bulunamadı.</p>
                        <Button variant="link" onClick={() => { setFilterDistrict('all'); setFilterType('all'); }}>
                            Tüm fırsatları göster
                        </Button>
                    </div>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Fırsat #{selectedLead} İçin Talip Ol</DialogTitle>
                            <DialogDescription>
                                Bu proje ile ilgilendiğinizi belirtmek için formu doldurun. Yetkili ekibimiz sizinle iletişime geçecektir.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleApplySubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="c-name">Firma / Yetkili Adı</Label>
                                <Input id="c-name" placeholder="Adınız Soyadınız" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="c-phone">Telefon</Label>
                                <Input id="c-phone" placeholder="05XX XXX XX XX" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="c-note">Notunuz (Opsiyonel)</Label>
                                <Textarea id="c-note" placeholder="Örn: Kat karşılığı oranı hakkında..." />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full bg-accent hover:bg-accent-600">
                                    Başvuruyu Gönder
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
