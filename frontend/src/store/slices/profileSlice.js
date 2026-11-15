import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";


import {
    getProfile,
    createProfile,
    updateProfile
} from "../../services/profileService";




// GET PROFILE

export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async () => {

        return await getProfile();

    }
);




// CREATE PROFILE

export const addProfile = createAsyncThunk(
    "profile/createProfile",
    async(data)=>{

        return await createProfile(data);

    }
);




// UPDATE PROFILE

export const editProfile = createAsyncThunk(
    "profile/updateProfile",
    async(data)=>{

        return await updateProfile(data);

    }
);



const initialState = {

    profile:null,

    loading:false,

    error:null

};



const profileSlice = createSlice({

    name:"profile",

    initialState,


    reducers:{},


    extraReducers:(builder)=>{


        builder


        // FETCH

        .addCase(fetchProfile.pending,(state)=>{

            state.loading=true;

        })


        .addCase(fetchProfile.fulfilled,(state,action)=>{

            state.loading=false;

            state.profile = action.payload.user || action.payload.profile;

        })


        .addCase(fetchProfile.rejected,(state,action)=>{

            state.loading=false;

            state.error =
                action.error.message;

        })



        // CREATE

        .addCase(addProfile.fulfilled,(state,action)=>{

            state.profile =
                action.payload.profile;

        })



        // UPDATE

        .addCase(editProfile.fulfilled,(state,action)=>{

            state.profile =
                action.payload.user || action.payload.profile;

        });


    }


});


export default profileSlice.reducer;
