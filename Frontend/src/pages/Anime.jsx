import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {fetchCardAnimeData} from '../redux/apifetch/GetanimeDataSlice';
import {useParams} from 'react-router-dom';
import Season from '../components/Season';
import MoreInfo from '../components/MoreInfo';
import AnimeCards from '../components/AnimeCards'
import LoadingAnimation from '../components/LoadingAnimation';
import { motion } from 'framer-motion';


export default function Anime() {
    const dispatch = useDispatch();
    const {id} = useParams();
    useEffect(() => {
        dispatch(fetchCardAnimeData(id));
    }, [dispatch]);
    const {CardAnimeData, loading} = useSelector((state) => state.AnimeData);

    const data = CardAnimeData?.data?.data;
    const relatedAnimes = CardAnimeData?.data?.data?.relatedAnimes;
    const recommendedAnimes = CardAnimeData?.data?.data?.recommendedAnimes;


    // Show loading animation while data is loading
    if (loading || !data) {
        return (
            <div className='w-full overflow-hidden'>
                <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">
                    <LoadingAnimation />
                </div>
            </div>
        );
    }

    return (
        <div className='w-full overflow-hidden'>
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: .6}}
            >
                <Season data={data}/>
            </motion.div>
           
          
            <MoreInfo data={data}/>
           
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: .6}}
              className='mt-10'
            >
                <AnimeCards data={relatedAnimes} name={'Related'} scroll={true}  />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              viewport={{ once: false }}
              transition={{ duration: .6}}
              className='mt-5'
            >
                <AnimeCards data={recommendedAnimes} name={'Recommended'} scroll={true}  />
            </motion.div>
        </div>
    )
}
