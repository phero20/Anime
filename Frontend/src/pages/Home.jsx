import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { setActiveSection } from "../redux/apifetch/uiSlice";
import Homeview from '../components/Homeview';
import { useSelector, useDispatch } from "react-redux";
import { fetchAnimeData } from "../redux/apifetch/GetanimeDataSlice";
import AnimeCards from '../components/AnimeCards';

export default function Home() {
  const { AnimeData, loading } = useSelector((state) => state.AnimeData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAnimeData());
  }, [dispatch]);

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: false,
      easing: 'ease-in-out',
      mirror: true,
    });
  });


  const sections = [
    {
      id: "trending",
      data: AnimeData?.data?.data?.trendingAnimes,
      name: "Trending"
    },
    {
      id: "latests",
      data: AnimeData?.data?.data?.latestEpisodeAnimes,
      name: "LatestEpisode"
    },
    {
      id: "upcomings",
      data: AnimeData?.data?.data?.topUpcomingAnimes,
      name: "TopUpcoming"
    },
    {
      id: "airing",
      data: AnimeData?.data?.data?.topAiringAnimes,
      name: "TopAiring"
    },
    {
      id: "popular",
      data: AnimeData?.data?.data?.mostPopularAnimes,
      name: "MostPopular"
    },
    {
      id: "favorite",
      data: AnimeData?.data?.data?.mostFavoriteAnimes,
      name: "MostFavorite"
    },
    {
      id: "completed",
      data: AnimeData?.data?.data?.latestCompletedAnimes,
      name: "LatestCompleted"
    },
  ];
useEffect(() => {
  const handleScroll = () => {
    const ids = ["home", ...sections.map(s => s.id)];
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
          const distance = Math.abs(rect.top - 130); // 100 = offset for your navbar
          if (rect.top <= 130 && distance < minDistance) {
            minDistance = distance;
            closestId = id;
          }
        }
      });
    }
    dispatch(setActiveSection(closestId));
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
  return () => window.removeEventListener("scroll", handleScroll);
}, [dispatch, sections]);

  return (

    <div className="text-white scroll-smooth">
      <div id="home" data-aos="zoom-out-up">
        <Homeview AnimeData={AnimeData} loading={loading} />
      </div>


      <section data-aos="zoom-out-up" id="home">
        <Homeview />
      </section>

      {
        sections.map((item, index) => (
          <section key={index} data-aos="zoom-out-up" id={item.id}>
            <AnimeCards data={item.data} name={item.name} />
          </section>
        ))
      }



    </div>
  );
}
