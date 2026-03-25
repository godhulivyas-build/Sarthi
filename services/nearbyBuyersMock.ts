export type NearbyBuyer = {
  id: string;
  name: string;
  typeHi: string;
  typeEn: string;
  cropHi: string;
  cropEn: string;
  pricePerQuintal: number;
  distanceKm: number;
};

export const nearbyBuyers: NearbyBuyer[] = [
  { id: 'b1', name: 'श्याम ट्रेडर्स', typeHi: 'थोक', typeEn: 'Wholesale', cropHi: 'प्याज', cropEn: 'Onion', pricePerQuintal: 2180, distanceKm: 12 },
  { id: 'b2', name: 'राधा कलेक्शन', typeHi: 'खुदरा', typeEn: 'Retail', cropHi: 'टमाटर', cropEn: 'Tomato', pricePerQuintal: 1720, distanceKm: 8 },
  { id: 'b3', name: 'APMC Agent', typeHi: 'कमीशन', typeEn: 'Commission', cropHi: 'सोयाबीन', cropEn: 'Soybean', pricePerQuintal: 4650, distanceKm: 22 },
];
