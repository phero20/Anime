import axios from "axios";


const fetchAnimeData = async (req, res) => {
    try {
        const response = await axios.get("https://anime-api-gilt-six.vercel.app/api/v2/hianime/home");
        return res.json({success: true, data: response.data});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

const fetchCategoryData = async (req, res) => {
    try {
      const name = req.params.name;
      const page = req.params.page
      const response = await axios.get(`https://anime-api-gilt-six.vercel.app/api/v2/hianime/category/${name}?page=${page}`)
      return res.json({success: true, data: response.data});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

const fetchGenreData = async (req, res) => {
    try {
      const name = req.params.name;
      const page = req.params.page
      const response = await axios.get(`https://anime-api-gilt-six.vercel.app/api/v2/hianime/genre/${name}?page=${page}`)
      return res.json({success: true, data: response.data});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export {
    fetchAnimeData,
    fetchCategoryData,
    fetchGenreData
};
