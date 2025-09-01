import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaGoogle, FaTimes } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { signInUser, signupUser, selectAuthLoading, selectAuthError, clearError, setUser, setError } from '../redux/apifetch/AuthSlicer';
import LoadingAnimation from './LoadingAnimation';
import Greeting from './Greeting';
import formgirl from '../assets/formgirl.png';

export default function Auth({ onClose, showGreeting, setShowGreeting }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [greetMessage, setGreetMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Clear any existing errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    // Client-side validation
    if (!isLogin) {
      if (formData.username.length < 3) {
        dispatch(setError('Username must be at least 3 characters long'));
        return;
      }
      if (formData.password.length < 6) {
        dispatch(setError('Password must be at least 6 characters long'));
        return;
      }
    }

    const action = isLogin ? signInUser : signupUser;
    const credentials = isLogin ? { email: formData.email, password: formData.password } : { ...formData };
    
    const result = await dispatch(action(credentials));

    if (action.fulfilled.match(result)) {
      const userData = result.payload.data;
      dispatch(setUser(userData));
      localStorage.setItem('user', JSON.stringify(userData));
      setGreetMessage(isLogin ? `Welcome back, ${userData.username}!` : `Welcome, ${userData.username}!`);
      setShowGreeting(true);
      setTimeout(() => {
        setShowGreeting(false);
        if (onClose) onClose();
      }, 2000);
    }
  };

  return (
    <>
      {showGreeting ? (
        <div className='h-screen w-screen bg-black/80'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className='w-full h-full flex items-center justify-center'
          >
            <Greeting greetMessage={greetMessage} />
          </motion.div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-2 mx-2 relative">
          {/* Anime Girl Image - absolutely positioned at top center */}
          <div className="absolute left-1/2 top-[3.2rem]  transform -translate-x-1/2 -translate-y-1/2 z-20">
            <img 
              src={formgirl} 
              alt="Anime Girl" 
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-2xl"
            />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg mt-16"
          >
            <div className="bg-gray-950 backdrop-blur-sm border border-[#f47521]/80 rounded-2xl shadow-2xl p-4 px-8 relative">
              {onClose && (
                <button onClick={onClose} className="absolute top-4 right-4 text-[#f47521] hover:text-white transition-colors z-10">
                  <FaTimes size={20} />
                </button>
              )}
              
              <div className="text-center mb-6 sm:mb-8 mt-4 sm:mt-6 md:mt-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#F1EFEC] mb-2">{isLogin ? 'Welcome Back!' : 'Join Us!'}</h1>
                <p className="text-gray-400 text-xs sm:text-sm">{isLogin ? 'Sign in to continue your journey' : 'Create an account to get started'}</p>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto", marginBottom: 16 }}
                    exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg overflow-hidden"
                  >
                    <div className="p-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button className="w-full bg-[#232323] hover:bg-[#2a2a2a] border border-[#f47521]/30 text-[#F1EFEC] py-4 px-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 mb-6 group touch-manipulation active:scale-95 min-h-[52px]" style={{ WebkitTapHighlightColor: 'transparent' }}>
                <FaGoogle className="text-[#f47521] group-hover:scale-110 transition-transform" />
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center mb-6">
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="px-4 text-gray-400 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" className="w-full bg-slate-900 border border-gray-600 focus:border-[#f47521] text-[#F1EFEC] py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f47521]/20 transition-all duration-300" required={!isLogin} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full bg-slate-900 border border-gray-600 focus:border-[#f47521] text-[#F1EFEC] py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f47521]/20 transition-all duration-300" required />
                </div>

                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" className="w-full bg-slate-900 border border-gray-600 focus:border-[#f47521] text-[#F1EFEC] py-3 pl-10 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f47521]/20 transition-all duration-300" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#f47521] transition-colors p-2 touch-manipulation active:scale-95" style={{ WebkitTapHighlightColor: 'transparent' }}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }} 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r hover:scale-105 from-[#f47521] to-[#e65a0a] hover:from-[#e65a0a] hover:to-[#f47521] text-[#181818] font-bold py-2 px-2 rounded-full transition-all duration-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95 min-h-[56px] cursor-pointer" 
                  style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                >
                  {loading ? <LoadingAnimation size={10}/> : (isLogin ? 'Sign In' : 'Create Account')}
                </motion.button>
              </form>

              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={() => { setIsLogin(!isLogin); setFormData({ username: '', email: '', password: '' }); dispatch(clearError()); }} className="text-[#f47521] hover:text-[#e65a0a] font-semibold transition-colors py-2 px-2 touch-manipulation active:scale-95" style={{ WebkitTapHighlightColor: 'transparent' }}>
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>

              <AnimatePresence>
                {isLogin && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="text-center mt-4">
                    <button className="text-[#f47521] hover:text-[#e65a0a] text-sm transition-colors py-2 px-2 touch-manipulation active:scale-95">
                      Forgot your password?
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="absolute top-10 left-10 w-20 h-20 bg-[#f47521]/10 rounded-full blur-xl -z-10"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#f47521]/5 rounded-full blur-xl -z-10"></div>
          </motion.div>
        </div>
      )}
    </>
  );
}