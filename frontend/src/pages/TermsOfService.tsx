import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
                <p className="text-gray-600 mb-8">Last updated: January 1, 2025</p>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-700">
                            By using eBikeRent, you agree to be bound by these Terms of Service. If you do not agree to
                            these terms, please do not use our service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                        <p className="text-gray-700 mb-4">
                            eBikeRent is a peer-to-peer platform that connects bike owners with riders who want to rent
                            electric bikes.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>We facilitate connections between hosts and renters</li>
                            <li>We process payments on behalf of hosts</li>
                            <li>We provide insurance coverage for rentals</li>
                            <li>We offer customer support services</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
                        <p className="text-gray-700 mb-4">As a user of eBikeRent, you agree to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Provide accurate and complete information</li>
                            <li>Follow all local traffic laws and regulations</li>
                            <li>Use bikes responsibly and return them in good condition</li>
                            <li>Report any accidents or damage immediately</li>
                            <li>Respect other users and maintain professional conduct</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Host Responsibilities</h2>
                        <p className="text-gray-700 mb-4">If you list a bike as a host, you agree to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Maintain your bike in safe, working condition</li>
                            <li>Provide accurate descriptions and photos</li>
                            <li>Be available for bike pickup and return</li>
                            <li>Respond to booking requests promptly</li>
                            <li>Follow our hosting standards and guidelines</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Uses</h2>
                        <p className="text-gray-700 mb-4">You may not use eBikeRent to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Violate any laws or regulations</li>
                            <li>Engage in fraudulent or deceptive practices</li>
                            <li>Harass, abuse, or harm other users</li>
                            <li>Use bikes for commercial purposes without permission</li>
                            <li>Circumvent our payment or booking systems</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment Terms</h2>
                        <p className="text-gray-700 mb-4">
                            All payments are processed through our secure payment system. By making a booking, you
                            authorize us to charge your payment method.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Rental fees are due at the time of booking</li>
                            <li>Cancellation policies vary by host</li>
                            <li>Service fees are non-refundable</li>
                            <li>Damage fees may apply for bike damage</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
                        <p className="text-gray-700">
                            eBikeRent is not liable for any indirect, incidental, special, consequential, or punitive
                            damages arising from your use of our service. Our total liability shall not exceed the
                            amount paid by you in the 12 months preceding the claim.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination</h2>
                        <p className="text-gray-700">
                            We may terminate or suspend your account at any time for violation of these terms or for any
                            other reason at our sole discretion.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
                        <p className="text-gray-700">
                            We reserve the right to modify these terms at any time. We will notify users of significant
                            changes via email or through our platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
                        <p className="text-gray-700">
                            If you have questions about these Terms of Service, contact us at:
                            <br />
                            Email: legal@ebikerent.com
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

export default TermsOfService;
