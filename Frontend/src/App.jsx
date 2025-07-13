import AOS from 'aos';
import 'aos/dist/aos.css';
import React, {useEffect} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import './App.css';
import Category from './pages/Category';
import Genre from './pages/Genre';
import Home from './pages/Home';

import {AnimatePresence} from 'framer-motion';
import {useDispatch} from 'react-redux';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import PageWrapper from './components/PageWrapper';
import Anime from './pages/Anime';
import Producer from './pages/Producer'
import {fetchAnimeData} from './redux/apifetch/GetanimeDataSlice';
import Episodes from './pages/Episodes';
import Search from './pages/Search';
import { setUser } from './redux/apifetch/AuthSlicer';

function App() {
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        AOS.init({duration: 700, once: false, easing: 'ease-in-out', mirror: true});

        const handleScroll = () => {
            AOS.refresh();
        };

        window.addEventListener('scroll', handleScroll, {passive: true});
        return() => window.removeEventListener('scroll', handleScroll);
     },[]);

    useEffect(() => {
        dispatch(fetchAnimeData());
    }, [dispatch]);

    // Check localStorage for user data on app initialization
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                dispatch(setUser(parsedUser));
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                localStorage.removeItem('user'); // Remove invalid data
            }
        }
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
                    <Route path="/anime/:id"
                        element={
                            <PageWrapper><Anime/></PageWrapper>
                        }/>
                    <Route path="/producer/:name"
                        element={
                            <PageWrapper><Producer/></PageWrapper>
                        }/>
                    <Route path="/episodes/:id"
                        element={
                            <PageWrapper><Episodes/></PageWrapper>
                        }/>
                        <Route path="/search"
                        element={
                            <PageWrapper><Search/></PageWrapper>
                        }/>
                          {/* <Route path="/auth"
                        element={
                            <PageWrapper><Auth/></PageWrapper>
                        }/> */}
                </Routes>
            </AnimatePresence>
            <Footer/>
        </>
    );
}

export default App;
