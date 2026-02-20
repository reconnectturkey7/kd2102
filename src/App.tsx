import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Process from './pages/Process';
import Land from './pages/Land';
import Contractors from './pages/Contractors';
import LeadPool from './pages/LeadPool';
import Contact from './pages/Contact';
import ScrollToTop from './components/layout/ScrollToTop';
import OnAnalizWizard from './components/forms/OnAnalizWizard';
import ToolsHub from './pages/tools/ToolsHub';
import Emsal from './pages/tools/Emsal';
import Daire from './pages/tools/Daire';
import Paylasim from './pages/tools/Paylasim';
import Maliyet from './pages/tools/Maliyet';
import Destek from './pages/tools/Destek';
import Takvim from './pages/tools/Takvim';
import ArsaPayi from './pages/tools/ArsaPayi';
import MuteahhitMini from './pages/tools/MuteahhitMini';

import { Toaster } from 'sonner';

// Placeholder for standalone OnAnaliz page if needed, currently embedded in Home.
// But we can keep a dedicated route for it too if user wants direct link.
const OnAnalizPage = () => (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
        <OnAnalizWizard />
    </div>
);

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="on-analiz" element={<OnAnalizPage />} />
                    <Route path="hizmetler" element={<Services />} />
                    <Route path="surec" element={<Process />} />
                    <Route path="arsa" element={<Land />} />
                    <Route path="muteahhit" element={<Contractors />} />
                    <Route path="firsatlar" element={<LeadPool />} />
                    <Route path="iletisim" element={<Contact />} />
                    {/* Calculator Tools */}
                    <Route path="tools" element={<ToolsHub />} />
                    <Route path="tools/emsal" element={<Emsal />} />
                    <Route path="tools/daire" element={<Daire />} />
                    <Route path="tools/paylasim" element={<Paylasim />} />
                    <Route path="tools/maliyet" element={<Maliyet />} />
                    <Route path="tools/destek" element={<Destek />} />
                    <Route path="tools/takvim" element={<Takvim />} />
                    <Route path="tools/arsapayi" element={<ArsaPayi />} />
                    <Route path="tools/muteahhit-mini" element={<MuteahhitMini />} />
                </Route>
            </Routes>
            <Toaster />
        </Router>
    );
}

export default App;
