// Legal Disclaimer Component

interface LegalDisclaimerProps {
    className?: string;
}

export default function LegalDisclaimer({ className = '' }: LegalDisclaimerProps) {
    return (
        <div className={`mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
            <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-semibold">⚠️ Yasal Uyarı:</span> KD Ankara hesaplama araçları{' '}
                <span className="font-medium">bilgilendirme amaçlıdır</span>; resmi imar çapı, plan
                notları, zemin koşulları ve proje kararlarıyla değişebilir. Hukuki/teknik danışmanlık
                yerine geçmez.
            </p>
        </div>
    );
}
