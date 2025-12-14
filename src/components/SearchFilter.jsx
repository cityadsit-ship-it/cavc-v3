import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Grid3X3, ChevronDown, AlertCircle, Ruler, X, Loader2 } from 'lucide-react';
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
	const [imageLoading, setImageLoading] = useState({});
	const [popupImageLoading, setPopupImageLoading] = useState(true);
	const [locationSearchTerm, setLocationSearchTerm] = useState('');
	const [serviceSearchTerm, setServiceSearchTerm] = useState('');
	const [showVariousLocations, setShowVariousLocations] = useState(false);
	const [showClientRequirement, setShowClientRequirement] = useState(false);
	const searchTimeoutRef = useRef(null);
	const isInitialMount = useRef(true);
	const locationInputRef = useRef(null);
	const serviceInputRef = useRef(null);
	const imageCache = useRef({});
	const fullImageCache = useRef({});
	const variousLocationsSectionRef = useRef(null);
	const clientRequirementSectionRef = useRef(null);

	// Memoize locationData to prevent recalculation on every render
	const locationData = useMemo(() => [
		{ id: 'all', name: 'All Locations', type: 'all' },
		{ id: 'metro-manila', name: '── Metro Manila ──', type: 'header', disabled: true },
		...metroManilaLocations
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(loc => ({
				id: loc.name.toLowerCase().replace(/\s+/g, '-'),
				name: loc.name,
				type: 'metro'
			})),
		{ id: 'provincial', name: '── Provincial ──', type: 'header', disabled: true },
		...provincialLocations
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(loc => ({
				id: loc.name.toLowerCase().replace(/\s+/g, '-'),
				name: loc.name,
				type: 'provincial'
			}))
	], []);

	// Filter locations based on search term
	const filteredLocationData = useMemo(() => {
		if (!locationSearchTerm) return locationData;
		
		const searchLower = locationSearchTerm.toLowerCase();
		return locationData.filter(location => {
			if (location.type === 'header') return true; // Keep headers
			return location.name.toLowerCase().includes(searchLower);
		});
	}, [locationData, locationSearchTerm]);

	// Filter services based on search term
	const filteredServiceData = useMemo(() => {
		if (!serviceSearchTerm) return serviceData;
		
		const searchLower = serviceSearchTerm.toLowerCase();
		return serviceData.filter(service => 
			service.title.toLowerCase().includes(searchLower)
		);
	}, [serviceSearchTerm]);

	// Preload all images from serviceData on mount
	useEffect(() => {
		serviceData.forEach(service => {
			if (service.galleryItems && service.galleryItems.length > 0) {
				service.galleryItems.forEach((item, idx) => {
					const resultId = `${service.id}-${idx}`;
					
					// Preload display image (webp)
					if (item.webp && !imageCache.current[resultId]) {
						const img = new window.Image();
						img.src = item.webp;
						imageCache.current[resultId] = img;
						
						img.onload = () => {
							setImageLoading(prev => ({ ...prev, [resultId]: 'loaded' }));
						};
					}
					
					// Preload full image (jpg) for popup
					if (item.jpg && !fullImageCache.current[resultId]) {
						const fullImg = new window.Image();
						fullImg.src = item.jpg;
						fullImageCache.current[resultId] = fullImg;
					}
				});
			}
		});
	}, []);

	// Remove initial search on component mount
	// (Commented out to prevent auto-search on page load)
	// useEffect(() => {
	// 	if (isInitialMount.current) {
	// 		isInitialMount.current = false;
	// 		const timer = setTimeout(() => {
	// 			handleSearch();
	// 		}, 500);
	// 		return () => clearTimeout(timer);
	// 	}
	// }, []);

	// Instant auto-search after first manual search (removed 3-second delay)
	useEffect(() => {
		if (!autoSearchEnabled) return;
		
		// Trigger search immediately when dropdowns change
		handleSearch();
	}, [selectedLocation, selectedService, autoSearchEnabled]);

	// Focus input when dropdown opens
	useEffect(() => {
		if (showLocationDropdown && locationInputRef.current) {
			setTimeout(() => locationInputRef.current?.focus(), 100);
		}
	}, [showLocationDropdown]);

	useEffect(() => {
		if (showServiceDropdown && serviceInputRef.current) {
			setTimeout(() => serviceInputRef.current?.focus(), 100);
		}
	}, [showServiceDropdown]);

	// Memoize handlers to prevent recreation
	const handleLocationChange = useCallback((locationId) => {
		const location = locationData.find(l => l.id === locationId);
		if (location && !location.disabled) {
			setSelectedLocation(locationId);
			setShowLocationDropdown(false);
			setLocationSearchTerm('');
		}
	}, [locationData]);

	const handleServiceChange = useCallback((serviceId) => {
		setSelectedService(serviceId);
		setShowServiceDropdown(false);
		setServiceSearchTerm('');
	}, []);

	const handleSearch = useCallback(() => {
		// Only show loading state for manual searches or initial search
		if (!autoSearchEnabled || !hasSearched) {
			setIsSearching(true);
		}
		setHasSearched(true);
		setAutoSearchEnabled(true);

		// Use requestAnimationFrame for smoother transitions
		requestAnimationFrame(() => {
			// Minimal delay for smooth transition
			const delay = autoSearchEnabled && hasSearched ? 100 : 200;
			
			setTimeout(() => {
				// Filter services based on selection
				let filteredServices = [...serviceData];
				
				if (selectedService !== 'all') {
					filteredServices = serviceData.filter(s => s.id === parseInt(selectedService));
				}
				
				// Flatten gallery items for search results using modalDetails
				const resultsWithImages = filteredServices.flatMap(service => {
					if (service.galleryItems && service.galleryItems.length > 0) {
						return service.galleryItems.map((item, idx) => {
							// Extract location from modalDetails
							const modalDetails = item.modalDetails || {};
							const location = modalDetails['Location'] || modalDetails['Locations'] || modalDetails['Route'] || '';
							
							const resultId = `${service.id}-${idx}`;
							
							return {
								id: resultId,
								serviceId: service.id,
								serviceTitle: service.title,
								displayImage: item.webp,
								fullImage: item.jpg,
								modalDescription: item.modalDescription,
								modalDetails: modalDetails,
								specificLocation: location,
							};
						});
					}
					return [];
				});

				// Filter and categorize by location
				let exactMatches = [];
				let variousLocationMatches = [];
				let clientRequirementMatches = [];
				let transitAdsMatches = [];
				
				// Extract all Transit Ads (moving ads - relevant for all locations)
				const transitAdsService = serviceData.find(s => s.title.toLowerCase().includes('transit'));
				if (transitAdsService && transitAdsService.galleryItems) {
					transitAdsMatches = transitAdsService.galleryItems.map((item, idx) => {
						const modalDetails = item.modalDetails || {};
						const location = modalDetails['Location'] || modalDetails['Locations'] || modalDetails['Route'] || '';
						const resultId = `${transitAdsService.id}-${idx}`;
						
						return {
							id: resultId,
							serviceId: transitAdsService.id,
							serviceTitle: transitAdsService.title,
							displayImage: item.webp,
							fullImage: item.jpg,
							modalDescription: item.modalDescription,
							modalDetails: modalDetails,
							specificLocation: location,
						};
					});
				}
				
				if (selectedLocation !== 'all') {
					const selectedLoc = locationData.find(l => l.id === selectedLocation);
					const searchTerm = selectedLoc?.name.toLowerCase() || '';
					
					// Extract significant words (longer than 3 characters to avoid common words)
					const searchWords = searchTerm.split(' ').filter(word => word.length > 3);
					
					resultsWithImages.forEach(result => {
						const location = result.specificLocation?.toLowerCase() || '';
						const description = result.modalDescription?.toLowerCase() || '';
						
						// Check for "Various Location" or similar
						if (location.includes("various") || location.includes("all locations")) {
							variousLocationMatches.push(result);
							return;
						}
						
						// Check for "Client's requirement" or similar
						if (location.includes("client") || location.includes("requirement")) {
							clientRequirementMatches.push(result);
							return;
						}
						
						// Strict matching: location must contain the EXACT search term or ALL significant words
						let isMatch = false;
						let matchScore = 0;
						
						// Exact full match gets highest priority
						if (location.includes(searchTerm)) {
							isMatch = true;
							matchScore = 100;
						} else if (searchWords.length > 0) {
							// For multi-word locations (e.g., "Quezon City"), check if ALL words are present
							const allWordsMatch = searchWords.every(word => location.includes(word));
							
							if (allWordsMatch) {
								isMatch = true;
								matchScore = 80;
							}
						}
						
						// Additional scoring for description matches (lower priority)
						if (isMatch && description.includes(searchTerm)) {
							matchScore += 10;
						}
						
						if (isMatch) {
							exactMatches.push({ ...result, matchScore });
						}
					});
					
					// Sort exact matches by score (highest first)
					exactMatches.sort((a, b) => b.matchScore - a.matchScore);
					
					// Add Transit Ads to the end of exact matches (always relevant for all locations)
					exactMatches = [...exactMatches, ...transitAdsMatches];
				} else {
					// If "All Locations" selected, show all results as exact matches
					exactMatches = resultsWithImages.map(result => {
						const location = result.specificLocation?.toLowerCase() || '';
						
						if (location.includes("various") || location.includes("all locations")) {
							variousLocationMatches.push(result);
							return null;
						}
						if (location.includes("client") || location.includes("requirement")) {
							clientRequirementMatches.push(result);
							return null;
						}
						return result;
					}).filter(Boolean);
					
					// Add Transit Ads to the end when showing all locations
					exactMatches = [...exactMatches, ...transitAdsMatches];
				}
				
				// Combine results: exact matches (including transit ads at the end), then various/client (shown separately)
				const finalResults = {
					exact: exactMatches,
					transit: [], // Empty since transit ads are now in exact matches
					various: variousLocationMatches,
					client: clientRequirementMatches
				};
				
				setSearchResults(finalResults);
				setShowVariousLocations(false);
				setShowClientRequirement(false);
				setIsSearching(false);
			}, delay);
		});
	}, [selectedService, selectedLocation, locationData, autoSearchEnabled, hasSearched]);

	const handleImageLoad = useCallback((resultId) => {
		setImageLoading(prev => ({ ...prev, [resultId]: 'loaded' }));
	}, []);

	const handleImageError = useCallback((resultId) => {
		setImageLoading(prev => ({ ...prev, [resultId]: 'loaded' }));
	}, []);

	const toggleVariousLocations = useCallback(() => {
		if (showVariousLocations) {
			// Scroll to section when collapsing
			variousLocationsSectionRef.current?.scrollIntoView({ 
				behavior: 'smooth', 
				block: 'start'
			});
		}
		setShowVariousLocations(!showVariousLocations);
	}, [showVariousLocations]);

	const toggleClientRequirement = useCallback(() => {
		if (showClientRequirement) {
			// Scroll to section when collapsing
			clientRequirementSectionRef.current?.scrollIntoView({ 
				behavior: 'smooth', 
				block: 'start'
			});
		}
		setShowClientRequirement(!showClientRequirement);
	}, [showClientRequirement]);

	const openImagePopup = useCallback((imageUrl, title) => {
		// Check if image is already cached
		const cachedImage = Object.values(fullImageCache.current).find(img => img.src === imageUrl);
		
		if (cachedImage && cachedImage.complete) {
			setPopupImageLoading(false);
		} else {
			setPopupImageLoading(true);
		}
		
		setSelectedImage({ url: imageUrl, title });
	}, []);

	// Memoize selected names
	const selectedLocationName = useMemo(() => 
		locationData.find(l => l.id === selectedLocation)?.name || 'All Locations',
		[locationData, selectedLocation]
	);
	
	const selectedServiceName = useMemo(() => 
		serviceData.find(s => s.id === parseInt(selectedService))?.title || 'All Services',
		[selectedService]
	);

	return (
		<div className="my-16 mb-24">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.3 }}
			>
				<div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
					<div className="flex flex-col md:flex-row gap-3 md:gap-4">
						{/* Location Dropdown with Search */}
						<div className="flex-1 relative min-w-0">
							<button
								onClick={() => {
									setShowLocationDropdown(!showLocationDropdown);
									setShowServiceDropdown(false);
									setServiceSearchTerm('');
								}}
								className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-left hover:border-green-500 transition-colors focus:outline-none focus:border-green-500 flex items-center justify-between"
								aria-label="Select location"
								aria-expanded={showLocationDropdown}
							>
								<div className="flex items-center gap-2 min-w-0">
									<MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
									<span className={`${selectedLocation === 'all' ? 'text-gray-400' : 'text-gray-800 font-medium'} truncate`}>
										{selectedLocationName}
									</span>
								</div>
								<ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${showLocationDropdown ? 'rotate-180' : ''}`} />
							</button>
							
							<AnimatePresence mode="wait">
								{showLocationDropdown && (
									<>
										<div
											className="fixed inset-0 z-[100]"
											onClick={() => {
												setShowLocationDropdown(false);
												setLocationSearchTerm('');
											}}
											aria-hidden="true"
										/>
										<motion.div
											initial={{ opacity: 0, y: -10, scale: 0.95 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: -10, scale: 0.95 }}
											transition={{ duration: 0.15, ease: 'easeOut' }}
											className="absolute z-[101] mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-2xl overflow-hidden"
										>
											{/* Search Input */}
											<div className="p-3 border-b border-gray-200 bg-gray-50">
												<input
													ref={locationInputRef}
													type="text"
													value={locationSearchTerm}
													onChange={(e) => setLocationSearchTerm(e.target.value)}
													placeholder="Type to search locations..."
													className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
													onClick={(e) => e.stopPropagation()}
												/>
											</div>
											
											{/* Dropdown List */}
											<div className="max-h-80 overflow-y-auto">
												{filteredLocationData.length === 0 ? (
													<div className="px-4 py-3 text-sm text-gray-500 text-center">
														No locations found
													</div>
												) : (
													filteredLocationData.map((location) => (
														<button
															key={location.id}
															onClick={() => handleLocationChange(location.id)}
															disabled={location.disabled}
															className={`w-full px-4 py-3 text-left transition-colors duration-150 ${
																location.type === 'header'
																	? 'bg-gray-100 text-gray-500 text-xs font-bold cursor-default'
																	: selectedLocation === location.id
																	? 'bg-green-500 text-white font-medium'
																	: 'text-gray-700 hover:bg-green-500 hover:text-white'
															}`}
														>
															{location.name}
														</button>
													))
												)}
											</div>
										</motion.div>
									</>
								)}
							</AnimatePresence>
						</div>

						{/* Service Dropdown with Search */}
						<div className="flex-1 relative min-w-0">
							<button
								onClick={() => {
									setShowServiceDropdown(!showServiceDropdown);
									setShowLocationDropdown(false);
									setLocationSearchTerm('');
								}}
								className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-left hover:border-green-500 transition-colors focus:outline-none focus:border-green-500 flex items-center justify-between"
								aria-label="Select service type"
								aria-expanded={showServiceDropdown}
							>
								<div className="flex items-center gap-2 min-w-0">
									<Grid3X3 className="w-4 h-4 text-green-500 flex-shrink-0" />
									<span className={`${selectedService === 'all' ? 'text-gray-400' : 'text-gray-800 font-medium'} truncate`}>
										{selectedServiceName}
									</span>
								</div>
								<ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${showServiceDropdown ? 'rotate-180' : ''}`} />
							</button>
							
							<AnimatePresence mode="wait">
								{showServiceDropdown && (
									<>
										<div
											className="fixed inset-0 z-[100]"
											onClick={() => {
												setShowServiceDropdown(false);
												setServiceSearchTerm('');
											}}
											aria-hidden="true"
										/>
										<motion.div
											initial={{ opacity: 0, y: -10, scale: 0.95 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: -10, scale: 0.95 }}
											transition={{ duration: 0.15, ease: 'easeOut' }}
											className="absolute z-[101] mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-2xl overflow-hidden"
										>
											{/* Search Input */}
											<div className="p-3 border-b border-gray-200 bg-gray-50">
												<input
													ref={serviceInputRef}
													type="text"
													value={serviceSearchTerm}
													onChange={(e) => setServiceSearchTerm(e.target.value)}
													placeholder="Type to search services..."
													className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
													onClick={(e) => e.stopPropagation()}
												/>
											</div>
											
											{/* Dropdown List */}
											<div className="max-h-64 overflow-y-auto">
												<button
													onClick={() => handleServiceChange('all')}
													className={`w-full px-4 py-3 text-left hover:bg-green-500 hover:text-white transition-colors duration-150 ${
														selectedService === 'all'
															? 'bg-green-500 text-white font-medium'
															: 'text-gray-700'
													}`}
												>
													All Services
												</button>
												{filteredServiceData.length === 0 ? (
													<div className="px-4 py-3 text-sm text-gray-500 text-center">
														No services found
													</div>
												) : (
													filteredServiceData.map((service) => (
														<button
															key={service.id}
															onClick={() => handleServiceChange(service.id.toString())}
															className={`w-full px-4 py-3 text-left hover:bg-green-500 hover:text-white transition-colors duration-150 ${
																selectedService === service.id.toString()
																	? 'bg-green-500 text-white font-medium'
																	: 'text-gray-700'
															}`}
														>
															{service.title}
														</button>
													))
												)}
											</div>
										</motion.div>
									</>
								)}
							</AnimatePresence>
						</div>

						{/* Search Button */}
						<div className="hidden md:block">
							<button
								onClick={handleSearch}
								disabled={isSearching}
								className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
								aria-label="Search services"
							>
								<Search className={`w-5 h-5 ${isSearching ? 'animate-spin' : ''}`} />
								{isSearching ? 'Searching...' : 'Search'}
							</button>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Search Results */}
			<AnimatePresence mode="wait">
				{hasSearched && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className="mt-6 mb-16"
					>
						{isSearching ? (
							<div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
								<div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-500 mb-4"></div>
								<p className="text-gray-600 font-medium">Searching for services...</p>
							</div>
						) : searchResults && (searchResults.exact?.length > 0 || searchResults.various?.length > 0 || searchResults.client?.length > 0) ? (
							<div className="space-y-6">
								{/* No Exact Matches Message - Show when only Explore More sections exist */}
								{searchResults.exact?.length === 0 && (searchResults.various?.length > 0 || searchResults.client?.length > 0) && (
									<div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-lg p-6 sm:p-8 border border-orange-100">
										<div className="text-center max-w-2xl mx-auto">
											<div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
												<AlertCircle className="w-8 h-8 text-orange-500" />
											</div>
											<h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
												Oops! No Exact Match Found
											</h3>
											<p className="text-gray-600 mb-1">
												We couldn't find services that exactly match your selected location.
											</p>
											<p className="text-sm text-gray-500 mb-4">
												But don't worry! Check out our alternative options below that might interest you.
											</p>
											<div className="inline-flex items-center gap-2 text-orange-600 font-semibold">
												<span className="animate-bounce">👇</span>
												<span>Explore More Options Below</span>
												<span className="animate-bounce">👇</span>
											</div>
										</div>
									</div>
								)}

								{/* Exact Matches Section (now includes Transit Ads at the end) */}
								{searchResults.exact?.length > 0 && (
									<div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-4 sm:p-8 border border-green-100">
										<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-2">
											<h3 className="text-xl sm:text-2xl font-bold text-gray-800">
												Search Results
											</h3>
											<span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
												{searchResults.exact.length} {searchResults.exact.length === 1 ? 'Result' : 'Results'} Found
											</span>
										</div>
										<div className="grid gap-4 sm:gap-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
											{searchResults.exact.map((result, index) => (
												<motion.div
													key={result.id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
													className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-200 hover:border-green-500 group flex flex-col"
												>
													{/* Image Section */}
													<div 
														className="relative h-48 xs:h-56 sm:h-56 md:h-48 xl:h-56 bg-gray-100 overflow-hidden cursor-pointer"
														onClick={() => openImagePopup(result.fullImage, result.modalDescription)}
													>
														<img 
															src={result.displayImage} 
															alt={result.modalDescription}
															loading="lazy"
															className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 will-change-transform ${
																imageLoading[result.id] === 'loaded'
																	? 'blur-0 opacity-100'
																	: imageCache.current[result.id]?.complete
																	? 'blur-0 opacity-100'
																	: 'blur-sm opacity-70'
															}`}
															onLoad={() => handleImageLoad(result.id)}
															onError={() => handleImageError(result.id)}
														/>
														<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
															<span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-green-600 px-3 py-1 rounded-full">
																View Full Image
															</span>
														</div>
														<div className="absolute top-2 right-2 bg-orange-500 px-2.5 py-1 rounded-full shadow-md">
															<span className="text-xs font-bold text-white">
																{result.serviceTitle}
															</span>
														</div>
													</div>
													{/* Content Section */}
													<div className="p-3 sm:p-4 flex-1 flex flex-col">
														<h4 className="font-bold text-xs sm:text-sm text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
															{result.modalDescription}
														</h4>
														{result.modalDetails && Object.entries(result.modalDetails)
															.filter(([key]) => !key.toLowerCase().includes('location') && !key.toLowerCase().includes('landmarks'))
															.slice(0, 2)
															.map(([key, value]) => (
																<div key={key} className="flex items-start gap-1.5 mb-1.5 text-gray-600">
																	{key.toLowerCase().includes('size') ? (
																		<Ruler className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
																	) : (
																		<div className="w-3.5 h-3.5 rounded-full bg-green-500 flex-shrink-0 mt-1" />
																	)}
																	<div className="flex-1 min-w-0">
																		<span className="text-[10px] font-semibold text-gray-500 uppercase block">{key}:</span>
																		<span className="text-xs font-medium line-clamp-2">{value}</span>
																	</div>
																</div>
															))}
														{result.specificLocation && (
															<div className="mt-auto pt-2 border-t border-gray-100">
																<div className="flex items-center gap-1 mb-1">
																	<MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
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
								)}

								{/* Various Locations Section */}
								{searchResults.various?.length > 0 && (
									<div ref={variousLocationsSectionRef} className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-4 sm:p-8 border border-green-100">
										<div className="flex items-center justify-between mb-6">
											<div>
												<h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
													Explore More - Various Locations
												</h3>
												<p className="text-sm text-gray-600">Projects available across multiple areas</p>
											</div>
											<span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
												{searchResults.various.length}
											</span>
										</div>
										<div className="grid gap-4 sm:gap-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
											{(showVariousLocations ? searchResults.various : searchResults.various.slice(0, 4)).map((result, index) => (
												<motion.div
													key={result.id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
													className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-200 hover:border-green-500 group flex flex-col"
												>
													<div 
														className="relative h-48 xs:h-56 sm:h-56 md:h-48 xl:h-56 bg-gray-100 overflow-hidden cursor-pointer"
														onClick={() => openImagePopup(result.fullImage, result.modalDescription)}
													>
														<img 
															src={result.displayImage} 
															alt={result.modalDescription}
															loading="lazy"
															className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 will-change-transform ${
																imageLoading[result.id] === 'loaded'
																	? 'blur-0 opacity-100'
																	: imageCache.current[result.id]?.complete
																	? 'blur-0 opacity-100'
																	: 'blur-sm opacity-70'
															}`}
															onLoad={() => handleImageLoad(result.id)}
															onError={() => handleImageError(result.id)}
														/>
														<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
															<span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-green-600 px-3 py-1 rounded-full">
																View Full Image
															</span>
														</div>
														<div className="absolute top-2 right-2 bg-orange-500 px-2.5 py-1 rounded-full shadow-md">
															<span className="text-xs font-bold text-white">
																{result.serviceTitle}
															</span>
														</div>
													</div>
													<div className="p-3 sm:p-4 flex-1 flex flex-col">
														<h4 className="font-bold text-xs sm:text-sm text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
															{result.modalDescription}
														</h4>
														{result.modalDetails && Object.entries(result.modalDetails)
															.filter(([key]) => !key.toLowerCase().includes('location') && !key.toLowerCase().includes('landmarks'))
															.slice(0, 2)
															.map(([key, value]) => (
																<div key={key} className="flex items-start gap-1.5 mb-1.5 text-gray-600">
																	{key.toLowerCase().includes('size') ? (
																		<Ruler className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
																	) : (
																		<div className="w-3.5 h-3.5 rounded-full bg-green-500 flex-shrink-0 mt-1" />
																	)}
																	<div className="flex-1 min-w-0">
																		<span className="text-[10px] font-semibold text-gray-500 uppercase block">{key}:</span>
																		<span className="text-xs font-medium line-clamp-2">{value}</span>
																	</div>
																</div>
															))}
														{result.specificLocation && (
															<div className="mt-auto pt-2 border-t border-gray-100">
																<div className="flex items-center gap-1 mb-1">
																	<MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
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
										{searchResults.various.length > 4 && (
											<div className="mt-6 text-center">
												<button
													onClick={toggleVariousLocations}
													className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
												>
													{showVariousLocations ? 'Show Less' : `See More (${searchResults.various.length - 4} more)`}
												</button>
											</div>
										)}
									</div>
								)}

								{/* Client's Requirement Section */}
								{searchResults.client?.length > 0 && (
									<div ref={clientRequirementSectionRef} className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-4 sm:p-8 border border-green-100">
										<div className="flex items-center justify-between mb-6">
											<div>
												<h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
													Explore More - Client's Requirement
												</h3>
												<p className="text-sm text-gray-600">Custom projects tailored to specific needs</p>
											</div>
											<span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
												{searchResults.client.length}
											</span>
										</div>
										<div className="grid gap-4 sm:gap-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
											{(showClientRequirement ? searchResults.client : searchResults.client.slice(0, 4)).map((result, index) => (
												<motion.div
													key={result.id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
													className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-200 hover:border-green-500 group flex flex-col"
												>
													<div 
														className="relative h-48 xs:h-56 sm:h-56 md:h-48 xl:h-56 bg-gray-100 overflow-hidden cursor-pointer"
														onClick={() => openImagePopup(result.fullImage, result.modalDescription)}
													>
														<img 
															src={result.displayImage} 
															alt={result.modalDescription}
															loading="lazy"
															className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 will-change-transform ${
																imageLoading[result.id] === 'loaded'
																	? 'blur-0 opacity-100'
																	: imageCache.current[result.id]?.complete
																	? 'blur-0 opacity-100'
																	: 'blur-sm opacity-70'
															}`}
															onLoad={() => handleImageLoad(result.id)}
															onError={() => handleImageError(result.id)}
														/>
														<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
															<span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-green-600 px-3 py-1 rounded-full">
																View Full Image
															</span>
														</div>
														<div className="absolute top-2 right-2 bg-orange-500 px-2.5 py-1 rounded-full shadow-md">
															<span className="text-xs font-bold text-white">
																{result.serviceTitle}
															</span>
														</div>
													</div>
													<div className="p-3 sm:p-4 flex-1 flex flex-col">
														<h4 className="font-bold text-xs sm:text-sm text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
															{result.modalDescription}
														</h4>
														{result.modalDetails && Object.entries(result.modalDetails)
															.filter(([key]) => !key.toLowerCase().includes('location') && !key.toLowerCase().includes('landmarks'))
															.slice(0, 2)
															.map(([key, value]) => (
																<div key={key} className="flex items-start gap-1.5 mb-1.5 text-gray-600">
																	{key.toLowerCase().includes('size') ? (
																		<Ruler className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
																	) : (
																		<div className="w-3.5 h-3.5 rounded-full bg-green-500 flex-shrink-0 mt-1" />
																	)}
																	<div className="flex-1 min-w-0">
																		<span className="text-[10px] font-semibold text-gray-500 uppercase block">{key}:</span>
																		<span className="text-xs font-medium line-clamp-2">{value}</span>
																	</div>
																</div>
															))}
														{result.specificLocation && (
															<div className="mt-auto pt-2 border-t border-gray-100">
																<div className="flex items-center gap-1 mb-1">
																	<MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
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
										{searchResults.client.length > 4 && (
											<div className="mt-6 text-center">
												<button
													onClick={toggleClientRequirement}
													className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
												>
													{showClientRequirement ? 'Show Less' : `See More (${searchResults.client.length - 4} more)`}
												</button>
											</div>
										)}
									</div>
								)}
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
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
						onClick={() => setSelectedImage(null)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							transition={{ duration: 0.2, ease: 'easeOut' }}
							className="relative max-w-5xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							<button
								onClick={() => setSelectedImage(null)}
								className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
								aria-label="Close image"
							>
								<X className="w-6 h-6" />
							</button>
							
							{/* Loading State - Only show if not cached */}
							{popupImageLoading && (
								<div className="absolute inset-0 flex items-center justify-center bg-gray-100">
									<div className="text-center">
										<Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
										<p className="text-gray-600 font-medium">Loading image...</p>
									</div>
								</div>
							)}
							
							<img
								src={selectedImage.url}
								alt={selectedImage.title}
								className={`w-full h-full object-contain transition-opacity duration-300 ${
									popupImageLoading ? 'opacity-0' : 'opacity-100'
								}`}
								style={{ maxHeight: '90vh' }}
								onLoad={() => setPopupImageLoading(false)}
								onError={() => setPopupImageLoading(false)}
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default SearchFilter;
