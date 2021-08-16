import {
    ETCH_LEADERBOARD_FAIL,
    FETCH_LEADERBOARD_REQUEST,
    FETCH_LEADERBOARD_SUCCESS,
  } from '../types';


  export const leaderBoardRequest = () => ({
    type: FETCH_LEADERBOARD_REQUEST
  });
  export const leaderBoardRequestFail = (payload = {}) => ({
    type:  ETCH_LEADERBOARD_FAIL,
    payload: payload,
  });
  export const leaderBoardRequestSuccess = (payload = {}) => ({
    type: FETCH_LEADERBOARD_SUCCESS,
    payload: payload,
  });