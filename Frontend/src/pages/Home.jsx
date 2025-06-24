import React, {useEffect} from 'react';
import {setActiveSection} from "../redux/apifetch/uiSlice";
import Homeview from '../components/Homeview';
import {useSelector,useDispatch} from "react-redux";
import AnimeCards from '../components/AnimeCards';
import TopAnimeList from '../components/TopAnimeList';
import MiddlePosters from '../components/MiddlePosters';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';


export default function Home() {
    const {AnimeData, loading} = useSelector((state) => state.AnimeData);

const location = useLocation();
 
       const dispatch = useDispatch();


    const top10Animes = AnimeData ?. data ?. data ?. top10Animes;
    const poster1Data = AnimeData ?. data ?. data ?. spotlightAnimes[6];
    const poster2Data = AnimeData ?. data ?. data ?. spotlightAnimes[1];
    const poster3Data = AnimeData ?. data ?. data ?. spotlightAnimes[2];


    const sections = [
        {
            id: "trending",
            data: AnimeData ?. data ?. data ?. trendingAnimes,
            name: "Trending"
        },
        {
            id: "latests",
            data: AnimeData ?. data ?. data ?. latestEpisodeAnimes,
            name: "Latest Episode"
        },
        {
            id: "upcomings",
            data: AnimeData ?. data ?. data ?. topUpcomingAnimes,
            name: "Top Upcoming"
        },
        {
            id: "top10",
            data: AnimeData ?. data ?. data ?. topAiringAnimes,
            name: "Top10"
        }, {
            id: "airing",
            data: AnimeData ?. data ?. data ?. topAiringAnimes,
            name: "Top Airing"
        }, {
            id: "popular",
            data: AnimeData ?. data ?. data ?. mostPopularAnimes,
            name: "Most Popular"
        }, {
            id: "favorite",
            data: AnimeData ?. data ?. data ?. mostFavoriteAnimes,
            name: "Most Favorite"
        }, {
            id: "completed",
            data: AnimeData ?. data ?. data ?. latestCompletedAnimes,
            name: "Latest Completed"
        },
    ];

    const sections1 = [
        {
            id: "trending",
            data: AnimeData ?. data ?. data ?. trendingAnimes,
            name: "Trending"
        }, {
            id: "latests",
            data: AnimeData ?. data ?. data ?. latestEpisodeAnimes,
            name: "Latest Episode"
        }, {
            id: "upcomings",
            data: AnimeData ?. data ?. data ?. topUpcomingAnimes,
            name: "Top Upcoming"
        },
    ];

    const sections2 = [
        {
            id: "airing",
            data: AnimeData ?. data ?. data ?. topAiringAnimes,
            name: "Top Airing"
        }, {
            id: "popular",
            data: AnimeData ?. data ?. data ?. mostPopularAnimes,
            name: "Most Popular"
        }, {
            id: "favorite",
            data: AnimeData ?. data ?. data ?. mostFavoriteAnimes,
            name: "Most Favorite"
        }, {
            id: "completed",
            data: AnimeData ?. data ?. data ?. latestCompletedAnimes,
            name: "Latest Completed"
        },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const ids = [
                "home",
                ... sections.map(s => s.id)
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
            } dispatch(setActiveSection(closestId));
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
              duration: 800,
              offset: -80,
            });
          }, 150);
        }
      }, [location]);

    return (
        <div className="text-white scroll-smooth">
            <div id="home" data-aos="zoom-out-up">
                <Homeview AnimeData={AnimeData}
                    loading={loading}/>
            </div>

            {
            sections1.map((item, index) => (
                <section key={index}
                    data-aos="zoom-out-up"
                    id={
                        item.id
                }>
                    <AnimeCards data={
                            item.data
                        }
                        name={
                            item.name
                        }
                        scroll={true}
                        />
                </section>
            ))
        }

            <div data-aos="zoom-out-up">
                <MiddlePosters data={poster1Data}/>
            </div>

            <section id="top10">
                <TopAnimeList top10Animes={top10Animes}/>
            </section>
            <div data-aos="zoom-out-up">
                <MiddlePosters data={poster2Data}/>
            </div>
            {
            sections2.map((item, index) => (
                <section key={index}
                    data-aos="zoom-out-up"
                    id={
                        item.id
                }>
                    <AnimeCards data={
                            item.data
                        }
                        name={
                            item.name
                        }
                        scroll={true}
                        />
                </section>


            ))
        }
            <div data-aos="zoom-out-up">
                <MiddlePosters data={poster3Data}/>
            </div>
        </div>
    );
}
