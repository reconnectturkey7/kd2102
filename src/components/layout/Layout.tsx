import { Link, Outlet } from 'react-router-dom';
import { Menu, Phone, MessageCircle, MapPin, Facebook, Instagram, Linkedin, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900">
            {/* Top Bar - Contact & Social */}
            <div className="bg-primary-900 text-white py-2 text-xs hidden md:block border-b border-primary-800">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-accent" />
                            0312 236 10 17
                        </span>
                        <span className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-accent" />
                            Ankara, Türkiye
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="opacity-75">Takip Edin:</span>
                        <div className="flex gap-3">
                            <a href="#" className="hover:text-accent transition-colors"><Instagram className="w-3 h-3" /></a>
                            <a href="#" className="hover:text-accent transition-colors"><Linkedin className="w-3 h-3" /></a>
                            <a href="#" className="hover:text-accent transition-colors"><Facebook className="w-3 h-3" /></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/assets/logo.png" alt="KD Ankara Logo" className="h-12 w-auto" />
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-primary-900 leading-none">KD Ankara</span>
                                <span className="text-[10px] text-gray-500 font-medium tracking-wide">STRATEJİ MERKEZİ</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            <Link to="/hizmetler" className="text-sm font-medium text-gray-700 hover:text-primary-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-all">Hizmetler</Link>
                            <Link to="/surec" className="text-sm font-medium text-gray-700 hover:text-primary-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-all">Dönüşüm Süreci</Link>
                            <Link to="/arsa" className="text-sm font-medium text-gray-700 hover:text-primary-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-all">Arsa Projeleri</Link>
                            <Link to="/tools" className="text-sm font-medium text-gray-700 hover:text-primary-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-all">Hesaplama Merkezi</Link>
                            <Link to="/muteahhit" className="text-sm font-medium text-gray-700 hover:text-primary-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-all">Müteahhitler</Link>
                        </nav>

                        {/* Desktop CTA */}
                        <div className="hidden lg:flex items-center gap-3">
                            <Link to="/iletisim">
                                <Button variant="ghost" className="text-gray-600">İletişim</Button>
                            </Link>
                            <Link to="/on-analiz">
                                <Button className="bg-accent hover:bg-accent-600 text-white font-semibold shadow-lg shadow-accent/20">
                                    Ücretsiz Ön Analiz
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 lg:hidden flex flex-col gap-2 animate-in slide-in-from-top-2">
                        <Link to="/hizmetler" className="p-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Hizmetler</Link>
                        <Link to="/surec" className="p-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Dönüşüm Süreci</Link>
                        <Link to="/arsa" className="p-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Arsa Projeleri</Link>
                        <Link to="/tools" className="p-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Hesaplama Merkezi</Link>
                        <Link to="/muteahhit" className="p-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Müteahhitler</Link>
                        <Link to="/iletisim" className="p-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">İletişim</Link>
                        <div className="h-px bg-gray-100 my-2" />
                        <Link to="/on-analiz" className="w-full">
                            <Button className="w-full bg-accent hover:bg-accent-600 text-white justify-center">
                                Ücretsiz Ön Analiz Başlat
                            </Button>
                        </Link>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-primary-950 text-white pt-16 pb-8 border-t border-primary-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <img src="/assets/logo.png" alt="KD Ankara Logo" className="h-12 w-auto" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold leading-none">KD Ankara</span>
                                    <span className="text-[10px] text-gray-400 font-medium tracking-wide">STRATEJİ MERKEZİ</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Ankara'nın kentsel dönüşüm sürecinde veriye dayalı, şeffaf ve güvenilir çözüm ortağı.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent transition-colors"><Instagram className="w-4 h-4" /></a>
                                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent transition-colors"><Linkedin className="w-4 h-4" /></a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold text-lg mb-6">Hızlı Erişim</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><Link to="/hizmetler" className="hover:text-accent transition-colors">Hizmet Paketleri</Link></li>
                                <li><Link to="/surec" className="hover:text-accent transition-colors">Dönüşüm Süreci</Link></li>
                                <li><Link to="/arsa" className="hover:text-accent transition-colors">Arsa Karşılığı</Link></li>
                                <li><Link to="/on-analiz" className="hover:text-accent transition-colors">Ücretsiz Analiz</Link></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-semibold text-lg mb-6">Kurumsal</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><Link to="/hakkimizda" className="hover:text-accent transition-colors">Hakkımızda</Link></li>
                                <li><Link to="/kvkk" className="hover:text-accent transition-colors">KVKK Aydınlatma</Link></li>
                                <li><Link to="/gizlilik" className="hover:text-accent transition-colors">Gizlilik Politikası</Link></li>
                                <li><Link to="/iletisim" className="hover:text-accent transition-colors">İletişim</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold text-lg mb-6">İletişim</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-accent shrink-0" />
                                    <span>Konutkent Mahallesi 2987. Sokak No:18<br />Çankaya, Ankara<br />Türkiye</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-accent shrink-0" />
                                    <span>0312 236 10 17</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-accent shrink-0" />
                                    <span>0533 682 09 42</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                        <p>&copy; {new Date().getFullYear()} KD Ankara. Tüm hakları saklıdır.</p>
                        <p>Bu site, bilgilendirme amaçlıdır. Resmi belgeler yerine geçmez.</p>
                    </div>
                </div>
            </footer>

            {/* Sticky Mobile CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 lg:hidden z-50 flex gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <a
                    href="https://wa.me/905336820942"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] text-white rounded-lg flex items-center justify-center gap-2 font-semibold py-3"
                >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                </a>
                <Link to="/on-analiz" className="flex-1">
                    <Button className="w-full h-full bg-accent hover:bg-accent-600 text-white font-bold py-3">
                        Ön Analiz
                    </Button>
                </Link>
            </div>
        </div>
    );
}
