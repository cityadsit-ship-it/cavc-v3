import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Grid3X3, ChevronDown } from 'lucide-react';
import { serviceData } from './ServicesData';

const SearchFilter = ({ onFilterChange }) => {
	const [selectedLocation, setSelectedLocation] = useState('all');
	const [selectedService, setSelectedService] = useState('all');
	const [showLocationDropdown, setShowLocationDropdown] = useState(false);
	const [showServiceDropdown, setShowServiceDropdown] = useState(false);

	// Extract unique locations from serviceData
	const locationData = [
		{ id: 'all', name: 'All Locations' },
		...Array.from(new Set(serviceData.flatMap(s => s.locations || []))).map(loc => ({
			id: loc.toLowerCase().replace(/\s+/g, '-'),
			name: loc
		}))
	];

	const handleLocationChange = (locationId) => {
		setSelectedLocation(locationId);
		setShowLocationDropdown(false);
	};

	const handleServiceChange = (serviceId) => {
		setSelectedService(serviceId);
		setShowServiceDropdown(false);
	};

	const handleSearch = () => {
		onFilterChange?.({ location: selectedLocation, service: selectedService });
	};

	const selectedLocationName = locationData.find(l => l.id === selectedLocation)?.name || 'All Locations';
	const selectedServiceName = serviceData.find(s => s.id === selectedService)?.title || 'All Services';

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			className="my-16"
		>
			<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
				<div className="flex flex-col md:flex-row gap-4">
					{/* Location Dropdown */}
					<div className="flex-1 relative">
						<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
							<MapPin className="w-4 h-4 text-green-500" />
							Location
						</label>
						<button
							onClick={() => {
								setShowLocationDropdown(!showLocationDropdown);
								setShowServiceDropdown(false);
							}}
							className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-left hover:border-green-500 transition-colors focus:outline-none focus:border-green-500 flex items-center justify-between"
						>
							<span className={selectedLocation === 'all' ? 'text-gray-500' : 'text-gray-800 font-medium'}>
								{selectedLocationName}
							</span>
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
										className="absolute z-[101] mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-y-auto"
									>
										{locationData.map((location) => (
											<button
												key={location.id}
												onClick={() => handleLocationChange(location.id)}
												className={`w-full px-4 py-3 text-left hover:bg-green-500 hover:text-white transition-colors ${
													selectedLocation === location.id
														? 'bg-green-500 text-white font-medium'
														: 'text-gray-700'
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
					<div className="flex-1 relative">
						<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
							<Grid3X3 className="w-4 h-4 text-green-500" />
							Service Type
						</label>
						<button
							onClick={() => {
								setShowServiceDropdown(!showServiceDropdown);
								setShowLocationDropdown(false);
							}}
							className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-left hover:border-green-500 transition-colors focus:outline-none focus:border-green-500 flex items-center justify-between"
						>
							<span className={selectedService === 'all' ? 'text-gray-500' : 'text-gray-800 font-medium'}>
								{selectedServiceName}
							</span>
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
												onClick={() => handleServiceChange(service.id)}
												className={`w-full px-4 py-3 text-left hover:bg-green-500 hover:text-white transition-colors ${
													selectedService === service.id
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

					{/* Search Button */}
					<div className="md:pt-8">
						<button
							onClick={handleSearch}
							className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
						>
							<Search className="w-5 h-5" />
							Search
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default SearchFilter;
