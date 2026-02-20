// Calculator Header Component

interface CalculatorHeaderProps {
    title: string;
    description: string;
    requiredInfo?: string[];
    estimatedTime?: string;
}

export default function CalculatorHeader({
    title,
    description,
    requiredInfo,
    estimatedTime,
}: CalculatorHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900 mb-2">{title}</h1>
                    <p className="text-gray-600 text-lg">{description}</p>
                </div>
                {estimatedTime && (
                    <div className="bg-accent/10 text-accent px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
                        ⏱️ {estimatedTime}
                    </div>
                )}
            </div>

            {requiredInfo && requiredInfo.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm text-gray-500 font-medium">Gerekli Bilgi:</span>
                    {requiredInfo.map((info, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
                        >
                            {info}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
