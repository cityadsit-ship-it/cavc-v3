Title:
Design and Build a Responsive Landing Page for City Advertising Ventures Corporation

Stack:
React + Vite + Tailwind CSS

Design Role:
Act as a Senior UI/UX Designer and Full-Stack Web Developer

🎯 Objective:
Create a responsive, visually compelling landing page for City Advertising Ventures Corporation, showcasing their out-of-home (OOH) advertising services. The page should load fast, scale beautifully across all devices, and reflect their brand’s professional and innovative image.

🏢 Company Info:
Name: City Advertising Ventures Corporation
Logo: (use uploaded PNG)
Brand Colors / Palette:

Primary Dark Green: #2F5249

Accent Green: #437057

Lime Green: #97B067

Yellow Highlight: #E3DE61

(Optional) Orange Accent: from logo (for CTA or highlight areas)

📱 Mobile-First Requirements:
Start with mobile layout → scale to tablet → scale to laptop → then large desktops.

Use flex, grid, container, max-w-screen-xl, and media queries (sm:, md:, lg:, xl:) wisely.

Typography should adjust comfortably (e.g., text-base sm:text-lg lg:text-xl).

📦 Sections to Include:
1. Hero Section
Fullscreen or 90vh height

Logo (top left), Navigation (hamburger for mobile)

Catchy tagline: “Shaping Cities with Visionary Outdoor Advertising”

Background image or gradient using palette (optional image with transparency overlay)

CTA: "View Services" (scrolls to services) / "Contact Us"

2. About Us / Mission
Short paragraph about the company

Emphasize credibility, innovation, nationwide presence

3. Services Grid
Display all 11 services as cards or collapsible accordions (mobile), with the following info template:

Example Card Layout:

pgsql
Copy
Edit
Service Name: Lighted Banner
- AD Size: 2ft x 6ft
- Material: Tarpaulin with backlight film
- Finishing: Welded with eyelets
- Location: Metro Manila (Key Roads)
- Info: Lighted from 06:00 PM to 10:00 PM
Use icons or vector illustrations to add visual cues per service.

4. Interactive Map Section
Option A: Use an interactive Map API like Leaflet or Google Maps to show pinned ad locations across the Philippines.

Option B (fallback): Use a custom image with vector-style pins labeled with major ad locations.

5. Why Choose Us / Differentiators
Grid or Icon List of value props:

20+ Years of Expertise

Strategic Metro Locations

High-Impact Visibility

Environmental Compliance

Creative Installations

6. Call to Action
Strong color from the orange in the logo

“Get a Free Quote” or “Book a Consultation”

Form with Name, Email, Company, Message

7. Footer
Company Address

Contact Email & Phone

Social Media Icons

Legal Notice

🎨 UI/UX Design Considerations
Use #437057 as the main background sections (e.g., About, CTA)

Use #E3DE61 sparingly for highlights, icons, or small section titles

Use orange from logo for CTA buttons and hovers

Text color: off-white or dark slate, ensure contrast

Fonts: Preferably clean sans-serif like Inter, Poppins, or Nunito

Animations: Subtle transitions for cards and scroll effects using Framer Motion or Tailwind transitions

⚙️ Technical Structure
bash
Copy
Edit
Project Structure (Vite + React)
.
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Services.jsx
│   │   ├── Map.jsx
│   │   ├── ContactForm.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css