import {useParams} from 'react-router-dom';
import AnimeCards from '../components/AnimeCards';
import {useSelector, useDispatch} from 'react-redux';
import {fetchCategoryAnimeData} from '../redux/apifetch/GetanimeDataSlice';
import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';


const Category = () => {
    const dispatch = useDispatch();
    const {name} = useParams();
    const [page, setPage] = useState(1);
    const location = useLocation();

    const {CategoryAnimeData} = useSelector((state) => state.AnimeData);
    const animes = CategoryAnimeData ?. data ?. data ?. animes || [];
    const hasMore = CategoryAnimeData ?. data ?. data ?. hasNextPage !== false;

    useEffect(() => {
        setPage(1);
        dispatch(fetchCategoryAnimeData({name, page: 1}));
    }, [dispatch, name]);

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 600);

    }, [location.pathname]);


    const fetchMoreData = () => {
        const nextPage = page + 1;
        dispatch(fetchCategoryAnimeData({name, page: nextPage}));
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

export default Category;
