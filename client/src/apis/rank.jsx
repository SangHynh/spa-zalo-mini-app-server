import axios from "../utils/axios";

// GET RANKS
export const apiGetRanks = () =>
  axios({
    url: "/api/ranks",
    method: "GET",
  });

// PUT RANK
export const apiUpdateRank = (rankId, formData) =>
  axios({
    url: `/api/ranks/${rankId}`,
    method: "PUT",
    data: formData,
  });
