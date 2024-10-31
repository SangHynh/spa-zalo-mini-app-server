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
