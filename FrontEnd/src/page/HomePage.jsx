import React, { useEffect } from "react";

import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";

import ProblemTable from "../components/ProblemTable";

const HomePage = () => {
  const { problems, getAllProblems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center mt-14 px-4">
      {/* Blur effect */}
      <div className="absolute top-16 left-0 w-1/3 h-1/3 bg-primary opacity-30 blur-3xl rounded-md bottom-9"></div>

      <h1 className="text-4xl font-extrabold z-10 text-center">
        Welcome to <span className="text-primary">leetLab</span>🐦‍🔥
      </h1>
      <p className="mt-4 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10">
        A code ecexution platform inspired by{" "}
        <span className="text-blue-800">LeetCode</span> helping you to prepare
        for enhancing your problem solving
      </p>

      {problems.length > 0 ? (
        <ProblemTable  problems={problems}/>
      ) : (
        <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-4 rounded-md border-dashed">
          No Problems Found
        </p>
      )}
    </div>
  );
};

export default HomePage;
