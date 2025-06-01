import express from "express"
import { authmiddleware } from "../middleware/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlaylistDetails, removeProblemFromPlaylist } from "../controllers/playlist.controller.js";

const playlistRoutes = express.Router();

playlistRoutes.get("/", authmiddleware, getAllListDetails);

playlistRoutes.get("/:playlistId", authmiddleware, getPlaylistDetails);

playlistRoutes.post("/create-playlist", authmiddleware, createPlaylist);

playlistRoutes.post("/:playlistId/add-problem", authmiddleware, addProblemToPlaylist);

playlistRoutes.delete("/delete-playlist/:playlistId", authmiddleware, deletePlaylist);

playlistRoutes.delete("/:playlistId/remove-problem", authmiddleware, removeProblemFromPlaylist);


export default playlistRoutes;