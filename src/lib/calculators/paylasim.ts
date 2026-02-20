// Paylaşım (Revenue Sharing) Calculator Utilities

import type { PaylasimInputs, PaylasimResults } from '@/types/calculator';

/**
 * Calculate revenue sharing between owner and contractor
 */
export function calculatePaylasim(
    inputs: PaylasimInputs,
    malikPayOrani: number = 40 // Default 40% for owner
): PaylasimResults {
    const { toplamDaireAdedi, ortalamaDaireM2, m2Fiyat, arsaDegeri = 0, yikim = 0, geciciKonut = 0, diger = 0 } = inputs;

    // Total revenue
    const toplamHasilat = toplamDaireAdedi * ortalamaDaireM2 * m2Fiyat;

    // Total additional costs
    const toplamMaliyetler = arsaDegeri + yikim + geciciKonut + diger;

    // Convert percentage to decimal
    const malikPayOranDecimal = malikPayOrani / 100;
    const muteahhitPayOrani = 100 - malikPayOrani;

    // Calculate unit distribution
    const malikDaireAdedi = Math.floor(toplamDaireAdedi * malikPayOranDecimal);
    const muteahhitDaireAdedi = toplamDaireAdedi - malikDaireAdedi;

    // Calculate monetary values
    const malikPayDegeri = malikDaireAdedi * ortalamaDaireM2 * m2Fiyat;
    const muteahhitPayDegeri = muteahhitDaireAdedi * ortalamaDaireM2 * m2Fiyat;

    // Calculate if owner needs cash support
    // If additional costs exceed owner's share value, they need to pay the difference
    const malikNakitDestegi = Math.max(0, toplamMaliyetler - malikPayDegeri);

    return {
        formType: 'paylasim',
        timestamp: new Date().toISOString(),
        toplamHasilat,
        toplamMaliyetler,
        malikPayOrani,
        muteahhitPayOrani,
        malikDaireAdedi,
        muteahhitDaireAdedi,
        malikPayDegeri,
        muteahhitPayDegeri,
        malikNakitDestegi,
        inputs,
    };
}

/**
 * Validate Paylaşım calculator inputs
 */
export function validatePaylasimInputs(inputs: PaylasimInputs): string[] {
    const errors: string[] = [];

    if (!inputs.toplamDaireAdedi || inputs.toplamDaireAdedi <= 0) {
        errors.push('Lütfen geçerli bir daire adedi girin.');
    }

    if (!inputs.ortalamaDaireM2 || inputs.ortalamaDaireM2 <= 0) {
        errors.push('Lütfen geçerli bir ortalama daire m² girin.');
    }

    if (!inputs.m2Fiyat || inputs.m2Fiyat <= 0) {
        errors.push('Lütfen geçerli bir m² satış fiyatı girin.');
    }

    return errors;
}
