import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FilterBar from '@/components/FilterBar';
import BikeGrid from '@/components/BikeGrid';
import Footer from '@/components/Footer';
import { FilterProvider } from '@/contexts/FilterContext';

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Hero />
            <FilterProvider>
                <FilterBar />
                <BikeGrid />
            </FilterProvider>
            <Footer />
        </div>
    );
};

export default Home;
