// Scenario Toggle Component (3-way switcher)

import type { ScenarioType } from '@/types/calculator';

interface ScenarioToggleProps {
    scenario: ScenarioType;
    onChange: (scenario: ScenarioType) => void;
    className?: string;
}

const scenarios: Array<{ value: ScenarioType; label: string; emoji: string }> = [
    { value: 'optimistic', label: 'İyimser', emoji: '📈' },
    { value: 'realistic', label: 'Gerçekçi', emoji: '📊' },
    { value: 'conservative', label: 'Temkinli', emoji: '📉' },
];

export default function ScenarioToggle({ scenario, onChange, className = '' }: ScenarioToggleProps) {
    return (
        <div className={`bg-gray-100 p-1 rounded-lg inline-flex gap-1 ${className}`}>
            {scenarios.map((scenarioOption) => (
                <button
                    key={scenarioOption.value}
                    onClick={() => onChange(scenarioOption.value)}
                    className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all
            ${scenario === scenarioOption.value
                            ? 'bg-white text-primary-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }
          `}
                >
                    <span className="mr-1">{scenarioOption.emoji}</span>
                    {scenarioOption.label}
                </button>
            ))}
        </div>
    );
}
