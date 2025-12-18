import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import { serviceData as fallbackServiceData } from './ServicesData';
import useFetchTransformedServices from '../hooks/useFetchServices';
import ServiceGalleryModal from './ServiceGalleryModal';
import SearchFilter from './SearchFilter';

const ImageSkeleton = ({ className }) => (
	<div
		className={`bg-gray-200 animate-pulse ${className || ''}`}
		style={{
			background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
			backgroundSize: '200% 100%',
		}}
	/>
);

const ServiceCard = ({ service, index, onClick }) => {
	const [imgLoaded, setImgLoaded] = useState(false);
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			viewport={{ once: true }}
			className="group relative overflow-hidden rounded-2xl shadow-xl bg-white"
			onClick={() => onClick(service)}
		>
			{/* Image / clickable area */}
			<div className="relative h-40 sm:h-56 lg:h-64 xl:h-72 overflow-hidden cursor-pointer">
				{!imgLoaded && (
					<ImageSkeleton className="absolute inset-0 w-full h-full rounded-2xl" />
				)}
				<img
					src={service.mainImage}
					alt={service.title}
					className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${imgLoaded ? '' : 'invisible'}`}
					onLoad={() => setImgLoaded(true)}
					onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = service.mainImage; setImgLoaded(true); }}
				/>
				{/* dimming overlay */}
				<div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300" />

				{/* Bottom gradient title bar */}
				<div className="absolute bottom-0 left-0 right-0">
					<div className="bg-gradient-to-r from-accent-green via-lime-green to-transparent p-2 sm:p-3 lg:p-4 text-white transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
						<h3 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold mb-0.5 sm:mb-1 drop-shadow-lg leading-tight">{service.title}</h3>
						<p className="text-[10px] sm:text-xs opacity-90 drop-shadow-lg">{service.imageCount} images</p>
					</div>
				</div>

				{/* Gallery hint (hidden by default) */}
				<div className="hidden sm:block absolute top-2 sm:top-4 right-2 sm:right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
					Click to view gallery
				</div>
			</div>

			{/* Info block below image - only description (larger for better UI) */}
			<div className="p-2 sm:p-4 lg:p-6 bg-white">
				<p className="text-gray-800 text-[10px] xs:text-xs sm:text-sm lg:text-base leading-snug sm:leading-relaxed mb-0">
					{service.description}
				</p>
			</div>
		</motion.div>
	);
};

const Services = () => {
	const [selectedService, setSelectedService] = useState(null);
	const [downloading, setDownloading] = useState(false);
	const [downloaded, setDownloaded] = useState(false);
	const [filters, setFilters] = useState({ location: 'all', service: 'all' });
	const [companyProfilePDF, setCompanyProfilePDF] = useState('/company-profile.pdf');
	
	// Fetch services from API with fallback to static data
	const { services: apiServices, loading: apiLoading, error: apiError } = useFetchTransformedServices();
	const [serviceData, setServiceData] = useState(fallbackServiceData);

	useEffect(() => {
		// Use API data if available, otherwise use fallback
		if (apiServices && apiServices.length > 0) {
			console.log('✅ Using live API data from admin panel');
			setServiceData(apiServices);
		} else if (apiError) {
			console.warn('⚠️ API unavailable, using static fallback data');
			setServiceData(fallbackServiceData);
		}
	}, [apiServices, apiError]);

	const openGallery = (service) => setSelectedService(service);
	const closeGallery = () => setSelectedService(null);

	const handleDownload = () => {
		setDownloading(true);
		setTimeout(() => {
			setDownloading(false);
			setDownloaded(true);
			const link = document.createElement('a');
			link.href = companyProfilePDF;
			link.download = 'company-profile.pdf';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			
			// Re-enable button after 10 seconds
			setTimeout(() => {
				setDownloaded(false);
			}, 10000);
		}, 1200);
	};

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
		// You can add actual filtering logic here when you have location data in serviceData
		console.log('Filters applied:', newFilters);
	};

	// Filter services based on selected filters
	const filteredServices = serviceData.filter(service => {
		if (filters.service !== 'all' && service.id !== filters.service) {
			return false;
		}
		// Add location filtering logic here when location data is available in serviceData
		// if (filters.location !== 'all' && !service.locations?.includes(filters.location)) {
		//   return false;
		// }
		return true;
	});

	return (
		<section
			id="services"
			className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white"
		>
			<div className="container mx-auto px-3 sm:px-4 lg:px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-8 sm:mb-10 lg:mb-12"
				>
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-dark mb-3 sm:mb-4 px-2">
						Our{' '}
						<span className="text-accent-green">Advertising Solutions</span>
					</h2>
					<p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
						Comprehensive outdoor advertising services with proven results. <br />
						Click on any services to explore our products and services
					</p>
				</motion.div>

				<div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
					{filteredServices.map((service, index) => (
						<ServiceCard
							key={service.id}
							service={service}
							index={index}
							onClick={openGallery}
						/>
					))}
				</div>

				{/* Show message when no results */}
				{filteredServices.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-8 sm:py-12 px-4"
					>
						<p className="text-gray-600 text-sm sm:text-base lg:text-lg">
							No services found matching your filters. Try adjusting your search criteria.
						</p>
					</motion.div>
				)}

				{/* Search Filter Component */}
				<SearchFilter onFilterChange={handleFilterChange} />

				{/* CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
						className="mt-12 sm:mt-16 lg:mt-20"
					>
						<div className="bg-gradient-to-r from-primary-dark to-accent-green rounded-xl p-6 sm:p-8 lg:p-12 text-center shadow-xl">
							<h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 px-2">
								Ready to Launch Your Campaign?
							</h3>
							<p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
							Our team of experts will help you select the perfect advertising
							solution and locations to maximize your brand's impact.
						</p>
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
						<button
							onClick={() => (window.location.href = '#footer')}
							className="bg-orange-accent hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-300 flex items-center justify-center group text-sm sm:text-base w-full sm:w-auto"
							>
								Contact Us
								<span className="ml-2 group-hover:translate-x-1 transition-transform">
									→
								</span>
							</button>
							<button
								onClick={handleDownload}
								disabled={downloading || downloaded}
									className={`font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-300 backdrop-blur-sm flex items-center justify-center relative text-sm sm:text-base w-full sm:w-auto ${
									downloaded 
										? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-70' 
										: downloading 
										? 'bg-white/10 hover:bg-white/20 text-white cursor-wait opacity-70'
										: 'bg-white/10 hover:bg-white/20 text-white'
								}`}
							>
								{downloaded ? (
									<>
										<svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										Downloaded
									</>
								) : downloading ? (
									<>
										<span className="mr-1.5 sm:mr-2">Loading...</span>
										<span className="inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
									</>
								) : (
									<>
										<Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
										Corporate Profile
									</>
								)}
							</button>
						</div>
					</div>
				</motion.div>

				<AnimatePresence>
					{selectedService && (
						<ServiceGalleryModal
							service={selectedService}
							isOpen={!!selectedService}
							onClose={closeGallery}
						/>
					)}
				</AnimatePresence>
			</div>
		</section>
	);
};

export default Services;
