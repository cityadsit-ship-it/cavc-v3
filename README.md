# City Advertising Ventures Corporation - Landing Page

A modern, responsive landing page for City Advertising Ventures Corporation (CAVC), showcasing their outdoor advertising services across Metro Manila. Built with React + Vite + Tailwind CSS with a focus on professional branding, mobile-first design, and user experience.

## 🚀 PRODUCTION READY

This project is fully configured and ready for production deployment. See [PRODUCTION_TRANSITION_GUIDE.md](./PRODUCTION_TRANSITION_GUIDE.md) for complete deployment instructions.

**Quick Start for Deployment:** See [QUICK_DEPLOYMENT_REFERENCE.md](./QUICK_DEPLOYMENT_REFERENCE.md)

## ✨ Key Features

- **Image-Centric Services Gallery** - Interactive cards with hover effects and detailed gallery modals
- **Professional Branding** - Real CAVC logo integration throughout the site
- **Responsive Design** - Mobile-first approach with smooth animations
- **Modern UI/UX** - Clean section layouts, professional button hover effects
- **Interactive Modals** - Service gallery viewer and custom quote forms
- **Performance Optimized** - Fast loading with Vite and optimized assets

## 🎯 Project Overview

This landing page showcases CAVC's out-of-home advertising services with:
- Hero section with brand background and gradient overlay
- About section with company showcase
- Interactive Services Gallery with image-centric design
- Integrated map showing coverage areas
- Professional contact form with "Why Choose CAVC" section
- Complete footer with company information

## 🏢 Company Information

**City Advertising Ventures Corporation**
- Specializes in out-of-home (OOH) advertising
- 20+ years of expertise
- Strategic locations across Metro Manila
- Environmental compliance certified

## 🎨 Brand Colors

- **Primary Dark Green**: `#2F5249`
- **Accent Green**: `#437057`
- **Lime Green**: `#97B067`
- **Yellow Highlight**: `#E3DE61`
- **Orange Accent**: `#E67E22` (CTA buttons)

## 📦 Project Structure

```
src/
├── components/
│   ├── Hero.jsx           # Header, navigation, hero section
│   ├── About.jsx          # Company information and showcase
│   ├── ServicesGallery.jsx # Image-centric services with gallery modal
│   ├── Map.jsx            # Coverage areas map
│   ├── ContactForm.jsx    # Contact form and "Why Choose CAVC"
│   └── Footer.jsx         # Footer with company details
├── App.jsx               # Main app component
├── main.jsx             # React app entry point
└── index.css            # Tailwind CSS and custom styles

public/
├── images/
│   └── cavclogo.png     # Official CAVC logo
└── index.html           # HTML template
```

## 🎨 Design System

### Brand Colors
- **Primary Dark Green**: `#2F5249`
- **Accent Green**: `#437057`  
- **Lime Green**: `#97B067`
- **Yellow Highlight**: `#E3DE61`
- **Orange Accent**: `#E67E22` (CTA buttons)

### Typography & Styling
- Clean section titles without decorative logos
- Circular logo containers for branding consistency
- Professional button hover effects with smooth transitions
- Image-first approach in service cards
- Consistent spacing and modern layout principles

## 🛠️ Tech Stack

- **React 18** - Component-based UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Modern icon library

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/cavc-landing-page.git
cd cavc-landing-page
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Recommended Hosting
- **Vercel** - Automatic deployments from Git
- **Netlify** - Easy drag-and-drop deployment
- **GitHub Pages** - Free hosting for public repositories

## 📱 Responsive Design

The landing page is optimized for all devices:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Screens**: 1440px+

## 🎨 Key Features

### Services Gallery
- **Image-Centric Design** - Service cards focused on visual presentation
- **Interactive Gallery Modal** - View all service images with navigation
- **Custom Quote System** - Service-specific quote request modals
- **Hover Effects** - "Click to view gallery" hints appear on card hover
- **Professional CTAs** - Prominent "Get Custom Quote" buttons

### Modern UX/UI
- **Clean Layout** - Section titles without decorative elements
- **Circular Branding** - Logo containers consistently circular throughout
- **Smooth Animations** - Professional button hover and focus effects
- **Mobile-First** - Responsive design optimized for all devices
- **Brand Integration** - Real CAVC logo used throughout the site

### Technical Features
- **Vite Build System** - Fast development and optimized production builds
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first styling with custom components
- **Modular Architecture** - Clean component structure for maintainability

## 🎯 Business Impact

This landing page is designed to:
- Generate qualified leads
- Showcase CAVC's expertise and capabilities
- Provide easy contact methods
- Build trust through professional presentation
- Drive conversions with strategic CTAs

## 📊 Services Showcased

1. **Lighted Banner** - 2ft x 6ft illuminated displays
2. **Digital Billboard** - 10ft x 20ft LED screens
3. **Building Wrap** - Large-scale building advertisements
4. **Transit Advertising** - Mobile ads on public transport
5. **Traditional Billboard** - Classic highway billboards
6. **Mobile LED Display** - Truck-mounted dynamic displays
7. **Street Furniture** - Bus stop and waiting area ads
8. **Rooftop Billboard** - High-visibility rooftop installations
9. **Wall Painting** - Artistic brand representations
10. **Digital Kiosk** - Interactive touchscreen displays
11. **Airport Advertising** - Premium airport terminal spaces

## 🗺️ Coverage Areas

- EDSA Corridor
- C5 Highway
- Makati CBD
- BGC Taguig
- Ortigas Center
- Quezon City
- Manila Bay Area
- Airport Vicinity

## 📞 Contact Information

- **Phone**: +63 (2) 8123-4567
- **Mobile**: +63 917-123-4567
- **Email**: info@cavc.com.ph
- **Address**: 123 Advertising Avenue, Makati City

## 🔧 Customization

### Brand Customization
- **Logo**: Replace `public/images/cavclogo.png` with your logo
- **Colors**: Update brand colors in `tailwind.config.js`
- **Content**: Modify component files in `src/components/`
- **Contact Info**: Update details in `ContactForm.jsx` and `Footer.jsx`

### Service Gallery
- **Images**: Add service images to `public/images/` directory
- **Service Data**: Update service information in `ServicesGallery.jsx`
- **Gallery Modal**: Customize modal behavior and styling
- **Quote Forms**: Modify quote request functionality

### Styling
- **Button Effects**: Customize button classes in `src/index.css`
- **Animations**: Adjust Framer Motion settings in components
- **Responsive Design**: Modify breakpoints in `tailwind.config.js`

## 📄 License

This project is proprietary to City Advertising Ventures Corporation.

## 🏆 Project Achievements

- ✅ Modern, responsive design with mobile-first approach
- ✅ Professional brand integration with real logo assets
- ✅ Image-centric Services Gallery with interactive modals
- ✅ Clean, professional button hover effects throughout
- ✅ Optimized build system with Vite for fast development
- ✅ Comprehensive component architecture for maintainability
- ✅ Ready for production deployment

## 🤝 Contributing

This is a proprietary project for City Advertising Ventures Corporation. For any modifications or improvements, please contact the development team.

---

**Built with ❤️ for City Advertising Ventures Corporation** | **React + Vite + Tailwind CSS**
