import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {fetchCardAnimeData} from '../redux/apifetch/GetanimeDataSlice';
import {useParams} from 'react-router-dom';
import Season from '../components/Season';
import MoreInfo from '../components/MoreInfo';


export default function Anime() {
    const dispatch = useDispatch();
    const {id} = useParams();
    useEffect(() => {
        dispatch(fetchCardAnimeData(id));
    }, [dispatch]);
    const {CardAnimeData} = useSelector((state) => state.AnimeData);

    const data = CardAnimeData ?. data ?. data;

    console.log(CardAnimeData)

    return (
        <div className='mt-16'>
            <div data-aos="zoom-out-up">
                <Season data={data}/>

            </div>
           
                <MoreInfo data={data}/>

        


        </div>
    )
}
