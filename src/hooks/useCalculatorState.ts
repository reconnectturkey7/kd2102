// Custom hook for calculator state management with localStorage persistence

import { useState, useEffect, useCallback } from 'react';
import { saveCalculatorData, loadCalculatorData } from '@/lib/calculators/utils';
import type { FormType } from '@/types/calculator';

interface UseCalculatorStateOptions<T> {
    formType: FormType;
    initialValues: T;
    autoSave?: boolean;
}

export function useCalculatorState<T extends Record<string, any>>({
    formType,
    initialValues,
    autoSave = true,
}: UseCalculatorStateOptions<T>) {
    // Load saved data or use initial values
    const [values, setValues] = useState<T>(() => {
        const saved = loadCalculatorData<T>(formType);
        return saved || initialValues;
    });

    // Auto-save to localStorage when values change
    useEffect(() => {
        if (autoSave) {
            saveCalculatorData(formType, values);
        }
    }, [values, formType, autoSave]);

    // Update a single field
    const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    // Update multiple fields at once
    const updateFields = useCallback((updates: Partial<T>) => {
        setValues((prev) => ({
            ...prev,
            ...updates,
        }));
    }, []);

    // Reset to initial values
    const reset = useCallback(() => {
        setValues(initialValues);
    }, [initialValues]);

    // Load data from another calculator (cross-calculator flow)
    const loadFromCalculator = useCallback(<U extends Record<string, any>>(
        sourceFormType: FormType,
        mapper: (sourceData: U) => Partial<T>
    ) => {
        const sourceData = loadCalculatorData<U>(sourceFormType);
        if (sourceData) {
            const mappedData = mapper(sourceData);
            updateFields(mappedData);
            return true;
        }
        return false;
    }, [updateFields]);

    return {
        values,
        updateField,
        updateFields,
        reset,
        loadFromCalculator,
    };
}
