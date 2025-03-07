import axios from "axios";

const BASE_URL = "http://localhost:5294/api/Category";

export const fetchCategories = async () => {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
}