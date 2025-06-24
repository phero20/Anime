import React, {useEffect} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import {Route, Routes, useLocation} from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import Genre from './pages/Genre';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {fetchAnimeData} from './redux/apifetch/GetanimeDataSlice';
import {useDispatch} from 'react-redux';
import {AnimatePresence} from 'framer-motion';
import PageWrapper from './components/PageWrapper';

function App() {
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        AOS.init({duration: 600, once: false, easing: 'ease-in-out', mirror: true});

        const handleScroll = () => {
            AOS.refresh();
        };

        window.addEventListener('scroll', handleScroll, {passive: true});
        return() => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        dispatch(fetchAnimeData());
    }, [dispatch]);

    return (
        <>
            <Navbar/>
            <AnimatePresence mode="wait">
                <Routes location={location}
                    key={
                        location.pathname
                }>
                    <Route path="/"
                        element={
                            <PageWrapper><Home/></PageWrapper>
                        }/>
                    <Route path="/category/:name"
                        element={
                            <PageWrapper><Category/></PageWrapper>
                        }/>
                    <Route path="/genre/:name"
                        element={
                            <PageWrapper><Genre/></PageWrapper>
                        }/>

                </Routes>
            </AnimatePresence>
            <Footer/>
        </>
    );
}

export default App;
