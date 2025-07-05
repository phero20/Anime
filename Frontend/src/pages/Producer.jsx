import {useParams} from 'react-router-dom';
import AnimeCards from '../components/AnimeCards';
import {useSelector, useDispatch} from 'react-redux';
import {fetchProducerAnimeData} from '../redux/apifetch/GetanimeDataSlice';
import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';


const Producer = () => {
    const dispatch = useDispatch();
    const {name} = useParams();
    const [page, setPage] = useState(1);
    const location = useLocation();

    const {ProducerAnimeData} = useSelector((state) => state.AnimeData);
    const animes = ProducerAnimeData?.data?.data?.animes || [];
    const hasMore = ProducerAnimeData?.data?.data?.hasNextPage !== false;

    useEffect(() => {
        setPage(1);
        dispatch(fetchProducerAnimeData({name, page: 1}));
    }, [dispatch, name]);

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 600);

    }, [location.pathname]);
        

    const fetchMoreData = () => {
        const nextPage = page + 1;
        dispatch(fetchProducerAnimeData({name, page: nextPage}));
        setPage(nextPage);
    };

    return (
        <div className="mt-16">
            <AnimeCards data={animes}
                name={
                    name.toUpperCase()
                }
                scroll={false}
                fetchMoreData={fetchMoreData}
                hasMore={hasMore}/>
        </div>
    );
};

export default Producer;
