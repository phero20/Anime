import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {fetchCardAnimeData} from '../redux/apifetch/GetanimeDataSlice';
import {useParams} from 'react-router-dom';
import Season from '../components/Season';
import MoreInfo from '../components/MoreInfo';
import AnimeCards from '../components/AnimeCards'


export default function Anime() {
    const dispatch = useDispatch();
    const {id} = useParams();
    useEffect(() => {
        dispatch(fetchCardAnimeData(id));
    }, [dispatch]);
    const {CardAnimeData} = useSelector((state) => state.AnimeData);

    const data = CardAnimeData ?. data ?. data;
    const relatedAnimes = CardAnimeData ?. data ?. data.relatedAnimes;
    const recommendedAnimes = CardAnimeData ?. data ?. data.recommendedAnimes;

    console.log(CardAnimeData)

    return (
        <div className='mt-16 w-full overflow-hidden'>
            <div data-aos="zoom-out-up">
                <Season data={data}/>

            </div>
           
                <MoreInfo data={data}/>

                  
                <div data-aos="zoom-out-up">
                    
                <AnimeCards data={relatedAnimes} name={'Related'} scroll={true}  />
                </div>

                <div data-aos="zoom-out-up">
                    
                    <AnimeCards data={recommendedAnimes} name={'Recommended'} scroll={true}  />
                    </div>
        


        </div>
    )
}
