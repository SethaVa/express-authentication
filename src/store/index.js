import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    username: "",
    active: false
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUsername: (state, action) => {
            const {username} = action.payload;
            state.username = username
        }
    }
})

export const {setUsername} = authSlice.actions;

export default authSlice.reducer;