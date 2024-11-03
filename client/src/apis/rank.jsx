import axios from "../utils/axios";

// GET RANKS
export const apiGetRanks = () =>
  axios({
    url: "/api/ranks",
    method: "GET",
  });

// POST RANK
export const apiCreateRank = (formData) =>
  axios({
    url: "/api/ranks",
    method: "POST",
    data: formData,
  });

// PUT RANK
export const apiUpdateRank = (rankId, formData) =>
  axios({
    url: `/api/ranks/${rankId}`,
    method: "PUT",
    data: formData,
  });

// PUT RANK
export const apiUpdateAllUserRank = () =>
  axios({
    url: `/api/ranks/users/apply-all`,
    method: "PUT",
  });

// PUT RANK { userId, rankPoints, points }
export const apiUpdateUserPoints = (data) =>
  axios({
    url: `/api/ranks/users/points`,
    method: "PUT",
    data
  });

// DELETE RANK
export const apiDeleteRank = (rankId) =>
  axios({
    url: `/api/ranks/${rankId}`,
    method: "DELETE",
  });
