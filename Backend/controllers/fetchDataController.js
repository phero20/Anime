import axios from "axios";

const backendUrl = process.env.BACKEND_URL

const fetchHomeData = async (req, res) => {
    try {
        const response = await axios.get(backendUrl + "/api/v2/hianime/home");
        return res.json({success: true, data: response.data});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

const fetchCategoryData = async (req, res) => {
    try {
        const name = req.params.name;
        const page = req.params.page
        const response = await axios.get(backendUrl + `/api/v2/hianime/category/${name}?page=${page}`)
        return res.json({success: true, data: response.data});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

const fetchGenreData = async (req, res) => {
    try {
        const name = req.params.name;
        const page = req.params.page
        const response = await axios.get(backendUrl + `/api/v2/hianime/genre/${name}?page=${page}`)
        return res.json({success: true, data: response.data});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

const fetchAnimeData = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await axios.get(backendUrl + `/api/v2/hianime/anime/${id}`)
        return res.json({success: true, data: response.data});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

const fetchProducerData = async (req, res) => {
    try {
        const name = req.params.name;
        const page = req.params.page;
        const response = await axios.get(backendUrl + `/api/v2/hianime/producer/${name}?page=${page}`)
        return res.json({success: true, data: response.data});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

const fetchEpisodesData = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await axios.get(backendUrl + `/api/v2/hianime/anime/${id}/episodes`)
        return res.json({success: true, data: response.data});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

const fetchEpisodesServerData = async (req, res) => {
    try {
        const episodeId = req.body.episodeId
        const response = await axios.get(backendUrl +`/api/v2/hianime/episode/servers?animeEpisodeId=${episodeId}`)
        return res.json({success: true, data: response.data});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export {
    fetchHomeData,
    fetchCategoryData,
    fetchGenreData,
    fetchAnimeData,
    fetchProducerData,
    fetchEpisodesData,
    fetchEpisodesServerData
};
