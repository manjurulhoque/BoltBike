import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Bikes from './pages/Bikes';
import BikeDetails from './pages/BikeDetails';
import ListBike from './pages/ListBike';
import EditBike from './pages/EditBike';
import MyBikes from './pages/MyBikes';
import Bookings from './pages/Bookings';
import Reviews from './pages/Reviews';
import Favorites from './pages/Favorites';
import Map from './pages/Map';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import HowItWorks from './pages/HowItWorks';
import Safety from './pages/Safety';
import Support from './pages/Support';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ProtectedRoute from './components/ProtectedRoute';
import { SearchProvider } from './contexts/SearchContext';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SearchProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
                        <Route path="/bikes" element={<Bikes />} />
                        <Route path="/bikes/:id" element={<BikeDetails />} />
                        <Route path="/map" element={<Map />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/how-it-works" element={<HowItWorks />} />
                        <Route path="/safety" element={<Safety />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/list-bike"
                            element={
                                <ProtectedRoute>
                                    <ListBike />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/edit-bike/:id"
                            element={
                                <ProtectedRoute>
                                    <EditBike />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-bikes"
                            element={
                                <ProtectedRoute>
                                    <MyBikes />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bookings"
                            element={
                                <ProtectedRoute>
                                    <Bookings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/reviews"
                            element={
                                <ProtectedRoute>
                                    <Reviews />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/favorites"
                            element={
                                <ProtectedRoute>
                                    <Favorites />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </SearchProvider>
            <Toaster position="top-right" closeButton={true} />
        </QueryClientProvider>
    );
}

export default App;
