import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const usePlaylistStore = create( (set, get) =>({
    playlists:[],
    currentPlaylist:null,
    isLoading:false,
    error:null,

    createPlaylist: async (playlistData) =>{
        try {
            set( {isLoading:true} );
            const res = await axiosInstance.post("/playlist/create-playlist", playlistData);

            set( (state)=>({
                playlists: [...state.playlists, res.data.platlist]
            }))

            toast.success(res.data.message);

            return res.data.playlist;
        } catch (error) {
            console.log("Error creating playlist", error);
            toast.error(error.res?.data?.error || "Failed creating playlist");
            throw error;
        }
        finally{
            set( {isLoading:false} );
        }
    },

    getAllPlaylist: async()=>{
        try {
            set( {isLoading:true} );

            const res = await axiosInstance.get("/playlist");

            set( {playlists: res.data.playlists} )
        } catch (error) {
            console.log("Error fetching playlist", error);
            if(error.response.status===500)
                toast.error("Failed to fetch playlists")
        } finally{
            set( {isLoading:false} )
        }
    },

    getPlaylistDetail: async(playlistId)=>{
        try {
            set( {isLoading:true} );

            const res = await axiosInstance.get(`/playlist/${playlistId}`);

            set( {currentPlaylist:res.data.playList} );

        } catch (error) {
            console.log("Error fetching playlist details", error);
            toast.error("Failed to fetch playlist detail")
        } finally{
            set( {isLoading:false} )
        }
    }, 

    addproblemToPlaylist: async (playlistId, problemIds)=>{
        try {
            set( {isLoading:true} );

            await axiosInstance.post(`playlist/${playlistId}/add-problem`, {problemIds});

            toast.success("Problem added to playlist")

            if(get().currentPlaylist?.id === playlistId){
                await get().getPlaylistDetail(playlistId)
            }

        } catch (error) {
            console.log("Error adding problem", error);
            toast.error("Failed to add problem in playlist");
        } finally {
            set( {isLoading:false} )
        }
    }, 

    removeProblemFromPlaylist: async(playlistId, problemIds) =>{
        try {
            set( {isLoading:true} );
            await axiosInstance.delete(`playlist/${playlistId}/remove-problem`, {
                data : {problemIds}
            });

            toast.success("Problem removed from playlist");

            // refresh the playlist details
            if(get().currentPlaylist?.id === playlistId){
                await get().getPlaylistDetail(playlistId)
            }

        } catch (error) {
            console.log("Error removing problem from playlist", error);
            toast.error("failed to delete problems from playlist")
        } finally {
            set( {isLoading:false} )
        }
    },

    deletePlaylist: async (playlistId) =>{
        try {
            set( {isLoading:true} )
            await axiosInstance.delete(`playlist/delete-playlist/${playlistId}`)

            set( (state)=>({
                playlists: state.playlists.filter( (p)=> p.id !== playlistId)
            }))

            toast.success("Playlist deleted successfully");
        } catch (error) {
            console.log("Error deleting playlist", error);
            toast.error("failed to delete playlist")
        } finally {
            set( {isLoading:false} )
        }
    }
}))