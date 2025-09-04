// AOS removed
import React, {useEffect, useState} from 'react';
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
import Profile from './pages/Profile';
import ToastContainer from './components/Toast';
import AiChat from './components/AiChat';
import { FaRobot } from 'react-icons/fa';


function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchAnimeData());
    }, [dispatch]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                dispatch(setUser(parsedUser));
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                localStorage.removeItem('user'); 
            }
        }
    }, [dispatch]);

    return (
        <>
            <ToastContainer />
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
                          <Route path="/profile"
                        element={
                            <PageWrapper><Profile/></PageWrapper>
                        }/>
                </Routes>
            </AnimatePresence>
            <Footer/>
            
            {/* Floating AI Chat Button */}
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#f47521] hover:bg-[#ff6600] text-black rounded-full shadow-2xl hover:shadow-[#f47521]/25 transition-all duration-300 flex items-center justify-center group hover:scale-110"
                title="AI Chat Assistent"
            >
                <FaRobot size={24} className="group-hover:scale-110 transition-transform duration-500" />
            </button>

            {/* AI Chat Component */}
            <AiChat 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
            />
            
        </>
    );
}

export default App;