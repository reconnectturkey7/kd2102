// Arsa Payı (Land Share) Calculator Logic

import type { ArsaPayiInputs, ArsaPayiResults, ArsaPayiSonuc } from '@/types/calculator';

/**
 * Calculates land share distribution based on independent units' m2
 */
export function calculateArsaPayi(inputs: ArsaPayiInputs): ArsaPayiResults {
    const { bagimsisBolumler, toplamArsaPayiOlcegi } = inputs;

    // Filter out empty or invalid units
    const validUnits = bagimsisBolumler.filter(bb => bb.brutM2 > 0);

    const toplamM2 = validUnits.reduce((sum, bb) => sum + bb.brutM2, 0);

    if (toplamM2 === 0) {
        return {
            formType: 'arsapayi',
            timestamp: new Date().toISOString(),
            sonuclar: [],
            toplamM2: 0,
            enYuksekOran: 0,
            enDusukOran: 0,
            inputs,
        };
    }

    const sonuclar: ArsaPayiSonuc[] = validUnits.map(bb => {
        const oran = (bb.brutM2 / toplamM2);
        return {
            no: bb.no,
            brutM2: bb.brutM2,
            arsaPayi: Math.round(oran * toplamArsaPayiOlcegi),
            oran: oran * 100, // percentage
        };
    });

    const oranlar = sonuclar.map(s => s.oran);
    const enYuksekOran = Math.max(...oranlar);
    const enDusukOran = Math.min(...oranlar);

    return {
        formType: 'arsapayi',
        timestamp: new Date().toISOString(),
        sonuclar,
        toplamM2,
        enYuksekOran,
        enDusukOran,
        inputs,
    };
}

/**
 * Validates Arsa Payı inputs
 */
export function validateArsaPayiInputs(inputs: ArsaPayiInputs): string[] {
    const errors: string[] = [];

    if (inputs.bagimsisBolumler.length === 0) {
        errors.push('En az bir bağımsız bölüm eklemelisiniz.');
    }

    if (inputs.toplamArsaPayiOlcegi <= 0) {
        errors.push('Toplam arsa payı ölçeği 0\'dan büyük olmalıdır.');
    }

    return errors;
}
