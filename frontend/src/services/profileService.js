import { apiClient } from "./apiClient";


// GET PROFILE
export const getProfile = async () => {

    const res = await apiClient.get("/users/profile");

    return res.data;

};



// CREATE PROFILE
export const createProfile = async (data) => {
    const res = await apiClient.post("/profile", data);
    return res.data;
};



// UPDATE PROFILE
export const updateProfile = async (data) => {

    const res = await apiClient.put(
        "/users/profile",
        data
    );

    return res.data;

};
