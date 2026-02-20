// Destek (Rent Assistance) Calculator Utilities

import type { DestekInputs, DestekResults } from '@/types/calculator';

/**
 * Monthly rent support rates (2024 values for Turkey)
 */
export const RENT_SUPPORT_RATES: Record<string, number> = {
    'istanbul': 5500,
    'ankara': 4500,
    'izmir': 4500,
    'antalya': 3750,
    'bursa': 3750,
    'diger': 3000,
};

/**
 * Calculate rent assistance
 */
export function calculateDestek(inputs: DestekInputs): DestekResults {
    const { il, aySayisi } = inputs;

    // Get rate based on city, fallback to 'diger'
    const cityKey = il.toLowerCase().trim();
    const aylikDestek = RENT_SUPPORT_RATES[cityKey] || RENT_SUPPORT_RATES['diger'];

    // Total support
    const toplamDestek = aylikDestek * aySayisi;

    return {
        formType: 'destek',
        timestamp: new Date().toISOString(),
        aylikDestek,
        toplamDestek,
        inputs: {
            ...inputs,
            aylikTahminiDestek: aylikDestek,
        },
    };
}

/**
 * Validate Destek calculator inputs
 */
export function validateDestekInputs(inputs: Partial<DestekInputs>): string[] {
    const errors: string[] = [];

    if (!inputs.il) {
        errors.push('Lütfen bir il seçin.');
    }

    if (!inputs.statu) {
        errors.push('Lütfen statünüzü seçin (Malik/Kiracı).');
    }

    if (!inputs.aySayisi || inputs.aySayisi <= 0) {
        errors.push('Lütfen geçerli bir ay sayısı girin.');
    }

    return errors;
}
