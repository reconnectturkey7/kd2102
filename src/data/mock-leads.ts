export interface Lead {
    id: string;
    city: string;
    district: string;
    neighborhood: string;
    type: 'Bina' | 'Arsa';
    area: number;
    floors?: number; // Only for Bina
    date: string;
    status: 'Aktif' | 'Teklif Verildi' | 'Kapandı';
}

export const mockLeads: Lead[] = [
    {
        id: 'L-1024',
        city: 'Ankara',
        district: 'Çankaya',
        neighborhood: 'Ahlatlıbel Mah',
        type: 'Arsa',
        area: 1250,
        date: '2024-02-15',
        status: 'Aktif'
    },
    {
        id: 'L-1023',
        city: 'Ankara',
        district: 'Yenimahalle',
        neighborhood: 'Batıkent Mah',
        type: 'Bina',
        area: 850,
        floors: 4,
        date: '2024-02-14',
        status: 'Aktif'
    },
    {
        id: 'L-1022',
        city: 'Ankara',
        district: 'Keçiören',
        neighborhood: 'Etlik Mah',
        type: 'Bina',
        area: 600,
        floors: 3,
        date: '2024-02-14',
        status: 'Teklif Verildi'
    },
    {
        id: 'L-1021',
        city: 'Ankara',
        district: 'Gölbaşı',
        neighborhood: 'İncek Mah',
        type: 'Arsa',
        area: 2500,
        date: '2024-02-13',
        status: 'Aktif'
    },
    {
        id: 'L-1020',
        city: 'Ankara',
        district: 'Mamak',
        neighborhood: 'Akdere Mah',
        type: 'Bina',
        area: 450,
        floors: 2,
        date: '2024-02-12',
        status: 'Kapandı'
    },
    {
        id: 'L-1019',
        city: 'Ankara',
        district: 'Çankaya',
        neighborhood: 'Bahçelievler Mah',
        type: 'Bina',
        area: 900,
        floors: 5,
        date: '2024-02-10',
        status: 'Aktif'
    }
];
