// Müteahhit Mini Fizibilite Calculator Logic

import type { MuteahhitMiniInputs, MuteahhitMiniResults } from '@/types/calculator';

/**
 * Calculates basic feasibility for a contractor project
 */
export function calculateMuteahhitMini(inputs: MuteahhitMiniInputs): MuteahhitMiniResults {
    const {
        arsaAlani,
        emsal,
        ortakAlanOrani,
        satisFiyati,
        maliyet,
    } = inputs;

    // 1. Calculate Total Construction Area (TİA)
    // emsal usually gives net area, add common areas
    const emsalAlani = arsaAlani * emsal;
    const toplamInsaatAlani = emsalAlani * (1 + ortakAlanOrani / 100);

    // 2. Calculate Sellable Area (usually close to emsal area in Turkey's regulation)
    const satilabilirBrutAlan = emsalAlani;

    // 3. Costs
    const toplamMaliyet = toplamInsaatAlani * maliyet;

    // 4. Revenue
    const toplamCiro = satilabilirBrutAlan * satisFiyati;

    // 5. Profit
    const kar = toplamCiro - toplamMaliyet;
    const karMarji = toplamMaliyet > 0 ? (kar / toplamMaliyet) * 100 : 0;

    // 6. Share Ratios (Simplified: based on margin and typical market distribution)
    // This is a rough estimate for "Mini" feasibility
    const muteahhitPayOrani = 100 - (inputs.hedefKar || 25); // Placeholder logic
    const malikPayOrani = 100 - muteahhitPayOrani;

    return {
        formType: 'muteahhit-mini',
        timestamp: new Date().toISOString(),
        toplamInsaatAlani,
        satilabilirBrutAlan,
        toplamCiro,
        toplamMaliyet,
        hedefKar: inputs.hedefKar,
        karMarji,
        malikPayOrani,
        muteahhitPayOrani,
        inputs,
    };
}

/**
 * Validates Contractor Mini inputs
 */
export function validateMuteahhitMiniInputs(inputs: MuteahhitMiniInputs): string[] {
    const errors: string[] = [];

    if (inputs.arsaAlani <= 0) errors.push('Arsa alanı 0\'dan büyük olmalıdır.');
    if (inputs.emsal <= 0) errors.push('Emsal 0\'dan büyük olmalıdır.');
    if (inputs.satisFiyati <= 0) errors.push('Satış fiyatı 0\'dan büyük olmalıdır.');
    if (inputs.maliyet <= 0) errors.push('İnşaat maliyeti 0\'dan büyük olmalıdır.');

    return errors;
}
