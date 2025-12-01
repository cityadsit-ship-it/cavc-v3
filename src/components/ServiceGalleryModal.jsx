import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Mail, Download } from 'lucide-react';
import { buildGallery } from './ServicesData';

const ImageSkeleton = ({ className }) => (
	<div
		className={`bg-gray-200 animate-pulse ${className || ''}`}
		style={{
			background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
			backgroundSize: '200% 100%',
			animation: 'shimmer 2s infinite',
		}}
	/>
);

const ServiceGalleryModal = ({ service, isOpen, onClose }) => {
	const [currentImage, setCurrentImage] = useState(0);
	const [imgLoaded, setImgLoaded] = useState(false);
	const [downloading, setDownloading] = useState(false);
	const [downloaded, setDownloaded] = useState(false);
	const [modalReady, setModalReady] = useState(false);
	const [thumbLoadStates, setThumbLoadStates] = useState({});
	const thumbnailRefs = useRef([]);
	const mobileThumbContainerRef = useRef(null);
	const desktopThumbContainerRef = useRef(null);
	const gallery = buildGallery(service); // now only webp, without main image

	// Preload first gallery image (no main image)
	useEffect(() => {
		if (isOpen && service && gallery.length) {
			setModalReady(false);
			const img = new Image();
			img.src = gallery[0].url;
			img.onload = () => {
				setModalReady(true);
				setImgLoaded(true);
			};
			img.onerror = () => {
				setModalReady(true);
				setImgLoaded(true);
			};
		}
	}, [isOpen, service]);

	useEffect(() => {
		setCurrentImage(0);
		setImgLoaded(false);
		setThumbLoadStates({});
	}, [service]);

	useEffect(() => {
		setImgLoaded(false);
	}, [currentImage]);

	// Auto-scroll thumbnail into view
	useEffect(() => {
		if (thumbnailRefs.current[currentImage]) {
			thumbnailRefs.current[currentImage].scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'center'
			});
		}
	}, [currentImage]);

	if (!isOpen || !service || !modalReady) return null;

	const nextImage = () => {
		if (currentImage < gallery.length - 1) setCurrentImage(currentImage + 1);
	};
	const prevImage = () => {
		if (currentImage > 0) setCurrentImage(currentImage - 1);
	};

	const handleDownload = () => {
		setDownloading(true);
		setTimeout(() => {
			setDownloading(false);
			setDownloaded(true);
			
			// Download the service PDF file
			const link = document.createElement('a');
			// Construct PDF filename based on service title
			const pdfFileName = `${service.title.toLowerCase().replace(/\s+/g, '-')}-cavc.pdf`;
			const pdfPath = service.pdfFile || `/pdfs/services/${pdfFileName}`;
			
			link.href = pdfPath;
			link.download = service.pdfFileName || pdfFileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			
			// Re-enable button after 10 seconds
			setTimeout(() => {
				setDownloaded(false);
			}, 10000);
		}, 1200);
	};

	const handleThumbLoad = (idx) => {
		setThumbLoadStates(prev => ({ ...prev, [idx]: true }));
	};

	// Get current gallery item for dynamic modal content
	const currentItem = gallery[currentImage] || {};
	const currentModalDescription = currentItem.modalDescription || service.modalDescription || service.title;
	
	// Get modal details from current item or fallback to service level
	const modalDetails = currentItem.modalDetails 
		? Object.entries(currentItem.modalDetails).map(([label, value]) => ({ label, value }))
		: (service.standardSize || service.locations)
		? [
			service.standardSize && { label: 'STANDARD SIZE', value: service.standardSize },
			service.locations && { label: 'LOCATIONS', value: service.locations },
		].filter(Boolean)
		: [
			{ label: 'Ad Size', value: service.adSize },
			{ label: 'Material', value: service.material },
			{ label: 'Location', value: service.location },
		];

	const detailColsClass =
		modalDetails.length === 1 ? 'grid-cols-1'
		: modalDetails.length === 2 ? 'grid-cols-2'
		: 'grid-cols-3';

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
			onClick={onClose}
		>
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
			<motion.div
				initial={{ scale: 0.98, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.98, opacity: 0 }}
				className="relative w-full h-full sm:h-auto sm:max-h-[95vh] max-w-7xl mx-auto bg-white/90 rounded-lg sm:rounded-2xl shadow-2xl border border-gray-200 flex flex-col md:flex-row overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Main content */}
				<div className="flex-1 flex flex-col min-h-0 overflow-hidden">
					{/* Gradient header: title + description + details */}
					<div className="flex items-start justify-between flex-shrink-0">
						<div className="w-full bg-gradient-to-r from-primary-dark via-accent-green to-primary-dark p-3 sm:p-4 rounded-t-lg sm:rounded-t-2xl relative">
							<h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 drop-shadow-sm pr-8">
								{currentModalDescription}
							</h3>
							{/* Dynamic details grid - wraps at 3 columns, 4th item goes to new row */}
							<div className={`mt-2 sm:mt-3 grid ${detailColsClass} gap-2 sm:gap-3 text-[10px] sm:text-[11px] md:text-xs text-white/90`}>
								{modalDetails.map(d => (
									<div key={d.label} className="flex flex-col min-w-0">
										<span className="font-semibold tracking-wide uppercase">{d.label}:</span>
										<span className="mt-0.5 leading-snug break-words whitespace-pre-wrap">{d.value}</span>
									</div>
								))}
							</div>
							{/* Action buttons */}
							<div className="mt-3 sm:mt-5 flex flex-row gap-2 flex-wrap">
								<button
									onClick={() => {
										onClose();
										const footer = document.getElementById('footer');
										if (footer) {
											footer.scrollIntoView({ behavior: 'smooth' });
										} else {
											window.location.hash = '#footer';
										}
									}}
									className="bg-orange-accent hover:bg-orange-600 text-white font-semibold py-1.5 px-3 sm:px-4 rounded-md transition-all duration-300 flex items-center justify-center text-xs sm:text-sm"
								>
									<Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
									Contact Us
								</button>
								<button
									onClick={handleDownload}
									disabled={downloading || downloaded}
									className={`bg-white/10 hover:bg-white/20 text-white font-semibold py-1.5 px-3 sm:px-4 rounded-md transition-all duration-300 backdrop-blur-sm flex items-center justify-center text-xs sm:text-sm relative ${
										downloading || downloaded ? 'cursor-not-allowed opacity-50' : ''
									}`}
								>
									<Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
									{downloading ? (
										<span className="flex items-center">
											<span className="mr-2">Loading...</span>
											<span className="inline-block w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
										</span>
									) : downloaded ? (
										<span className="flex items-center">
											<span className="mr-2">✓</span>
											<span>Downloaded</span>
										</span>
									) : (
										'Download Gallery'
									)}
								</button>
							</div>
						</div>
						{/* Close button - repositioned for desktop to avoid thumbnail overlap */}
						<button
							onClick={onClose}
							className="absolute top-2 sm:top-4 right-2 sm:right-4 md:right-[120px] text-white bg-white/20 hover:bg-white/40 p-1.5 sm:p-2 rounded-full transition z-20"
							aria-label="Close"
						>
							<X className="w-4 h-4 sm:w-5 sm:h-5" />
						</button>
					</div>
					{/* Image area */}
					<div className="relative flex items-center justify-center flex-1 px-2 sm:px-4 py-3 sm:py-6 overflow-hidden min-h-0">
						{/* Service category badge - repositioned top-left with horizontal orange gradient */}
						{service.title && (
							<div className="absolute top-0 left-0 z-10">
								<div
									className="px-2 sm:px-4 py-1 sm:py-2 rounded-br-lg sm:rounded-br-xl text-xs sm:text-sm md:text-base font-bold shadow-xl text-white backdrop-blur-md transform transition-all duration-300 hover:scale-105"
									style={{
										background: 'linear-gradient(90deg, #ea580c 0%, #fb923c 50%, #ea580c 100%)',
										boxShadow: '0 4px 20px rgba(234, 88, 12, 0.5)',
									}}
								>
									<div className="flex items-center gap-1 sm:gap-2">
										<span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></span>
										<span className="tracking-wide">{service.title}</span>
									</div>
								</div>
							</div>
						)}
						{/* Image count - repositioned to avoid badge overlap */}
						<div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/70 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold shadow-lg z-10 backdrop-blur-sm">
							{currentImage + 1} / {gallery.length}
						</div>
						{/* Navigation arrows */}
						{gallery.length > 1 && (
							<button
								onClick={prevImage}
								disabled={currentImage === 0}
								className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary-dark p-1.5 sm:p-2 md:p-3 rounded-full hover:scale-110 transition-all duration-300 disabled:opacity-30 disabled:hover:scale-100 z-10 shadow-lg"
								aria-label="Previous"
							>
								<ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
							</button>
						)}
						{/* Image container - full screen responsive */}
						<div className="flex items-center justify-center w-full h-full">
							{!imgLoaded && (
								<ImageSkeleton className="w-full h-full rounded-md max-h-[calc(100vh-280px)] sm:max-h-[calc(95vh-280px)]" />
							)}
							<img
								src={gallery[currentImage]?.url}
								alt={gallery[currentImage]?.caption || service.title}
								onLoad={() => setImgLoaded(true)}
								onError={(e) => { e.currentTarget.onerror = null; setImgLoaded(true); }}
								className={`object-contain rounded-md shadow-lg border border-gray-200 bg-white ${imgLoaded ? '' : 'invisible'}`}
								style={{
									maxHeight: 'calc(100vh - 280px)',
									maxWidth: '100%',
									width: 'auto',
									height: 'auto',
									display: 'block',
								}}
							/>
						</div>
						{gallery.length > 1 && (
							<button
								onClick={nextImage}
								disabled={currentImage === gallery.length - 1}
								className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary-dark p-1.5 sm:p-2 md:p-3 rounded-full hover:scale-110 transition-all duration-300 disabled:opacity-30 disabled:hover:scale-100 z-10 shadow-lg"
								aria-label="Next"
							>
								<ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
							</button>
						)}
					</div>
					{/* Thumbnails for mobile (below image) */}
					<div ref={mobileThumbContainerRef} className="flex md:hidden gap-2 px-3 sm:px-6 pb-3 sm:pb-4 overflow-x-auto flex-shrink-0">
						{gallery.map((img, idx) => (
							<button
								key={img.url}
								ref={el => thumbnailRefs.current[idx] = el}
								onClick={() => setCurrentImage(idx)}
								className={`border-2 rounded-lg overflow-hidden w-12 h-12 sm:w-14 sm:h-14 focus:outline-none transition flex-shrink-0 ${
									currentImage === idx
										? 'border-accent-green shadow-lg'
										: 'border-transparent opacity-70 hover:opacity-100'
								}`}
								style={{ background: '#fff' }}
							>
								{!thumbLoadStates[idx] && (
									<ImageSkeleton className="w-full h-full" />
								)}
								<img
									src={img.url}
									alt={img.caption || service.title}
									className={`object-cover w-full h-full ${thumbLoadStates[idx] ? '' : 'invisible'}`}
									onLoad={() => handleThumbLoad(idx)}
									onError={(e) => { e.currentTarget.onerror = null; handleThumbLoad(idx); }}
								/>
							</button>
						))}
					</div>
				</div>
				{/* Thumbnails grid on right side (desktop) */}
				<div ref={desktopThumbContainerRef} className="hidden md:flex flex-col gap-2 p-4 bg-white/80 rounded-r-2xl border-l border-gray-100 overflow-y-auto flex-shrink-0" style={{ maxHeight: '95vh', width: '100px' }}>
					{gallery.map((img, idx) => (
						<button
							key={img.url}
							ref={el => thumbnailRefs.current[idx] = el}
							onClick={() => setCurrentImage(idx)}
							className={`border-2 rounded-lg overflow-hidden w-16 h-16 mb-2 focus:outline-none transition flex-shrink-0 ${
								currentImage === idx
									? 'border-accent-green shadow-lg'
									: 'border-transparent opacity-70 hover:opacity-100'
							}`}
							style={{ background: '#fff' }}
						>
							{!thumbLoadStates[idx] && (
								<ImageSkeleton className="w-full h-full" />
							)}
							<img
								src={img.url}
								alt={img.caption || service.title}
								className={`object-cover w-full h-full ${thumbLoadStates[idx] ? '' : 'invisible'}`}
								onLoad={() => handleThumbLoad(idx)}
								onError={(e) => { e.currentTarget.onerror = null; handleThumbLoad(idx); }}
							/>
						</button>
					))}
				</div>
			</motion.div>
		</motion.div>
	);
};

export default ServiceGalleryModal;

// Add shimmer animation to index.css or component styles
