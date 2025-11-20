import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  User, 
  Mail, 
  Building, 
  MessageSquare, 
  Phone,
  MapPin,
  Clock
} from 'lucide-react';

const ContactForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  // Formspree: Replace 'your_form_id' with your actual Formspree form ID
  const formspreeAction = "https://formspree.io/f/xjkajgga";

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <section id="contactold" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-orange-accent to-orange-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Get a Free Quote</h3>
              <p className="mb-6 opacity-90">
                Ready to elevate your brand with strategic outdoor advertising? 
                Contact us today for a personalized consultation and quote.
              </p>

              <form
                action={formspreeAction}
                method="POST"
                className="space-y-4"
                onSubmit={() => setTimeout(handleSuccess, 500)} // Show modal after submit
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 resize-none"
                    placeholder="Tell us about your advertising needs..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-form-submit"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-primary-dark mb-6">
                Get in Touch
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Have questions about our services or need assistance with your 
                advertising campaign? Our team of experts is here to help you 
                create impactful outdoor advertising solutions.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-green rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-dark mb-1">Phone</h4>
                  <p className="text-gray-600">(02) 8535-5555 , 8532-5400</p>
                  <p className="text-gray-600">8531-0152 , 8532-5400 , 8532-5216</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-green rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-dark mb-1">Email</h4>
                  <p className="text-gray-600">info@cavc.com.ph</p>
                  <p className="text-gray-600">sales@cavc.com.ph</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-green rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-dark mb-1">Address</h4>
                  <p className="text-gray-600">
                      6th & 7th Floor, MG Tower,<br />
                      #75 Shaw Boulevard, Daang Bakal,<br />
                      Mandaluyong City, Philippines
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-green rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-dark mb-1">Business Hours</h4>
                  <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>

           {/* Emergency Contact 
            <div className="bg-yellow-highlight bg-opacity-20 rounded-lg p-6 border-l-4 border-yellow-highlight">
              <h4 className="font-semibold text-primary-dark mb-2">
                24/7 Emergency Support
              </h4>
              <p className="text-gray-600 text-sm mb-2">
                For urgent advertising display issues or emergencies:
              </p>
              <p className="text-primary-dark font-semibold">+63 917-EMERGENCY</p>
            </div> */}
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
            >
              <h4 className="text-2xl font-bold text-primary-dark mb-4">Email Sent!</h4>
              <p className="text-gray-700 text-lg mb-4">
                Thank you for contacting us.<br />
                Please wait for our sales team to coordinate with you soon.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="mt-4 px-6 py-2 rounded-lg bg-orange-accent text-white font-semibold hover:bg-orange-600 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactForm;
