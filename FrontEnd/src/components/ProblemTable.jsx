import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

import {
  Bookmark,
  PencilIcon,
  Trash,
  TrashIcon,
  Plus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const ProblemTable = ({ problems }) => {
  const { authUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedtag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];

    const tagSet = new Set();

    problems.forEach((p) => {
      p.tags?.forEach((t) => tagSet.add(t));
    });

    return Array.from(tagSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty.includes(difficulty)
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  // pagination logic variables
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => {
    console.log(id, " Problem deleted");
  };

  const handleSaveToPlaylist = (id) => {
    console.log(id, " Problem saved to playlist");
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10">
      {/* Create Playlist section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Problems</h2>
        <button className="btn btn-primary gap-2" onClick={() => {}}>
          <Plus className="w-4 h-4" />
          Create PlayList
        </button>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by title"
          className="input input-bordered w-full md:w-1/3 bg-base-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select select-bordered bg-base-200"
          value={difficulty}
          onChange={(e) =>
            setDifficulty(
              e.target.value === "All Difficulties" ? "ALL" : e.target.value
            )
          }
        >
          <option>All Difficulties</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered bg-base-200"
          value={selectedTag}
          onChange={(e) =>
            setSelectedtag(
              e.target.value === "All Tags" ? "ALL" : e.target.value
            )
          }
        >
          <option>All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="table table-zebra table-lg bg-base-200 text-base-content">
          <thead className="bg-base-200">
            <tr>
              <th>Solved</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const isSolved = problem.solvedBy.some(
                  (user) => user.userId === authUser?.id
                );
                return (
                  <tr key={problem.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSolved}
                        readOnly
                        className="checkbox checkbox-sm"
                      />
                    </td>
                    <td>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-semibold hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(problem.tags || []).map((tag, idx) => (
                          // <span
                          //   key={idx}
                          //   className="badge badge-outline badge-accent text-xs font-bold"
                          // >
                          //   {tag}
                          // </span>
                          <span class="badge text-white bg-gradient-to-r from-purple-600 to-indigo-800">
                            {tag}
                          </span>
                        ))}
                      </div>
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
                      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                        {authUser?.role === "ADMIN" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(problem.id)}
                              className="btn btn-sm btn-error"
                            >
                              <TrashIcon className="w-4 h-4 text-white" />
                            </button>
                            <button disabled className="btn btn-sm btn-warning">
                              <PencilIcon className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}
                        <button
                          className="btn btn-sm btn-outline flex gap-2 items-center"
                          onClick={() => handleSaveToPlaylist(problem.id)}
                        >
                          <Bookmark className="w-4 h-4 " />
                          <span className="hidden sm:inline">
                            Save to Playlist
                          </span>
                        </button>
                      </div>
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

      {/* Pagination Logic */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <ArrowLeft className="w-4 h-4" /> Prev
        </button>

        <span className="btn btn-ghost btn-sm">
          {currentPage} / {totalPages}
        </span>

        <button
          className="btn btn-sm"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProblemTable;
