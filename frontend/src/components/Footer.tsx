import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-lg font-bold text-rose-500 mb-4">eBikeRent</h3>
                        <p className="text-gray-600 mb-4">
                            The world's leading e-bike rental marketplace. Discover amazing electric bikes from local
                            hosts.
                        </p>
                        <div className="flex space-x-3">
                            <Button variant="outline" size="sm" className="rounded-full">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full">
                                <Instagram className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full">
                                <Youtube className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* For Riders */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">For Riders</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <Link to="/how-it-works" className="hover:text-rose-500">
                                    How it works
                                </Link>
                            </li>
                            <li>
                                <Link to="/safety" className="hover:text-rose-500">
                                    Safety
                                </Link>
                            </li>
                            <li>
                                <Link to="/safety" className="hover:text-rose-500">
                                    Insurance
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="hover:text-rose-500">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Hosts */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">For Hosts</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <Link to="/list-bike" className="hover:text-rose-500">
                                    Rent your bike
                                </Link>
                            </li>
                            <li>
                                <Link to="/safety" className="hover:text-rose-500">
                                    Host protection
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="hover:text-rose-500">
                                    Resources
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="hover:text-rose-500">
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <Link to="/about" className="hover:text-rose-500">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-rose-500">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-rose-500">
                                    Press
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-rose-500">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-600 text-sm">© 2025 eBikeRent. All rights reserved.</p>
                    <div className="flex space-x-6 text-sm text-gray-600 mt-4 md:mt-0">
                        <Link to="/privacy-policy" className="hover:text-rose-500">
                            Privacy Policy
                        </Link>
                        <Link to="/terms-of-service" className="hover:text-rose-500">
                            Terms of Service
                        </Link>
                        <Link to="/privacy-policy" className="hover:text-rose-500">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
