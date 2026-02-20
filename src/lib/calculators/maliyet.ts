// Maliyet (Cost Band) Calculator Utilities

import type { MaliyetInputs, MaliyetResults } from '@/types/calculator';

/**
 * Base costs per m² for construction quality levels (2024/2025 Ankara averages)
 */
export const BASE_COSTS = {
    ekonomik: 22500,
    orta: 32500,
    ust: 47500,
} as const;

/**
 * Calculate construction cost band
 */
export function calculateMaliyet(inputs: MaliyetInputs): MaliyetResults {
    const { toplamInsaatAlani, kalite, kdvDahil, m2Maliyet: manualOverride } = inputs;

    // Determine base m² cost
    let baseM2Maliyet = manualOverride || BASE_COSTS[kalite];

    // Apply KDV if requested (20%)
    if (kdvDahil) {
        baseM2Maliyet = baseM2Maliyet * 1.20;
    }

    // Realistic scenario (Middle)
    const ortaSenaryo = toplamInsaatAlani * baseM2Maliyet;

    // Low scenario (-10% for efficiency/luck)
    const dusukSenaryo = ortaSenaryo * 0.90;

    // High scenario (+10% for complexity/market spikes)
    const yuksekSenaryo = ortaSenaryo * 1.10;

    return {
        formType: 'maliyet',
        timestamp: new Date().toISOString(),
        dusukSenaryo,
        ortaSenaryo,
        yuksekSenaryo,
        m2Maliyet: baseM2Maliyet,
        inputs,
    };
}

/**
 * Validate Maliyet calculator inputs
 */
export function validateMaliyetInputs(inputs: Partial<MaliyetInputs>): string[] {
    const errors: string[] = [];

    if (!inputs.toplamInsaatAlani || inputs.toplamInsaatAlani <= 0) {
        errors.push('Lütfen geçerli bir toplam inşaat alanı girin.');
    }

    if (!inputs.kalite) {
        errors.push('Lütfen bir kalite seviyesi seçin.');
    }

    return errors;
}
