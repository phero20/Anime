// AOS removed
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Category from './pages/Category';
import Genre from './pages/Genre';
import Home from './pages/Home';
import { AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import PageWrapper from './components/PageWrapper';
import Anime from './pages/Anime';
import Producer from './pages/Producer'
import { fetchAnimeData } from './redux/apifetch/GetanimeDataSlice';
import Episodes from './pages/Episodes';
import Search from './pages/Search';
import { setUser, selectUser } from './redux/apifetch/AuthSlicer';
import Profile from './pages/Profile';
import ToastContainer from './components/Toast';
import AiChat from './components/AiChat';
import { FaRobot } from 'react-icons/fa';
import aigirl from './assets/aigirl.png';
import { useSelector,useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { fetchChatHistory } from './redux/apifetch/aiChatSlice';
import SparkleEffect from './components/SparkleEffect'

import cursorImage from './assets/cursor.png'; 

 

function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showGreeting, setShowGreeting] = useState(true);
    const user = useSelector(selectUser);


     const navigate = useNavigate();
    


       useEffect(() => {
         if (user) {
           dispatch(fetchChatHistory(user.token));
         }
       }, [isChatOpen, user, dispatch]);
   
    useEffect(() => {
        const handleBackButton = (event) => {
            if (isChatOpen) {
                event.preventDefault();
                window.history.pushState(null, '');
                setIsChatOpen(false);
            }
        };

        window.addEventListener('popstate', handleBackButton);
        
        // Handle initial state
        if (isChatOpen) {
            window.history.pushState({ chat: true }, '');
        }
        
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [isChatOpen]);


    // Control greeting visibility
    useEffect(() => {
        const toggleGreeting = () => {
            setShowGreeting(true);
            setTimeout(() => setShowGreeting(false), 4000); // Hide after 3 seconds
        };
        toggleGreeting();
        const intervalId = setInterval(toggleGreeting, 10000);
        return () => clearInterval(intervalId);
    }, []);

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
                
                localStorage.removeItem('user');
            }
        }
    }, [dispatch]);

    return (
        <>
            <SparkleEffect />
            <ToastContainer />
            <Navbar />
            <AnimatePresence mode="wait">
                <Routes location={location}
                    key={
                        location.pathname
                    }>
                    <Route path="/"
                        element={
                            <PageWrapper><Home /></PageWrapper>
                        } />
                    <Route path="/category/:name"
                        element={
                            <PageWrapper><Category /></PageWrapper>
                        } />
                    <Route path="/genre/:name"
                        element={
                            <PageWrapper><Genre /></PageWrapper>
                        } />
                    <Route path="/anime/:id"
                        element={
                            <PageWrapper><Anime /></PageWrapper>
                        } />
                    <Route path="/producer/:name"
                        element={
                            <PageWrapper><Producer /></PageWrapper>
                        } />
                    <Route  path="/episodes/:id/:name/:server?/:category?/:episodeId?"
                        element={
                            <PageWrapper><Episodes /></PageWrapper>
                        } />
                    <Route path="/search"
                        element={
                            <PageWrapper><Search /></PageWrapper>
                        } />
                    <Route path="/profile"
                        element={
                            <PageWrapper><Profile /></PageWrapper>
                        } />
                </Routes>
            </AnimatePresence>
            <Footer />

            <div className="fixed bottom-4 right-0 lg:right-10 z-40">
                <div className="relative group transform hover:-translate-y-2 transition-transform duration-700">
                    <button
                        onClick={() => {
                            window.history.pushState({ chat: true }, '');
                            setIsChatOpen(true);
                        }}
                        className="relative w-12 lg:w-16 flex items-center justify-center hover:scale-105 transition-all duration-700"
                        title="AI Chat Assistant"
                    >
                        <img
                            src={aigirl}
                            alt="AI Assistant"
                            className="w-full h-full object-contain animate-img"
                        />
                    </button>


                    {showGreeting && (
                        <div
                            className="absolute bottom-full right-0 mb-1"
                            style={{
                                animation: 'fadeInOut 4s ease-in-out'
                            }}
                        >
                            <div className="bg-gray-900/80 backdrop-blur-sm text-[#f47521] text-xs py-2 px-2 rounded-lg shadow-lg 
                            border border-[#f47521]/20 whitespace-nowrap animate-bounce">
                                Hi {user?.username ? user?.username : ''
                                }, I'm your AI Chat Assistant!
                                <div className="absolute bottom-1 right-20 transform translate-y-full">
                                    <div className="w-2 h-2 bg-gray-900/90 border-r border-b border-[#f47521]/20 rotate-45" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            <AiChat
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />

        </>
    );
}

export default App;
