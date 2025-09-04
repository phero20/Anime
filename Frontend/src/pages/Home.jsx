import React, {useEffect} from 'react';
import {setActiveSection} from "../redux/apifetch/uiSlice";
import Homeview from '../components/Homeview';
import {useSelector,useDispatch} from "react-redux";
import AnimeCards from '../components/AnimeCards';
import TopAnimeList from '../components/TopAnimeList';
import MiddlePosters from '../components/MiddlePosters';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    const {AnimeData, loading} = useSelector((state) => state.AnimeData);
    const location = useLocation();
    const dispatch = useDispatch();

    const top10Animes = AnimeData?.data?.data?.top10Animes;
    const poster1Data = AnimeData?.data?.data?.spotlightAnimes[6];
    const poster2Data = AnimeData?.data?.data?.spotlightAnimes[1];
    const poster3Data = AnimeData?.data?.data?.spotlightAnimes[2];

    const sections = [
        {
            id: "trending",
            data: AnimeData?.data?.data?.trendingAnimes,
            name: "Trending"
        },
        {
            id: "latests",
            data: AnimeData?.data?.data?.latestEpisodeAnimes,
            name: "Latest Episode"
        },
        {
            id: "upcomings",
            data: AnimeData?.data?.data?.topUpcomingAnimes,
            name: "Top Upcoming"
        },
        {
            id: "top10",
            data: AnimeData?.data?.data?.topAiringAnimes,
            name: "Top10"
        }, {
            id: "airing",
            data: AnimeData?.data?.data?.topAiringAnimes,
            name: "Top Airing"
        }, {
            id: "popular",
            data: AnimeData?.data?.data?.mostPopularAnimes,
            name: "Most Popular"
        }, {
            id: "favorite",
            data: AnimeData?.data?.data?.mostFavoriteAnimes,
            name: "Most Favorite"
        }, {
            id: "completed",
            data: AnimeData?.data?.data?.latestCompletedAnimes,
            name: "Latest Completed"
        },
    ];

    const sections1 = [
        {
            id: "popular",
            data: AnimeData?.data?.data?.mostPopularAnimes,
            name: "Most Popular"
        },
       {
            id: "latests",
            data: AnimeData?.data?.data?.latestEpisodeAnimes,
            name: "Latest Episode"
        }, {
            id: "upcomings",
            data: AnimeData?.data?.data?.topUpcomingAnimes,
            name: "Top Upcoming"
        },
    ];

    const sections2 = [
        {
            id: "airing",
            data: AnimeData?.data?.data?.topAiringAnimes,
            name: "Top Airing"
        }, {
            id: "trending",
            data: AnimeData?.data?.data?.trendingAnimes,
            name: "Trending"
        },  {
            id: "favorite",
            data: AnimeData?.data?.data?.mostFavoriteAnimes,
            name: "Most Favorite"
        }
    ];

    const sections3 = [
         {
            id: "completed",
            data: AnimeData?.data?.data?.latestCompletedAnimes,
            name: "Latest Completed"
        },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const ids = [
                "home",
                ...sections.map(s => s.id)
            ];
            let closestId = "home";
            let minDistance = Infinity;

            // If at the bottom of the page, select the last section
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
                closestId = ids[ids.length - 1];
            } else {
                ids.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        const distance = Math.abs(rect.top - 130);
                        if (rect.top <= 130 && distance < minDistance) {
                            minDistance = distance;
                            closestId = id;
                        }
                    }
                });
            } 
            dispatch(setActiveSection(closestId));
        };

        window.addEventListener("scroll", handleScroll, {passive: true});
        handleScroll();
        return() => window.removeEventListener("scroll", handleScroll);
    }, [dispatch, sections]);

    useEffect(() => {
        if (location.state?.scrollTo) {
          const section = location.state.scrollTo;
      
          // Delay to ensure DOM is ready
          setTimeout(() => {
            scroller.scrollTo(section, {
              smooth: true,
              duration: 900,
              offset: 0,
            });
          });
        }
    }, [location]);

    return (
        <div className="text-white scroll-smooth w-full overflow-hidden">
            <motion.div 
                id="home"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: .6 }}
            >
                <Homeview AnimeData={AnimeData} loading={loading}/>
            </motion.div>

            {sections1.map((item, index) => (
                <motion.section 
                    key={index} 
                    id={item.id}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    viewport={{ once: false, margin: "-80px" }}
                    transition={{ duration: .6, delay: index * 0.1 }}
                >
                    <AnimeCards data={item.data} name={item.name} scroll={true}/>
                </motion.section>
            ))}

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                viewport={{ once: false, margin: "-80px" }}
                transition={{ duration: .6 }}
            >
                <MiddlePosters data={poster1Data}/>
            </motion.div>

            <motion.section 
                id="top10"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                viewport={{ once: false, margin: "-80px" }}
                transition={{ duration: .6 }}
            >
                <TopAnimeList top10Animes={top10Animes}/>
            </motion.section>
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                viewport={{ once: false, margin: "-80px" }}
                transition={{ duration: .6 }}
            >
                <MiddlePosters data={poster2Data}/>
            </motion.div>
            
            {sections2.map((item, index) => (
                <motion.section 
                    key={index} 
                    id={item.id}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    viewport={{ once: false, margin: "-80px" }}
                    transition={{ duration: .6, delay: index * 0.1 }}
                >
                    <AnimeCards data={item.data} name={item.name} scroll={true}/>
                </motion.section>
            ))}
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                viewport={{ once: false, margin: "-80px" }}
                transition={{ duration: .6 }}
            >
                <MiddlePosters data={poster3Data}/>
            </motion.div>

            {sections3.map((item, index) => (
                <motion.section 
                    key={index} 
                    id={item.id}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    viewport={{ once: false, margin: "-80px" }}
                    transition={{ duration: .6, delay: index * 0.1 }}
                >
                    <AnimeCards data={item.data} name={item.name} scroll={true}/>
                </motion.section>
            ))}
        </div>
    );
}