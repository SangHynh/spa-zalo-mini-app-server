import axios from "../utils/axios";

// UPDATE PLAY COUNT
export const apiUpdatePlayCount = (userId, playCount) =>
  axios({
    url: "/api/minigame/update-play-count",
    method: "PUT",
    data: {
      userId,
      playCount,
    },
  });

export const apiGetUsersPlayCount = (page, limit, keyword) =>
  axios({
    url: `/api/minigame/users/play-count?page=${page}&limit=${limit}&keyword=${keyword}`,
    method: "GET",
  });
