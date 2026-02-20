// Calculator Types and Interfaces

export type ScenarioType = 'optimistic' | 'realistic' | 'conservative';

export type FormType = 'emsal' | 'daire' | 'paylasim' | 'maliyet' | 'destek' | 'takvim' | 'arsapayi' | 'muteahhit-mini';

// Base Calculator Result
export interface CalculatorResult {
    timestamp: string;
    formType: FormType;
}

// Emsal Calculator (TAKS-KAKS / Construction Area)
export interface EmsalInputs {
    il?: string;
    ilce?: string;
    mahalle?: string;
    arsaAlani: number; // m²
    kaks?: number; // Emsal
    taks?: number;
    katYuksekligi?: number; // m, for floor estimate
}

export interface EmsalResults extends CalculatorResult {
    formType: 'emsal';
    toplamInsaatAlani: number; // m²
    tabanOturumu?: number; // m²
    tahminiKatSayisi?: number;
    inputs: EmsalInputs;
}

// Daire Calculator (Unit Count & Mix)
export type DaireTipiMode = 'single' | 'mix';

export interface DaireTipi {
    name: string; // "1+1", "2+1", "3+1"
    brutM2: number;
    oran: number; // percentage
}

export interface DaireInputs {
    toplamInsaatAlani: number; // from Emsal
    ortakAlanOrani: number; // percentage, default 25
    mode: DaireTipiMode;
    // Single mode
    daireBrutM2?: number;
    // Mix mode
    tipler?: DaireTipi[];
}

export interface DaireResults extends CalculatorResult {
    formType: 'daire';
    satilabilirBrutAlan: number; // m²
    tahminiDaireAdedi: number;
    tipBazliAdetler?: Array<{
        tip: string;
        adet: number;
        brutM2: number;
    }>;
    inputs: DaireInputs;
}

// Paylaşım Calculator (Revenue Sharing)
export interface PaylasimInputs {
    toplamDaireAdedi: number; // from Daire
    ortalamaDaireM2: number; // m²
    m2Fiyat: number; // TL/m²
    arsaDegeri?: number; // TL
    yikim?: number; // TL
    geciciKonut?: number; // TL
    diger?: number; // TL
}

export interface PaylasimResults extends CalculatorResult {
    formType: 'paylasim';
    toplamHasilat: number; // TL
    toplamMaliyetler: number; // TL
    malikPayOrani: number; // percentage
    muteahhitPayOrani: number; // percentage
    malikDaireAdedi: number;
    muteahhitDaireAdedi: number;
    malikPayDegeri: number; // TL
    muteahhitPayDegeri: number; // TL
    malikNakitDestegi: number; // TL
    inputs: PaylasimInputs;
}

// Maliyet Calculator (Cost Band)
export type KaliteSeviyesi = 'ekonomik' | 'orta' | 'ust';

export interface MaliyetInputs {
    toplamInsaatAlani: number; // from Emsal
    kalite: KaliteSeviyesi;
    kdvDahil: boolean;
    m2Maliyet?: number; // optional override
}

export interface MaliyetResults extends CalculatorResult {
    formType: 'maliyet';
    dusukSenaryo: number; // TL
    ortaSenaryo: number; // TL
    yuksekSenaryo: number; // TL
    m2Maliyet: number; // base TL/m²
    inputs: MaliyetInputs;
}

// Destek Calculator (Rent Assistance)
export type DestekStatu = 'malik' | 'kiraci' | 'sinirli-ayni-hak';

export interface DestekInputs {
    il: string;
    statu: DestekStatu;
    aySayisi: number; // default 18
    aylikTahminiDestek: number; // TL
}

export interface DestekResults extends CalculatorResult {
    formType: 'destek';
    aylikDestek: number; // TL
    toplamDestek: number; // TL
    inputs: DestekInputs;
}

// Takvim Calculator (Timeline)
export type BaslangicDurumu = 'tespit-yok' | 'tespit-var' | 'cogunluk-var' | 'ruhsat-alindi';

export interface TakvimInputs {
    baslangicDurumu: BaslangicDurumu;
    scenario: ScenarioType;
}

export interface TakvimFaz {
    id: string;
    name: string;
    minAy: number;
    maxAy: number;
    description: string;
}

export interface TakvimResults extends CalculatorResult {
    formType: 'takvim';
    toplamMinAy: number;
    toplamMaxAy: number;
    fazlar: TakvimFaz[];
    inputs: TakvimInputs;
}

// Arsa Payı Calculator (Land Share)
export interface BagimsisBolum {
    no: string;
    brutM2: number;
}

export interface ArsaPayiInputs {
    bagimsisBolumler: BagimsisBolum[];
    toplamArsaPayiOlcegi: number; // default 10000 or 1.0
}

export interface ArsaPayiSonuc {
    no: string;
    brutM2: number;
    arsaPayi: number;
    oran: number; // percentage
}

export interface ArsaPayiResults extends CalculatorResult {
    formType: 'arsapayi';
    sonuclar: ArsaPayiSonuc[];
    toplamM2: number;
    enYuksekOran: number;
    enDusukOran: number;
    inputs: ArsaPayiInputs;
}

// Müteahhit Mini Feasibility
export interface MuteahhitMiniInputs {
    arsaAlani: number; // m²
    emsal: number;
    ortakAlanOrani: number; // percentage
    satisFiyati: number; // TL/m²
    maliyet: number; // TL/m²
    hedefKar: number; // percentage
}

export interface MuteahhitMiniResults extends CalculatorResult {
    formType: 'muteahhit-mini';
    toplamInsaatAlani: number;
    satilabilirBrutAlan: number;
    toplamCiro: number;
    toplamMaliyet: number;
    hedefKar: number;
    karMarji: number; // percentage
    malikPayOrani: number; // percentage
    muteahhitPayOrani: number; // percentage
    inputs: MuteahhitMiniInputs;
}

// Lead Form Data (for all calculators)
export interface LeadFormData {
    adSoyad: string;
    telefon: string;
    ilce: string;
    mahalle: string;
    tapuImarBelgesi: 'evet' | 'hayir';
    notlar?: string;
    kvkkOnay: boolean;
    // Context from calculator
    calculatorType: FormType;
    calculatorData: any; // The specific calculator result
}

// WhatsApp Message Template Data
export interface WhatsAppMessageData {
    ilce: string;
    mahalle: string;
    arsaTipi: string;
    arsaM2?: number;
    emsal?: number;
    sonucOzet: string;
    telefon: string;
}
