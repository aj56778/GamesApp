import { configureStore, createReducer, createSlice, Middleware, PayloadAction } from "@reduxjs/toolkit";
import { CreateApi, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TBoardGameData } from "../types/boardGames";
import { TPeople } from "../front-end/HomeScreen";
import { persistReducer } from "redux-persist";

export const boardGame = createApi({
    reducerPath: 'BoardGameAPI',
    baseQuery: fetchBaseQuery({baseUrl: 'https://bgg-json.azurewebsites.net/'}),
    endpoints: (builder) => ({
        getGameBoards: builder.query({
            query: () => 'collection/edwalter'
        })
    })
})

const initialData: TBoardGameData[] = [];
const people: TPeople[] = [];

export const gameBoardStore = createSlice({
    name: 'DatingStore',
    initialState: {
        data: initialData,
        people: people,
    },
    reducers: {
        setData: (state, {payload}) => ({
            ...state,
            data: payload
        }),
        setPeople: (state, {payload}) => ({
            ...state,
            people: payload
        }),
        
    }
})

export type TloginType = 'Sign up' | 'Sign in'
type Tvisible = boolean


const initalLogin: TloginType = 'Sign in'
const initalVisible: Tvisible = false

export const userData = createSlice({
    name: 'User Generated Data',
    initialState: {
        loginType: initalLogin,
        visible: initalVisible,
        profilePic: ''

    },
    reducers: {
        setVisible: (state, {payload}) => ({
            ...state,
            visible: payload
        }),
        setLoginType: (state, {payload})=> ({
            ...state,
            loginType: payload
        }),
        setProfilePic: (state, {payload}) => ({
            ...state,
            profilePic: payload
        }),
    }
});

// const persistedUser = persistReducer(userData.reducer)
export const store = configureStore({
    reducer: {
        userInteraction: userData.reducer,
        games: gameBoardStore.reducer
    },
    
})
export const { useGetGameBoardsQuery} = boardGame;