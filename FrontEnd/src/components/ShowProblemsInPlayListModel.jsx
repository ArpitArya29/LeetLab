import React, { useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";

const ShowProblemsInPlayListModel = ({ isOpen, onClose, playlistId }) => {
  const { currentPlaylist, getPlaylistDetail, removeProblemFromPlaylist } =
    usePlaylistStore();

  useEffect(() => {
    getPlaylistDetail(playlistId);
  }, [playlistId]);

  const problems = currentPlaylist?.problems;

  const handleRemoveProblem = (problemId) =>{
    removeProblemFromPlaylist(currentPlaylist.id, [problemId]);
  }

  if (!isOpen || !problems) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h3 className="text-xl font-bold">{currentPlaylist.name}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-md p-4">
          <table className="table table-zebra table-lg bg-base-200 text-base-content">
            <thead className="bg-base-200">
              <tr>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {problems.length > 0 ? (
                problems.map((prob) => {
                  const problem = prob.problem;

                  return (
                    <tr key={problem.id}>
                      <td>
                        <Link
                          to={`/problem/${problem.id}`}
                          className="font-semibold hover:underline"
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td>
                        <span
                          className={`badge font-semibold text-xs text-white 
                          ${
                            problem.difficulty === "EASY"
                              ? "badge-success"
                              : problem.difficulty === "MEDIUM"
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            handleRemoveProblem(problem.id);
                          }}
                          className="btn"
                        >
                          <Trash2 className="w-4 h-4 text-error" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No Problems Found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button type="button" onClick={onClose} className="btn btn-ghost m-2">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ShowProblemsInPlayListModel;
