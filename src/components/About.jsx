import { motion } from 'framer-motion';
import {
  Award, Users, MapPin, Headphones, Lightbulb, Heart
} from 'lucide-react';

const whyChooseUsData = [
  {
    icon: Award,
    title: '20+ Years of Expertise',
    description: 'Delivering reliable solutions built on decades of knowledge, experience, and proven results.'
  },
  {
    icon: Users,
    title: 'Experienced Team',
    description: 'We do things faster, more accurate and cost-effective.'
  },
  {
    icon: MapPin,
    title: 'Strategic Sites',
    description: 'We offer a multitude of sites strategically located nationwide to provide maximum exposure for your brands.'
  },
  {
    icon: Headphones,
    title: '24/7 Client Service',
    description: 'Our customer front-liners are always ready to assist you around the clock to promote seamless executions of your campaigns.'
  },
  {
    icon: Lightbulb,
    title: 'Innovative Solutions',
    description: 'Our management team is always on the look for ways to innovate our products and services to serve you better.'
  },
  {
    icon: Heart,
    title: 'Passionate Approach',
    description: 'We do things with passion and always do our best to delight our customers.'
  }
];

const iconBgColors = [
  'bg-yellow-highlight',
  'bg-accent-green',
  'bg-primary-dark',
  'bg-orange-accent',
  'bg-lime-green',
  'bg-pink-500'
];

const About = () => {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Main About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-dark mb-4 sm:mb-6">
            Leading the Future of{' '}
            <span className="text-accent-green">Outdoor Advertising</span>
          </h2>
          <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
            City Advertising Venture Corporation started its journey on June 1, 2003, 
            at a time when advertisers were searching for cost effective alternatives 
            to traditional advertising. They discovered these solutions in City Ads. 
            Overcoming numerous challenges, the company rose to become a leader in 
            out-of-home media industry, proudly serving thousands of customers 
            nationwide through the years. This is a remarkable story of grit, 
            innovation, and unwavering perseverance.
          </p>
          {/* Company Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="relative inline-flex items-center gap-4 px-8 py-5 rounded-2xl shadow-xl border-4 border-accent-green bg-gradient-to-r from-accent-green/20 via-white to-lime-green/20"
            style={{ boxShadow: '0 4px 24px 0 rgba(16, 185, 129, 0.15)' }}
          >
            {/* Animated shimmer overlay */}
            <span className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
              <span className="absolute top-0 left-0 w-full h-full shimmer"></span>
            </span>
            <img
              src="/images/cavclogo.png"
              alt="CAVC Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain rounded-full shadow-md"
            />
            <div className="text-left z-10">
              <h3 className="font-bold text-primary-dark text-sm sm:text-base lg:text-xl tracking-wide">
                City Advertising Ventures Corporation
              </h3>
              <p className="text-xs sm:text-sm text-accent-green font-semibold">
                Trusted by leading brands since 2003
              </p>
            </div>
          </motion.div>
        {/* Add shimmer effect CSS */
        }
        <style>
          {`
            .shimmer {
              background: linear-gradient(120deg, transparent 40%, rgba(16,185,129,0.18) 50%, transparent 60%);
              animation: shimmerMove 2.5s infinite linear;
            }
            @keyframes shimmerMove {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}
        </style>
        </motion.div>

        {/* Why Choose Us Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-3 sm:mb-4">
              Why Choose Us
            </h3>
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg">
              We are a full service out-of-home advertising company<br />
              offering a wide range of products and services.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-20 max-w-5xl mx-auto">
            {whyChooseUsData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full shadow-lg mb-3 sm:mb-4 border-2 sm:border-4 border-white ${iconBgColors[index % iconBgColors.length]} transition-transform duration-300 hover:scale-110`}>
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h4 className="text-xs sm:text-sm lg:text-lg font-bold text-primary-dark mb-1 sm:mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-[10px] sm:text-xs lg:text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
