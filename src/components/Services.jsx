import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import { serviceData } from './ServicesData';
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
			<div className="relative h-72 overflow-hidden cursor-pointer">
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
					<div className="bg-gradient-to-r from-accent-green via-lime-green to-transparent p-4 text-white transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
						<h3 className="text-xl font-bold mb-1 drop-shadow-lg">{service.title}</h3>
						<p className="text-sm opacity-90 drop-shadow-lg">{service.imageCount} images</p>
					</div>
								</div>

								{/* Gallery hint (hidden by default) */}
				<div className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
					Click to view gallery
				</div>

				{/* Center play/gallery icon on hover */}
				<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
					<div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 border-2 border-white border-opacity-50">
						<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
				</div>
			</div>

			{/* Info block below image - only description (larger for better UI) */}
			<div className="p-6 bg-white">
				<p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-0">
					{service.description}
				</p>
			</div>
		</motion.div>
	);
};

const Services = () => {
	const [selectedService, setSelectedService] = useState(null);
	const [downloading, setDownloading] = useState(false);
	const [filters, setFilters] = useState({ location: 'all', service: 'all' });

	const openGallery = (service) => setSelectedService(service);
	const closeGallery = () => setSelectedService(null);

	const handleDownload = () => {
		setDownloading(true);
		setTimeout(() => {
			setDownloading(false);
			const link = document.createElement('a');
			link.href = '/company-profile.pdf';
			link.download = 'company-profile.pdf';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
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
			className="py-4 bg-gradient-to-b from-gray-50 to-white"
		>
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h2 className="text-4xl font-bold text-primary-dark mb-4">
						Our{' '}
						<span className="text-accent-green">Advertising Solutions</span>
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Comprehensive outdoor advertising services with proven results. <br />
						Click on any services to explore our products and services
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
						className="text-center py-12"
					>
						<p className="text-gray-600 text-lg">
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
					className="mt-20"
				>
					<div className="bg-gradient-to-r from-primary-dark to-accent-green rounded-xl p-8 md:p-12 text-center shadow-xl">
						<h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
							Ready to Launch Your Campaign?
						</h3>
						<p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
							Our team of experts will help you select the perfect advertising
							solution and locations to maximize your brand's impact.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button
								onClick={() => (window.location.href = '#footer')}
								className="bg-orange-accent hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center group"
							>
								Contact Us
								<span className="ml-2 group-hover:translate-x-1 transition-transform">
									→
								</span>
							</button>
							<button
								onClick={handleDownload}
								disabled={downloading}
								className={`bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 backdrop-blur-sm flex items-center justify-center relative ${
									downloading ? 'cursor-wait opacity-70' : ''
								}`}
							>
								<Download className="w-5 h-5 mr-2" />
								{downloading ? (
									<span className="flex items-center">
										<span className="mr-2">Loading...</span>
										<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
									</span>
								) : (
									'Company Profile'
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
