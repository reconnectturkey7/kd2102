const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwvx_F4Chiw7a-PEgZRb-AYSHxURq3YvO25nRrccPlJrqX-vix14L0mmCyCf0Q2oh6pqw/exec';

export type FormType = 'on-analiz' | 'iletisim' | 'firsat-havuzu';

export interface FormSubmission {
    formType: string;
    [key: string]: any;
}

export async function submitToGoogleSheets(data: FormSubmission): Promise<boolean> {
    try {
        const params = new URLSearchParams();
        params.append('data', JSON.stringify(data));

        await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        return true;
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        return false;
    }
}
