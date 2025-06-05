import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
                <p className="text-gray-600 mb-8">Last updated: January 1, 2025</p>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p className="text-gray-700 mb-4">
                            We collect information you provide directly to us, such as when you create an account, list
                            a bike, make a reservation, or contact us for support.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Personal information (name, email, phone number)</li>
                            <li>Profile information and photos</li>
                            <li>Payment and billing information</li>
                            <li>Communication preferences</li>
                            <li>Location data when using our services</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process transactions and send related information</li>
                            <li>Send technical notices and support messages</li>
                            <li>Communicate with you about products, services, and events</li>
                            <li>Monitor and analyze trends and usage</li>
                            <li>Detect, investigate, and prevent fraudulent activities</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                        <p className="text-gray-700 mb-4">
                            We may share your information in certain limited circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>With other users as necessary to facilitate bookings</li>
                            <li>With service providers who assist us in operating our platform</li>
                            <li>When required by law or to protect our rights</li>
                            <li>In connection with a merger, acquisition, or sale of assets</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                        <p className="text-gray-700">
                            We implement appropriate technical and organizational measures to protect your personal
                            information against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
                        <p className="text-gray-700 mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Access and update your personal information</li>
                            <li>Delete your account and personal data</li>
                            <li>Opt out of marketing communications</li>
                            <li>Request a copy of your data</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
                        <p className="text-gray-700">
                            If you have any questions about this Privacy Policy, please contact us at:
                            <br />
                            Email: privacy@ebikerent.com
                            <br />
                            Phone: 1-800-EBIKE-RENT
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
