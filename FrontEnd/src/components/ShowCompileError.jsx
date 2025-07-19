import React from "react";

const ShowCompileError = ({ givenInput, compileOutput }) => {
  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body p-4">
          <div className="text-lg font-bold text-error">Compilation Error</div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-lg">
        <div className="card-body p-4">
          <h3 className="card-title text-sm">Input:</h3>
          <div className="text-lg font-medium">{givenInput}</div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-lg">
        <div className="card-body p-4">
          <h3 className="card-title text-sm">Error:</h3>
          <div className="text-lg font-medium text-error">
            <pre className="whitespace-pre-wrap break-words text-sm">
              {compileOutput}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCompileError;
