import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Map from './components/Map'
import ContactForm from '../ContactFormBackup'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import './index.css'

function App() {
  return (
    <div className="App">
      <Hero />
      <Services />
      <About />
      <Map />
      <Footer />
      <CookieConsent />
    </div>
  )
}

export default App
