// Shared Calculator Utilities

/**
 * Format number as Turkish Lira
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number, decimals: number = 0): string {
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    return `%${formatNumber(value, decimals)}`;
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

/**
 * Debounce function for input handlers
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
 * Save calculator data to localStorage
 */
export function saveCalculatorData(key: string, data: any): void {
    try {
        localStorage.setItem(`kd_calculator_${key}`, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving calculator data:', error);
    }
}

/**
 * Load calculator data from localStorage
 */
export function loadCalculatorData<T>(key: string): T | null {
    try {
        const data = localStorage.getItem(`kd_calculator_${key}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading calculator data:', error);
        return null;
    }
}

/**
 * Clear calculator data from localStorage
 */
export function clearCalculatorData(key: string): void {
    try {
        localStorage.removeItem(`kd_calculator_${key}`);
    } catch (error) {
        console.error('Error clearing calculator data:', error);
    }
}

/**
 * Validate phone number (Turkish format)
 */
export function validatePhoneNumber(phone: string): boolean {
    // Remove spaces and special characters
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // Check if it's a valid Turkish phone number
    // Formats: 05XXXXXXXXX or 5XXXXXXXXX or +905XXXXXXXXX
    const phoneRegex = /^(\+90|0)?5\d{9}$/;
    return phoneRegex.test(cleaned);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');

    if (cleaned.startsWith('+90')) {
        const number = cleaned.substring(3);
        return `+90 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 8)} ${number.substring(8)}`;
    } else if (cleaned.startsWith('0')) {
        return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7, 9)} ${cleaned.substring(9)}`;
    } else {
        return `0${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8)}`;
    }
}
