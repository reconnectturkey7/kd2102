// Daire (Unit Count & Mix) Calculator Utilities

import type { DaireInputs, DaireResults } from '@/types/calculator';

/**
 * Calculate unit count and mix
 */
export function calculateDaire(inputs: DaireInputs): DaireResults {
    const { toplamInsaatAlani, ortakAlanOrani, mode, daireBrutM2, tipler } = inputs;

    // Saleable gross area = Total × (1 - common_ratio/100)
    const satilabilirBrutAlan = toplamInsaatAlani * (1 - ortakAlanOrani / 100);

    let tahminiDaireAdedi = 0;
    let tipBazliAdetler: Array<{ tip: string; adet: number; brutM2: number }> | undefined;

    if (mode === 'single' && daireBrutM2) {
        // Single type mode
        tahminiDaireAdedi = Math.floor(satilabilirBrutAlan / daireBrutM2);
    } else if (mode === 'mix' && tipler && tipler.length > 0) {
        // Mix mode
        const totalOran = tipler.reduce((sum, tip) => sum + tip.oran, 0);

        // Calculate weighted average unit size
        const weightedAvgM2 = tipler.reduce((sum, tip) => {
            return sum + (tip.brutM2 * tip.oran / totalOran);
        }, 0);

        tahminiDaireAdedi = Math.floor(satilabilirBrutAlan / weightedAvgM2);

        // Calculate units per type
        tipBazliAdetler = tipler.map(tip => ({
            tip: tip.name,
            adet: Math.floor(tahminiDaireAdedi * (tip.oran / totalOran)),
            brutM2: tip.brutM2,
        }));
    }

    return {
        timestamp: new Date().toISOString(),
        formType: 'daire',
        satilabilirBrutAlan,
        tahminiDaireAdedi,
        tipBazliAdetler,
        inputs,
    };
}

/**
 * Validate Daire inputs
 */
export function validateDaireInputs(inputs: Partial<DaireInputs>): string[] {
    const errors: string[] = [];

    if (!inputs.toplamInsaatAlani || inputs.toplamInsaatAlani <= 0) {
        errors.push('Lütfen geçerli bir toplam inşaat alanı girin.');
    }

    if (!inputs.ortakAlanOrani || inputs.ortakAlanOrani < 0 || inputs.ortakAlanOrani > 100) {
        errors.push('Ortak alan oranı 0-100 arasında olmalıdır.');
    }

    if (inputs.mode === 'single' && (!inputs.daireBrutM2 || inputs.daireBrutM2 <= 0)) {
        errors.push('Lütfen geçerli bir daire brüt m² değeri girin.');
    }

    if (inputs.mode === 'mix') {
        if (!inputs.tipler || inputs.tipler.length === 0) {
            errors.push('Lütfen en az bir daire tipi ekleyin.');
        } else {
            const totalOran = inputs.tipler.reduce((sum, tip) => sum + tip.oran, 0);
            if (Math.abs(totalOran - 100) > 0.1) {
                errors.push('Daire tipi oranlarının toplamı %100 olmalıdır.');
            }
        }
    }

    return errors;
}
