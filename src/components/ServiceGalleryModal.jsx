import { useState, useEffect } from 'react';
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
	const [modalReady, setModalReady] = useState(false);
	const [thumbLoadStates, setThumbLoadStates] = useState({});
	const gallery = buildGallery(service);

	// Preload main image before showing modal
	useEffect(() => {
		if (isOpen && service) {
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
			const link = document.createElement('a');
			link.href = '/company-profile.pdf';
			link.download = 'company-profile.pdf';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}, 1200);
	};

	const handleThumbLoad = (idx) => {
		setThumbLoadStates(prev => ({ ...prev, [idx]: true }));
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
			<motion.div
				initial={{ scale: 0.98, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.98, opacity: 0 }}
				className="relative w-full max-w-6xl mx-auto bg-white/90 rounded-2xl shadow-2xl border border-gray-200 flex flex-col md:flex-row"
				onClick={(e) => e.stopPropagation()}
				style={{ maxHeight: '90vh', overflow: 'hidden' }}
			>
				{/* Main content */}
				<div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
					{/* Gradient header: title + description + details */}
					<div className="flex items-start justify-between mb-2 px-0 pt-0 flex-shrink-0">
						<div className="w-full bg-gradient-to-r from-primary-dark via-accent-green to-primary-dark p-4 rounded-t-2xl">
							<h3 className="text-base md:text-lg font-bold text-white mb-1 drop-shadow-sm">{service.title}</h3>
							<p className="text-xs md:text-sm text-white/90 drop-shadow-sm">{service.description}</p>
							{/* Details block - one line, three columns */}
							<div className="mt-3 flex flex-row gap-4 text-xs md:text-sm text-white/90 justify-between items-center">
								<div className="flex-1 text-left truncate">
									<span className="font-semibold">Ad Size:</span> {service.adSize}
								</div>
								<div className="flex-1 text-center truncate">
									<span className="font-semibold">Material:</span> {service.material}
								</div>
								<div className="flex-1 text-center truncate">
									<span className="font-semibold">Location:</span> {service.location}
								</div>
							</div>
							{/* Action buttons */}
							<div className="mt-5 flex flex-row gap-2 flex-wrap">
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
									className="bg-orange-accent hover:bg-orange-600 text-white font-semibold py-1.5 px-4 rounded-md transition-all duration-300 flex items-center justify-center text-sm"
								>
									<Mail className="w-4 h-4 mr-2" />
									Contact Us
								</button>
								<button
									onClick={handleDownload}
									disabled={downloading}
									className={`bg-white/10 hover:bg-white/20 text-white font-semibold py-1.5 px-4 rounded-md transition-all duration-300 backdrop-blur-sm flex items-center justify-center text-sm relative ${
										downloading ? 'cursor-wait opacity-70' : ''
									}`}
								>
									<Download className="w-4 h-4 mr-2" />
									{downloading ? (
										<span className="flex items-center">
											<span className="mr-2">Loading...</span>
											<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
										</span>
									) : (
										'Corporate Profile'
									)}
								</button>
							</div>
						</div>
						{/* Close button - repositioned for desktop to avoid thumbnail overlap */}
						<button
							onClick={onClose}
							className="absolute top-4 right-4 md:right-[120px] text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition z-20"
							aria-label="Close"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
					{/* Image area */}
					<div className="relative flex items-center justify-center flex-1 px-4 py-6 overflow-hidden" style={{ minHeight: 0 }}>
						{/* Image count - top center, overlapping image */}
						<div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-1 rounded-full text-sm shadow-lg z-10">
							{currentImage + 1} / {gallery.length}
						</div>
						{gallery.length > 1 && (
							<button
								onClick={prevImage}
								disabled={currentImage === 0}
								className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 text-primary-dark p-2 rounded-full hover:bg-accent-green/80 transition disabled:opacity-30 z-10"
								aria-label="Previous"
							>
								<ChevronLeft className="w-6 h-6" />
							</button>
						)}
						<div className="flex items-center justify-center w-full h-full">
							{!imgLoaded && (
								<ImageSkeleton className="w-full h-full rounded-md" style={{ maxHeight: '60vh' }} />
							)}
							<img
								src={gallery[currentImage].url}
								alt={gallery[currentImage].caption || service.title}
								onLoad={() => setImgLoaded(true)}
								onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = service.mainImage; setImgLoaded(true); }}
								className={`object-contain rounded-md shadow-lg border border-gray-200 bg-white ${imgLoaded ? '' : 'invisible'}`}
								style={{
									maxHeight: '60vh',
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
								className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 text-primary-dark p-2 rounded-full hover:bg-accent-green/80 transition disabled:opacity-30 z-10"
								aria-label="Next"
							>
								<ChevronRight className="w-6 h-6" />
							</button>
						)}
					</div>
					{/* Thumbnails for mobile (below image) */}
					<div className="flex md:hidden gap-2 px-6 pb-4 overflow-x-auto flex-shrink-0">
						{gallery.map((img, idx) => (
							<button
								key={img.url}
								onClick={() => setCurrentImage(idx)}
								className={`border-2 rounded-lg overflow-hidden w-14 h-14 focus:outline-none transition flex-shrink-0 ${
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
									onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = service.mainImage; handleThumbLoad(idx); }}
								/>
							</button>
						))}
					</div>
				</div>
				{/* Thumbnails grid on right side (desktop) */}
				<div className="hidden md:flex flex-col gap-2 p-4 bg-white/80 rounded-r-2xl border-l border-gray-100 overflow-y-auto flex-shrink-0" style={{ maxHeight: '90vh', width: '100px' }}>
					{gallery.map((img, idx) => (
						<button
							key={img.url}
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
								onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = service.mainImage; handleThumbLoad(idx); }}
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
