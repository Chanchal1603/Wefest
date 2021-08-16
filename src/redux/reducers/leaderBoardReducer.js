import {
  ETCH_LEADERBOARD_FAIL,
  FETCH_LEADERBOARD_SUCCESS,
  FETCH_LEADERBOARD_REQUEST,
} from '../types';

const initialState = {
  loading: false,
  error: null,
  leaderBoard: [],
};

export const laderBoardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LEADERBOARD_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_LEADERBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        leaderBoard: action.payload,
      };

    case ETCH_LEADERBOARD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
