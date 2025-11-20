export const locationData = [
	{ id: 'all', name: 'All Locations', region: 'all' },
	{ id: 'metro-manila', name: 'Metro Manila', region: 'ncr' },
	{ id: 'quezon-city', name: 'Quezon City', region: 'ncr' },
	{ id: 'makati', name: 'Makati City', region: 'ncr' },
	{ id: 'bgc', name: 'BGC/Taguig', region: 'ncr' },
	{ id: 'ortigas', name: 'Ortigas Center', region: 'ncr' },
	{ id: 'manila', name: 'Manila City', region: 'ncr' },
	{ id: 'pasig', name: 'Pasig City', region: 'ncr' },
	{ id: 'mandaluyong', name: 'Mandaluyong City', region: 'ncr' },
	{ id: 'edsa', name: 'EDSA Corridor', region: 'ncr' },
	{ id: 'cebu', name: 'Cebu City', region: 'visayas' },
	{ id: 'davao', name: 'Davao City', region: 'mindanao' },
	{ id: 'clark', name: 'Clark/Pampanga', region: 'luzon' },
	{ id: 'baguio', name: 'Baguio City', region: 'luzon' },
];

export const getLocationsByRegion = (region) => {
	if (region === 'all') return locationData;
	return locationData.filter(loc => loc.region === region);
};
