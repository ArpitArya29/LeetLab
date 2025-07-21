import React from "react";

const ShowCompileError = ({ givenInput, compileOutputRes }) => {
  const statusid = compileOutputRes.statusId;
  const compileErr = compileOutputRes.output;
  const runErr = compileOutputRes.stderr;
  
  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body p-4">
          <div className="text-lg font-bold text-error">
            {statusid==6?<h4>compilation error</h4> : <h4>Runtime error</h4>}
          </div>
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
              {statusid==6?(compileErr):runErr}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCompileError;
