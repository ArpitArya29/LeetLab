import { db } from "../libs/db.js";

export const getAllListDetails = async(req, res) =>{
    try {
        const userId = req.user.id; 
        const playlists = await db.playList.findMany({
            where:{
                userId
            },
            include:{
                problems:{
                    include:{problem:true}
                }
            }
        })

        if(playlists.length==0){
            res.status(404).json({
                message:"No any Playlist found"
            })
        }

        res.status(200).json({
            success:true,
            message:"All Lists Fetched Successfully",
            playlists
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success:false,
            error:"Error in Fetching Playlists"
        })
    }
}

export const getPlaylistDetails = async(req, res) =>{

    try {
        const playlistId = req.params.playlistId;

        const playList = await db.playList.findUnique({
            where:{
                id:playlistId,
                userId:req.user.id
            },
            include:{
                problems:{
                    include:{problem:true}
                }
            }
        })
    
        if(!playList){
            return res.status(404).json({
                message:"PlayList not found"
            })
        }
    
        res.status(200).json({
            success:true,
            message:"PlayList details fetched",
            playList
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success:false,
            error:"failed in fetching playlist"
        })
    }
}

export const createPlaylist = async(req, res) =>{
    try {
        const { name, description } = req.body;

        const userId = req.user.id;

        const existingPlaylist = await db.playList.findMany({
            where:{
                name
            }
        })
        
        // findMany returns an array
        if(existingPlaylist.length!=0){
            return res.status(409).json({
                success:false,
                message:"PlayList already exists"
            })
        }
        
        const playlist = await db.playList.create({
            data:{
                name,
                description,
                userId,
            }
        })

        res.status(201).json({
            success:true,
            message:"PlayList Cteated",
            playlist
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success:false,
            error:"Failed to create playlist"
        })
    }
}

export const addProblemToPlaylist = async(req, res) =>{
    try {
        const {playlistId} = req.params;

        const {problemIds} = req.body;

        if(!Array.isArray(problemIds) || problemIds.length===0){
            return res.status(422).json({
                error:"Invalid or missing problem"
            })
        }

        const existingProblems = await db.problemInPlaylist.findMany({
            where: {
                playListId: playlistId,
                problemId: { in: problemIds },
            },
            select: { problemId: true },
        });

        if(existingProblems.length!=0){
            const existingProblemList = existingProblems.map( (p)=> p.problemId);

            return res.status(409).json({
                error:"Some Problem already exist in playlist",
                conflictCount:existingProblemList.length,
                existingProblemList
            })
        }

        const problemInPlaylist = await db.problemInPlaylist.createMany({
            data:problemIds.map( (problemId)=>({
                playListId:playlistId,
                problemId
            }))
        })

        res.status(201).json({
            success:true,
            message:"Problem added to playlist successfully",
            problemInPlaylist
        })

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success:false,
            error:"Failed to add problems"
        })
    }
}

export const deletePlaylist = async(req, res) =>{
    const {playlistId} = req.params;

    try {

        const existingPlaylist = await db.playList.findUnique({
            where:{
                id:playlistId
            }
        })

        if(!existingPlaylist){
            return res.status(404).json({
                error:"Playlist not found"
            })
        }

        const deletedPlaylist = await db.playList.delete({
            where:{
                id:playlistId
            }
        })

        res.status(200).json({
            success:true,
            message:"Playlist deleted",
            deletedPlaylist
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success:false,
            error:"Failed to delete playlist"
        })
    }
}

export const removeProblemFromPlaylist = async(req, res) =>{
    const {playlistId} = req.params;
    const {problemIds} = req.body;

    try {
        if(!Array.isArray(problemIds) || problemIds.length===0){
            return res.status(422).json({
                error:"Invalid or missing problem"
            })
        }

        const deletedProblem = await db.problemInPlaylist.deleteMany({
            where:{
                playListId:playlistId,
                problemId:{in: problemIds}
            },
            
        })

        res.status(200).json({
            success:true,
            message:"Problem removed from playlist successfully",
            deletedProblem
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            error:"Failed in deleting problem from playlist"
        })
        
    }
}