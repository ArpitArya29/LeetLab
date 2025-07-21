import React, { useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  User,
  Mail,
  ShieldUser,
  Code,
  FolderOpen,
  Folder,
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  Loader,
  Home,
  ChevronRight,
} from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useEffect } from "react";
import CreatePlaylistModel from "../components/CreatePlaylistModel";
import ShowProblemsInPlayListModel from "../components/ShowProblemsInPlayListModel";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const {
    playlists,
    getAllPlaylist,
    createPlaylist,
    deletePlaylist,
    isLoading,
  } = usePlaylistStore();

  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [isShowPlaylistOpen, setIsShowPlaylistOpen] = useState(false);
  const [isPlaylistModelOpen, setIsPlaylistModelOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  const handleDeletePlaylist = async (id) => {
    await deletePlaylist(id);
  };

  const openPlaylistModel = (id) => {
    setSelectedPlaylist(id);

    setIsPlaylistModelOpen(true);
  };

  useEffect(() => {
    getAllPlaylist();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center mt-10 px-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-4xl p-8 space-y-8">
        <Link to={"/"} className="flex items-center text-primary">
          <Home className="w-6 h-6" />
          <ChevronRight className="w-6 h-6" />
        </Link>
        {/* Main Profile Section */}
        <div className="flex bg-base-200 rounded-xl shadow-xl p-4">
          <div className="w-50 rounded-full m-5">
            <img
              src={
                authUser?.image || "https://avatar.iran.liara.run/public/boy"
              }
              alt="User Avatar"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-5 w-full">
            <div className="card bg-base-300 shadow-lg flex flex-row">
              <div className="card-body p-4">
                <h3 className="card-title text-m">Username</h3>
                <div className="text-lg font-bold">{authUser.name}</div>
              </div>

              <div className="card-body p-4 justify-center">
                <User className="w-10 h-10" />
              </div>
            </div>

            <div className="card bg-base-300 shadow-lg flex flex-row">
              <div className="card-body p-4">
                <h3 className="card-title text-m">Email</h3>
                <div className="text-lg font-bold">{authUser.email}</div>
              </div>
              <div className="card-body p-4 justify-center">
                <Mail className="w-10 h-10" />
              </div>
            </div>

            <div className="card bg-base-300 shadow-lg flex flex-row ">
              <div className="card-body p-4">
                <h3 className="card-title text-xm">Role</h3>
                <div className="text-lg font-bold">{authUser.role}</div>
              </div>
              <div className="card-body p-4 justify-center">
                {authUser.role === "ADMIN" ? (
                  <ShieldUser className="h-10 w-10" />
                ) : (
                  <Code className="h-10 w-10" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-base-200 rounded-xl shadow-xl p-4">
          <div className="flex justify-between p-2">
            <button
              onClick={() => setIsShowPlaylistOpen((prev) => !prev)}
              className="flex"
            >
              {isShowPlaylistOpen ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
              <h3 className="card-title text-xl font-bold">
                PlayLists <FolderOpen className="h-6 w-6" />
              </h3>
            </button>

            <button
              className="btn btn-primary gap-2"
              onClick={() => {
                setIsCreateModelOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Create PlayList
            </button>
          </div>

          <div className="card bg-base-300 shadow-lg w-full mt-4">
            <div className="grid grid-cols-1 gap-4 p-4 w-full">
              {isShowPlaylistOpen &&
                playlists.map((playlist) => (
                  <div
                    key={playlist?.id}
                    className="card bg-base-200 shadow-md p-4 flex flex-row justify-between"
                  >
                    <h3
                      className="text-lg font-bold flex hover:underline cursor-pointer"
                      onClick={() => {
                        openPlaylistModel(playlist.id);
                      }}
                    >
                      <Folder className="w-5 h-5 mr-2" />
                      {playlist?.name}
                    </h3>

                    <button
                      className="btn btn-error"
                      onClick={() => handleDeletePlaylist(playlist.id)}
                    >
                      {isLoading ? (
                        <Loader className="animate-spin w-5 h-5 text-blue-500" />
                      ) : (
                        <>
                          <Trash2 className="w-6 h-6" />
                          Delete Playlist
                        </>
                      )}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <CreatePlaylistModel
        isOpen={isCreateModelOpen}
        onClose={() => setIsCreateModelOpen(false)}
        onSubmit={handleCreatePlaylist}
      />

      {selectedPlaylist && (
        <ShowProblemsInPlayListModel
          isOpen={isPlaylistModelOpen}
          onClose={() => setIsPlaylistModelOpen(false)}
          playlistId={selectedPlaylist}
        />
      )}
    </div>
  );
};

export default ProfilePage;
