import React from "react";
import {
  Rocket,
  Sparkles,
  CreditCard,
  Database,
  ShoppingCart,
  Users,
  Webhook,
  Lock,
  CheckCircle,
} from "lucide-react";

// Define color variants type
type ColorVariant = "blue" | "purple" | "emerald" | "pink" | "amber" | "indigo";

// Define service interface
interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  color: ColorVariant;
}
const services: Service[] = [
  {
    icon: CreditCard,
    title: "Stripe Subscriptions",
    description:
      "Complete subscription management system with recurring billing, plan changes, and customer portal integration.",
    features: [
      "Multiple Pricing Plans",
      "Subscription Lifecycle",
      "Customer Portal",
      "Usage-Based Billing",
    ],
    color: "blue",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Integration",
    description:
      "Stripe Embedded Checkout with automatic product creation and seamless payment processing.",
    features: [
      "Embedded Checkout",
      "Auto Product Sync",
      "Inventory Management",
      "Order Tracking",
    ],
    color: "emerald",
  },
  {
    icon: Webhook,
    title: "Webhook Management",
    description:
      "Pre-configured webhook handlers for all Stripe events with database synchronization.",
    features: [
      "Event Processing",
      "Database Sync",
      "Error Handling",
      "Retry Logic",
    ],
    color: "purple",
  },
  {
    icon: Lock,
    title: "Authentication System",
    description:
      "Secure user authentication with role-based access control and session management.",
    features: [
      "User Registration",
      "Role Management",
      "Session Handling",
      "Password Security",
    ],
    color: "amber",
  },
  {
    icon: Users,
    title: "User Management",
    description:
      "Complete user administration with subscription status tracking and customer insights.",
    features: [
      "User Profiles",
      "Subscription Status",
      "Customer Analytics",
      "Admin Dashboard",
    ],
    color: "pink",
  },
  {
    icon: Database,
    title: "Database Integration",
    description:
      "Optimized database schema with Stripe data synchronization and real-time updates.",
    features: [
      "Schema Design",
      "Data Sync",
      "Real-time Updates",
      "Query Optimization",
    ],
    color: "indigo",
  },
];

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const colorVariants = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600",
    pink: "bg-pink-50 text-pink-600 group-hover:bg-pink-600",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-600",
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600",
  };

  return (
    <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-xl ${colorVariants[service.color]} flex items-center justify-center transition-all duration-300 mb-6 shadow-sm`}
      >
        <service.icon className="w-7 h-7 group-hover:text-white transition-colors duration-300" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">
        {service.description}
      </p>

      {/* Features */}
      <ul className="space-y-3">
        {service.features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Hover Border */}
      <div className="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-blue-200 transition-colors duration-300"></div>
    </div>
  );
};

const ServicesSection = () => {
  return (
    <section
      id="services"
      className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6 border border-blue-100">
            <Sparkles className="w-4 h-4 mr-2" />
            What's Included
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Launch
          </h2>
          <p className="text-xl text-gray-600">
            Our Stripe SaaS starter kit includes all the essential features and
            integrations to get your subscription business up and running
            quickly.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Build Your SaaS?
            </h3>
            <p className="text-blue-100 mb-8 text-lg">
              Get instant access to our complete starter kit and launch your
              subscription business today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-blue-600 font-medium hover:bg-gray-50 transition-colors shadow-lg">
                <Rocket className="mr-2 w-5 h-5" />
                Get Started Now
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white/30 text-white font-medium hover:border-white/50 hover:bg-white/10 transition-colors">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
