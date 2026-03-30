import React from "react";
import { UserPlus, Layout, FileText, ArrowRight } from "lucide-react";

const processSteps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description:
      "Create your free account in under 30 seconds. No credit card required to get started.",
    details: [
      "Quick registration",
      "Email verification",
      "Account setup",
      "Dashboard access",
    ],
    color: "blue",
  },
  {
    icon: Layout,
    title: "Choose Template",
    description:
      "Select from our collection of professional invoice templates designed for different industries.",
    details: [
      "Business templates",
      "Freelancer designs",
      "Service invoices",
      "Custom branding",
    ],
    color: "purple",
  },
  {
    icon: FileText,
    title: "Create & Send",
    description:
      "Fill in your details, customize as needed, and generate your professional PDF invoice instantly.",
    details: [
      "Auto-fill client data",
      "Add line items",
      "Preview & review",
      "Download or email",
    ],
    color: "emerald",
  },
];

const ProcessSection = () => {
  return (
    <section
      id="process"
      className="py-20 bg-slate-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-30"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600">
            Get your professional invoice ready in 3 simple steps. It's that
            easy.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {processSteps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting Arrow (Desktop) */}
              {index < processSteps.length - 1 && (
                <div className="hidden md:block absolute top-20 -right-4 z-10">
                  <ArrowRight className="w-8 h-8 text-slate-300" />
                </div>
              )}

              <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-lg font-bold text-white">
                    {index + 1}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl bg-${step.color}-50 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}
                >
                  <step.icon className={`w-8 h-8 text-${step.color}-500`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {step.description}
                </p>

                {/* Details */}
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className="flex items-center text-sm text-slate-600"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-${step.color}-400 mr-3`}
                      ></div>
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* Hover Border Effect */}
                <div
                  className={`absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-${step.color}-200 transition-colors duration-300`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Create Your First Invoice?
            </h3>
            <p className="text-slate-600 mb-6">
              Join thousands of professionals who trust Invoice Pro for their
              billing needs.
            </p>
            <button className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <p className="text-sm text-slate-500 mt-3">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
