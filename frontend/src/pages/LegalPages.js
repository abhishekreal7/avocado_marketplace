import React from 'react';
import { Shield, FileText, AlertTriangle, Lock } from 'lucide-react';

const LegalLayout = ({ title, icon: Icon, children, date }) => (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
                    <div className="w-12 h-12 bg-avocado-green/10 rounded-xl flex items-center justify-center text-avocado-dark">
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                        <p className="text-gray-500 mt-1">Last updated: {date}</p>
                    </div>
                </div>
                <div className="prose prose-gray max-w-none">
                    {children}
                </div>
            </div>
        </div>
    </div>
);

export const Section = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="text-gray-600 leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

export const Disclaimer = () => (
    <LegalLayout title="Disclaimer" icon={AlertTriangle} date="February 9, 2026">
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-8 text-yellow-800 text-sm">
            <strong>Important Notice:</strong> Avocado Marketplace provides source code and digital assets "as is". We do not guarantee business success or third-party platform approvals.
        </div>

        <Section title="Nature of Digital Products">
            <p>
                Products sold on Avocado Marketplace are digital assets, including source code, templates, and design files.
                <strong>Purchase includes the source code only.</strong> It does not include hosting, domain names, third-party API keys, or ongoing maintenance unless explicitly stated by the seller.
            </p>
        </Section>

        <Section title="No Guarantees of Success">
            <p>
                We do not guarantee that any product purchased from our marketplace will generate revenue, traffic, or business success.
                Your results depend on your execution, marketing efforts, and market conditions.
            </p>
        </Section>

        <Section title="Fee Waiver Promotion">
            <div className="bg-avocado-light/20 border border-avocado-green/20 rounded-lg p-4 text-avocado-dark text-sm">
                <strong>Launch Special:</strong> For a limited time, Avocado Marketplace is waiving the 15% platform commission for sellers and all payment processing fees. Sellers receive 100% of their sale price, and buyers pay exactly the price listed with zero hidden fees.
            </div>
        </Section>
    </LegalLayout>
);

export const RefundPolicy = () => (
    <LegalLayout title="Refund Policy" icon={Shield} date="February 9, 2026">
        <Section title="All Sales Are Final">
            <p>
                Due to the nature of digital products (source code, templates), which cannot be "returned" once downloaded, <strong>all sales are final.</strong>
                We do not offer refunds once the files have been accessed or downloaded.
            </p>
        </Section>

        <Section title="No Exceptions">
            <p>
                We do not provide refunds for:
            </p>
            <ul className="list-disc pl-5 space-y-2">
                <li>Change of mind or finding a "better" product.</li>
                <li>Inability to install or configure the product due to lack of technical skills.</li>
                <li>Third-party platform rejections (Apple, Google, hosting).</li>
                <li>Violations of Fair Use policies.</li>
            </ul>
        </Section>

        <Section title="Defective Products">
            <p>
                If a product is technically defective and the seller cannot provide a fix within 7 days, we may issue store credit at our sole discretion. You must report issues within 48 hours of purchase to support@avocadomarketplace.com.
            </p>
        </Section>
    </LegalLayout>
);

export const TermsOfService = () => (
    <LegalLayout title="Terms of Service" icon={FileText} date="February 8, 2026">
        <Section title="License & Usage">
            <p>
                When you purchase a product on Avocado Marketplace, you are granted a non-exclusive, non-transferable license to use the source code for personal or commercial projects.
            </p>
            <p>
                <strong>You MAY:</strong>
                <ul className="list-disc pl-5 mt-2">
                    <li>Use the code to build a website/app for yourself or a client.</li>
                    <li>Modify the code to fit your needs.</li>
                </ul>
            </p>
            <p className="mt-4">
                <strong>You MAY NOT:</strong>
                <ul className="list-disc pl-5 mt-2">
                    <li>Resell, redistribute, or sub-license the source code "as is".</li>
                    <li>Claim exclusive ownership of the original code base.</li>
                </ul>
            </p>
        </Section>

        <Section title="Buyer Responsibilities">
            <p>
                As a buyer, you acknowledge that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
                <li>You possess the technical skills required to deploy and configure the product.</li>
                <li>You are responsible for legal compliance (GDPR, CCPA, etc.) of your final application.</li>
                <li>You are responsible for securing your own third-party accounts (Stripe, OpenAI, Firebase, etc.).</li>
            </ul>
        </Section>

        <Section title="Payments & Fees">
            <p>
                Avocado Marketplace uses Dodo Payments for secure transaction processing.
                <strong>Buyers pay exactly the price listed on the platform with zero additional transaction fees.</strong>
            </p>
            <p className="mt-2">
                Sellers are subject to a 15% platform commission and standard payment processing fees, which are deducted from the sale price.
            </p>
            <p className="mt-2 text-sm italic font-medium text-avocado-dark">
                Note: Avocado Marketplace is currently waiving all seller commissions and processing fees as part of our launch promotion. Sellers receive 100% of their listed price.
            </p>
        </Section>

        <Section title="Liability Limitation">
            <p>
                Avocado Marketplace and its sellers shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the purchased products.
            </p>
        </Section>
    </LegalLayout>
);

export const PrivacyPolicy = () => (
    <LegalLayout title="Privacy Policy" icon={Lock} date="February 9, 2026">
        <Section title="Information We Collect">
            <p>
                We collect information you provide directly to us, such as when you create an account, update your profile, make a purchase, or communicate with us. This may include:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Name, email address, and contact information.</li>
                <li>Payment information (processed securely by our payment processors).</li>
                <li>Profile information (bio, skills, links).</li>
            </ul>
        </Section>

        <Section title="How We Use Your Information">
            <p>
                We use the information we collect to:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Provide, maintain, and improve our services.</li>
                <li>Process transactions and send related information.</li>
                <li>Send you technical notices, updates, security alerts, and support messages.</li>
                <li>Respond to your comments, questions, and requests.</li>
            </ul>
        </Section>

        <Section title="Data Security">
            <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
        </Section>

        <Section title="Cookies">
            <p>
                We use cookies and similar technologies to help us understand user behavior, personalize your experience, and analyze our traffic. You can control cookies through your browser settings.
            </p>
        </Section>

        <Section title="Third-Party Services">
            <p>
                We may share information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf, such as payment processing (Stripe) and hosting services.
            </p>
        </Section>
    </LegalLayout>
);
