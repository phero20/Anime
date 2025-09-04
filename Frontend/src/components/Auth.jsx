// Auth.jsx
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
        <Greeting greetMessage={greetMessage} />
      ) : (
        <div className="flex items-center justify-center p-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-md"
          >
            <div className="relative mt-12">
              <div className="absolute left-1/2 -top-[4.5rem] transform -translate-x-1/2 z-20">
                <img 
                  src={formgirl} 
                  alt="Anime Girl" 
                  className="w-28 h-28 object-contain drop-shadow-2xl"
                />
              </div>
              <div className="bg-gray-950 backdrop-blur-sm border border-[#f47521]/50 rounded-2xl shadow-2xl p-6 relative">
                {onClose && (
                  <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10">
                    <FaTimes size={20} />
                  </button>
                )}
                
                <div className="text-center mb-6 mt-4">
                  <h1 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back!' : 'Join Us!'}</h1>
                  <p className="text-gray-400 text-sm">{isLogin ? 'Sign in to continue your journey' : 'Create an account to get started'}</p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" className="w-full bg-slate-900 border border-gray-600 focus:border-[#f47521] text-white py-3 pl-10 pr-4 rounded-lg focus:outline-none transition-colors" required={!isLogin} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full bg-slate-900 border border-gray-600 focus:border-[#f47521] text-white py-3 pl-10 pr-4 rounded-lg focus:outline-none transition-colors" required />
                  </div>

                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" className="w-full bg-slate-900 border border-gray-600 focus:border-[#f47521] text-white py-3 pl-10 pr-12 rounded-lg focus:outline-none transition-colors" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f47521] p-2">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#f47521] to-[#e65a0a] text-black font-bold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center min-h-[52px]">
                    {loading ? <LoadingAnimation size={10}/> : (isLogin ? 'Sign In' : 'Create Account')}
                  </motion.button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setIsLogin(!isLogin); setFormData({ username: '', email: '', password: '' }); dispatch(clearError()); }} className="font-semibold text-[#f47521] hover:underline ml-1">
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}