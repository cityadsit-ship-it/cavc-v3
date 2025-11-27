import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Grid3X3, ChevronDown, AlertCircle, Ruler, X } from 'lucide-react';
import { serviceData } from './ServicesData';
import { metroManilaLocations, provincialLocations } from './Map';

const SearchFilter = ({ onFilterChange }) => {
	const [selectedLocation, setSelectedLocation] = useState('all');
	const [selectedService, setSelectedService] = useState('all');
	const [showLocationDropdown, setShowLocationDropdown] = useState(false);
	const [showServiceDropdown, setShowServiceDropdown] = useState(false);
	const [searchResults, setSearchResults] = useState(null);
	const [isSearching, setIsSearching] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [autoSearchEnabled, setAutoSearchEnabled] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const prevDropdowns = useRef({ location: 'all', service: 'all' });

	// Combine locations from Map.jsx
	const locationData = [
		{ id: 'all', name: 'All Locations', type: 'all' },
		{ id: 'metro-manila', name: '── Metro Manila ──', type: 'header', disabled: true },
		...metroManilaLocations.map(loc => ({
			id: loc.name.toLowerCase().replace(/\s+/g, '-'),
			name: loc.name,
			type: 'metro'
		})),
		{ id: 'provincial', name: '── Provincial ──', type: 'header', disabled: true },
		...provincialLocations.map(loc => ({
			id: loc.name.toLowerCase().replace(/\s+/g, '-'),
			name: loc.name,
			type: 'provincial'
		}))
	];

	// Responsive search: run search when dropdowns change
	useEffect(() => {
		// Don't search on first mount
		if (!hasSearched && selectedLocation === 'all' && selectedService === 'all') return;
		handleSearch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLocation, selectedService]);

	// Only auto-search after the first manual search
	useEffect(() => {
		if (!autoSearchEnabled) return;
		// Only trigger if dropdowns actually changed
		if (
			prevDropdowns.current.location !== selectedLocation ||
			prevDropdowns.current.service !== selectedService
		) {
			handleSearch();
		}
		// Update previous values
		prevDropdowns.current = { location: selectedLocation, service: selectedService };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLocation, selectedService, autoSearchEnabled]);

	const handleLocationChange = (locationId) => {
		const location = locationData.find(l => l.id === locationId);
		if (location && !location.disabled) {
			setSelectedLocation(locationId);
			setShowLocationDropdown(false);
			// Don't setHasSearched here, only after first manual search
		}
	};

	const handleServiceChange = (serviceId) => {
		setSelectedService(serviceId);
		setShowServiceDropdown(false);
		// Don't setHasSearched here, only after first manual search
	};

	const handleSearch = () => {
		setIsSearching(true);
		setHasSearched(true);
		setAutoSearchEnabled(true); // Enable auto-search after first manual search

		// Simulate search delay
		setTimeout(() => {
			// Filter services based on selection
			let filteredServices = [...serviceData];
			
			if (selectedService !== 'all') {
				filteredServices = serviceData.filter(s => s.id === parseInt(selectedService));
			}
			
			// Flatten gallery items for search results (only for services with galleryItems)
			const resultsWithImages = filteredServices.flatMap(service => {
				// For banners with galleryItems
				if (service.galleryItems && service.galleryItems.length > 0) {
					return service.galleryItems.map(item => ({
						id: `${service.id}-${item.modalDescription}`,
						serviceId: service.id,
						serviceTitle: service.title,
						displayImage: item.webp,
						fullImage: item.jpg,
						modalDescription: item.modalDescription,
						adSize: item.adSize || item.standardSize,
						adType: item.adType,
						specificLocation: item.location || item.locations,
					}));
				}
				// For other services without galleryItems
				return [{
					id: service.id,
					serviceId: service.id,
					serviceTitle: service.title,
					displayImage: service.mainImage,
					fullImage: service.mainImage,
					modalDescription: service.title,
					adSize: service.adSize,
					specificLocation: service.location,
				}];
			});

			// Filter by location if not "all"
			let finalResults = resultsWithImages;
			if (selectedLocation !== 'all') {
				const selectedLoc = locationData.find(l => l.id === selectedLocation);
				finalResults = resultsWithImages.filter(result => {
					const locations = result.specificLocation;
					if (!locations) return false;
					
					// Check if location string contains the selected location name
					if (typeof locations === 'string') {
						return locations.toLowerCase().includes(selectedLoc?.name.toLowerCase());
					}
					return false;
				});
			}
			
			setSearchResults(finalResults);
			setIsSearching(false);
			onFilterChange?.({ location: selectedLocation, service: selectedService });
		}, 250);
	};

	const selectedLocationName = locationData.find(l => l.id === selectedLocation)?.name || 'All Locations';
	const selectedServiceName = serviceData.find(s => s.id === parseInt(selectedService))?.title || 'All Services';

	return (
		<div className="my-16 mb-24">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
			>
				<div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
					<div className="flex flex-col md:flex-row gap-3 md:gap-4">
						{/* Location Dropdown */}
						<div className="flex-1 relative min-w-0">
							<button
								onClick={() => {
									setShowLocationDropdown(!showLocationDropdown);
									setShowServiceDropdown(false);
								}}
								className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-left hover:border-green-500 transition-colors focus:outline-none focus:border-green-500 flex items-center justify-between"
							>
								<div className="flex items-center gap-2">
									<MapPin className="w-4 h-4 text-green-500" />
									<span className={selectedLocation === 'all' ? 'text-gray-400' : 'text-gray-800 font-medium'}>
										{selectedLocationName}
									</span>
								</div>
								<ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
							</button>
							
							<AnimatePresence>
								{showLocationDropdown && (
									<>
										<div
											className="fixed inset-0 z-[100]"
											onClick={() => setShowLocationDropdown(false)}
										/>
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											className="absolute z-[101] mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto"
										>
											{locationData.map((location) => (
												<button
													key={location.id}
													onClick={() => handleLocationChange(location.id)}
													disabled={location.disabled}
													className={`w-full px-4 py-3 text-left transition-colors ${
														location.type === 'header'
															? 'bg-gray-100 text-gray-500 text-xs font-bold cursor-default'
															: selectedLocation === location.id
															? 'bg-green-500 text-white font-medium'
															: 'text-gray-700 hover:bg-green-500 hover:text-white'
													}`}
												>
													{location.name}
												</button>
											))}
										</motion.div>
									</>
								)}
							</AnimatePresence>
						</div>

						{/* Service Dropdown */}
						<div className="flex-1 relative min-w-0">
							<button
								onClick={() => {
									setShowServiceDropdown(!showServiceDropdown);
									setShowLocationDropdown(false);
								}}
								className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-left hover:border-green-500 transition-colors focus:outline-none focus:border-green-500 flex items-center justify-between"
							>
								<div className="flex items-center gap-2">
									<Grid3X3 className="w-4 h-4 text-green-500" />
									<span className={selectedService === 'all' ? 'text-gray-400' : 'text-gray-800 font-medium'}>
										{selectedServiceName}
									</span>
								</div>
								<ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
							</button>
							
							<AnimatePresence>
								{showServiceDropdown && (
									<>
										<div
											className="fixed inset-0 z-[100]"
											onClick={() => setShowServiceDropdown(false)}
										/>
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											className="absolute z-[101] mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-y-auto"
										>
											<button
												onClick={() => handleServiceChange('all')}
												className={`w-full px-4 py-3 text-left hover:bg-green-500 hover:text-white transition-colors ${
													selectedService === 'all'
														? 'bg-green-500 text-white font-medium'
														: 'text-gray-700'
												}`}
											>
												All Services
											</button>
											{serviceData.map((service) => (
												<button
													key={service.id}
													onClick={() => handleServiceChange(service.id.toString())}
													className={`w-full px-4 py-3 text-left hover:bg-green-500 hover:text-white transition-colors ${
														selectedService === service.id.toString()
															? 'bg-green-500 text-white font-medium'
															: 'text-gray-700'
													}`}
												>
													{service.title}
												</button>
											))}
										</motion.div>
									</>
								)}
							</AnimatePresence>
						</div>

						{/* Search Button (hidden on mobile, visible on md+) */}
						<div className="hidden md:block">
							<button
								onClick={handleSearch}
								disabled={isSearching}
								className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Search className={`w-5 h-5 ${isSearching ? 'animate-spin' : ''}`} />
								{isSearching ? 'Searching...' : 'Search'}
							</button>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Search Results */}
			<AnimatePresence>
				{hasSearched && (
					<motion.div
						initial={{ opacity: 0, height: 0, marginTop: 0 }}
						animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
						exit={{ opacity: 0, height: 0, marginTop: 0 }}
						transition={{ duration: 0.4 }}
						className="mb-16"
					>
						{isSearching ? (
							<div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
								<div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-500 mb-4"></div>
								<p className="text-gray-600 font-medium">Searching for services...</p>
							</div>
						) : searchResults && searchResults.length > 0 ? (
							<div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-4 sm:p-8 border border-green-100">
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-2">
									<h3 className="text-xl sm:text-2xl font-bold text-gray-800">
										Search Results
									</h3>
									<span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
										{searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found
									</span>
								</div>
								<div className="grid gap-4 sm:gap-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
									{searchResults.map((result, index) => (
										<motion.div
											key={result.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: index * 0.03 }}
											className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-500 group flex flex-col"
										>
											{/* Image Section - 60% emphasis */}
											<div 
												className="relative h-48 xs:h-56 sm:h-56 md:h-48 xl:h-56 bg-gray-100 overflow-hidden cursor-pointer"
												onClick={() => setSelectedImage({ url: result.fullImage, title: result.modalDescription })}
											>
												<img 
													src={result.displayImage} 
													alt={result.modalDescription}
													className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
													onError={(e) => {
														console.error('Image failed to load:', result.displayImage);
														e.target.style.display = 'none';
														e.target.nextSibling.style.display = 'flex';
													}}
												/>
												<div 
													className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 items-center justify-center text-7xl hidden"
												>
													📢
												</div>
												{/* Overlay on hover */}
												<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
													<span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-green-600 px-3 py-1 rounded-full">
														View Image
													</span>
												</div>
												<div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md">
													<span className="text-xs font-bold text-green-600">
														{result.serviceTitle}
													</span>
												</div>
											</div>
											
											{/* Content Section - 40% emphasis */}
											<div className="p-3 sm:p-4 flex-1 flex flex-col">
												<h4 className="font-bold text-xs sm:text-sm text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
													{result.modalDescription}
												</h4>
												
												{/* Ad Size with Icon */}
												{result.adSize && (
													<div className="flex items-center gap-1.5 mb-2 text-gray-600">
														<Ruler className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
														<span className="text-xs font-medium line-clamp-1">{result.adSize}</span>
													</div>
												)}
												
												{/* Ad Type */}
												{result.adType && (
													<div className="mb-2">
														<span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200">
															{result.adType}
														</span>
													</div>
												)}
												
												{/* Locations */}
												{result.specificLocation && (
													<div className="mt-auto pt-2 border-t border-gray-100">
														<div className="flex items-center gap-1 mb-1">
															<MapPin className="w-3 h-3 text-green-500" />
															<span className="text-xs font-semibold text-gray-500">
																Location:
															</span>
														</div>
														<div className="text-xs text-gray-700 line-clamp-2">
															{result.specificLocation}
														</div>
													</div>
												)}
											</div>
										</motion.div>
									))}
								</div>
							</div>
						) : (
							<div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
								<div className="max-w-md mx-auto">
									<AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
									<h3 className="text-2xl font-bold text-gray-800 mb-3">No Results Found</h3>
									<p className="text-gray-600 mb-2">
										We couldn't find any services matching your criteria.
									</p>
									<p className="text-sm text-gray-500">
										Try adjusting your filters or selecting "All Locations" and "All Services"
									</p>
								</div>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Image Popup Modal */}
			<AnimatePresence>
				{selectedImage && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
						onClick={() => setSelectedImage(null)}
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							transition={{ type: 'spring', damping: 25 }}
							className="relative max-w-5xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Close Button */}
							<button
								onClick={() => setSelectedImage(null)}
								className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
							>
								<X className="w-6 h-6" />
							</button>

							{/* Only the image, no title */}
							<img
								src={selectedImage.url}
								alt=""
								className="w-full h-full object-contain"
								style={{ maxHeight: '90vh' }}
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default SearchFilter;
