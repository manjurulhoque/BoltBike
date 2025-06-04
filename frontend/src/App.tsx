import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Bikes from './pages/Bikes';
import BikeDetails from './pages/BikeDetails';
import ListBike from './pages/ListBike';
import MyBikes from './pages/MyBikes';
import Map from './pages/Map';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

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
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/bikes" element={<Bikes />} />
                    <Route path="/bikes/:id" element={<BikeDetails />} />
                    <Route path="/list-bike" element={<ListBike />} />
                    <Route path="/my-bikes" element={<MyBikes />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
            <Toaster position="top-right" />
        </QueryClientProvider>
    );
}

export default App;
