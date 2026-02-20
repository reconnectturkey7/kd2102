// Takvim (Timeline) Calculator Utilities

import type { TakvimInputs, TakvimResults, TakvimFaz } from '@/types/calculator';

/**
 * Default phases for Urban Transformation
 */
const DEFAULT_PHASES: TakvimFaz[] = [
    { id: 'tespit', name: 'Hazırlık & Risk Tespiti', minAy: 1, maxAy: 3, description: 'Binanın risk durumunun resmi olarak tespiti ve raporlanması.' },
    { id: 'anlasma', name: 'Anlaşma & Karar Süreci', minAy: 2, maxAy: 6, description: 'Malikler arası 2/3 çoğunluk veya oybirliği ile karar alınması.' },
    { id: 'ruhsat', name: 'Yıkım, Proje & Ruhsat', minAy: 3, maxAy: 8, description: 'Mevcut binanın yıkılması ve yeni proje için ruhsat alınması.' },
    { id: 'insaat', name: 'İnşaat Süreci', minAy: 18, maxAy: 36, description: 'Temel atılmasından anahtar teslimine kadar geçen kaba ve ince inşaat.' },
];

/**
 * Calculate project timeline
 */
export function calculateTakvim(inputs: TakvimInputs): TakvimResults {
    const { baslangicDurumu } = inputs;

    let activePhases: TakvimFaz[] = [];

    switch (baslangicDurumu) {
        case 'tespit-yok':
            activePhases = [...DEFAULT_PHASES];
            break;
        case 'tespit-var':
            activePhases = DEFAULT_PHASES.filter(p => !['tespit'].includes(p.id));
            break;
        case 'cogunluk-var':
            activePhases = DEFAULT_PHASES.filter(p => !['tespit', 'anlasma'].includes(p.id));
            break;
        case 'ruhsat-alindi':
            activePhases = DEFAULT_PHASES.filter(p => !['tespit', 'anlasma', 'ruhsat'].includes(p.id));
            break;
        default:
            activePhases = [...DEFAULT_PHASES];
    }

    const toplamMinAy = activePhases.reduce((sum, p) => sum + p.minAy, 0);
    const toplamMaxAy = activePhases.reduce((sum, p) => sum + p.maxAy, 0);

    return {
        formType: 'takvim',
        timestamp: new Date().toISOString(),
        fazlar: activePhases,
        toplamMinAy,
        toplamMaxAy,
        inputs,
    };
}

/**
 * Validate Takvim calculator inputs
 */
export function validateTakvimInputs(inputs: Partial<TakvimInputs>): string[] {
    const errors: string[] = [];

    if (!inputs.baslangicDurumu) {
        errors.push('Lütfen projenizin mevcut durumunu seçin.');
    }

    return errors;
}
