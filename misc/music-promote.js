const fetch = require("node-fetch");
const config = require("../config");

let K_TOKEN = {
  access_token: "",
  expiry: 0,
};

const encodeQuery = (params) =>
  Object.keys(params)
    .map((key) => [key, params[key]].map(encodeURIComponent).join("="))
    .join("&");

const refreshToken = async () => {
  // https://developers.google.com/accounts/docs/OAuth2InstalledApp#refresh
  const params = {
    client_id: config.settings.music_promote.clientId,
    client_secret: config.settings.music_promote.clientSecret,
    refresh_token: config.settings.music_promote.refreshToken,
    grant_type: "refresh_token",
  };
  const url = "https://accounts.google.com/o/oauth2/token";
  const res = await fetch(url + "?" + encodeQuery(params), {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  }).then((res) => res.json());

  K_TOKEN = {
    access_token: res.access_token,
    expiry: Date.now() - 30000 + res.expires_in * 1000,
  };
};

const insertPlaylist = async (videoId) => {
  const playlistId = config.settings.music_promote.playlistId;
  if (Date.now() > K_TOKEN.expiry) await refreshToken();

  // Check if already exists in playlist
  console.log("Checking existing playlist");
  const listRes = await fetch(
    "https://youtube.googleapis.com/youtube/v3/playlistItems?" +
      encodeQuery({
        part: "id",
        videoId,
        playlistId,
      }),
    {
      headers: {
        Authorization: "Bearer " + K_TOKEN.access_token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  ).then((res) => res.json());

  if (listRes.pageInfo.totalResults > 0)
    return console.log("Video already exists in list, skipping");

  console.log("Inserting to playlist", videoId);
  const insertRes = await fetch(
    "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + K_TOKEN.access_token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        snippet: {
          playlistId,
          position: 0,
          resourceId: {
            kind: "youtube#video",
            videoId,
          },
        },
      }),
    }
  ).then((res) => res.json());
};

module.exports = { insertPlaylist };
