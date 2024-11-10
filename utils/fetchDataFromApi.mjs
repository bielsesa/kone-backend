import axios from "axios";

const fetchDataFromApi = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.error("Error fetching data from API:", error);
        throw error;
    }
};

export default fetchDataFromApi;