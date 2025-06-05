import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Bikes from './pages/Bikes';
import BikeDetails from './pages/BikeDetails';
import ListBike from './pages/ListBike';
import EditBike from './pages/EditBike';
import MyBikes from './pages/MyBikes';
import Map from './pages/Map';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import HowItWorks from './pages/HowItWorks';
import Safety from './pages/Safety';
import Support from './pages/Support';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ProtectedRoute from './components/ProtectedRoute';

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
            <Router>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
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
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
            <Toaster position="top-right" />
        </QueryClientProvider>
    );
}

export default App;
