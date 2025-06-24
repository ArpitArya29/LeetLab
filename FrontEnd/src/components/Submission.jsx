import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from "lucide-react";

const SubmissionResult = ({ submission }) => {
  console.log(submission);

  const memoryArr = JSON.parse(submission.memory || []);
  const timeArr = JSON.parse(submission.time || []);

  console.log(memoryArr);
  console.log(submission.testcases);

  const avgMemory =
    memoryArr.map((m) => parseFloat(m)).reduce((a, b) => a + b, 0) /
    memoryArr.length;

  const avrTime =
    timeArr.map((t) => parseFloat(t)).reduce((a, b) => a + b, 0) /
    timeArr.length;

  const passedTests = submission.testcases.filter((tc) => tc.passed).length;
  const totalTests = submission.testcases.length;
  const successRate = (passedTests / totalTests) * 100;

  return (
    <div className="space-y-6">
      {/* Overall status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Status</h3>
            <div
              className={`text-lg font-bold ${
                submission.status === "Accepted" ? "text-success" : "text-error"
              }`}
            >
              {submission.status}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Success Rate</h3>
            <div className="text-lg font-bold">{successRate.toFixed(1)}%</div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg. Runtime
            </h3>
            <div className="text-lg font-bold">{avrTime.toFixed(3)} s</div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Memory className="h-4 w-4" />
              Avg. Memory
            </h3>
            <div className="text-lg font-bold">{avgMemory.toFixed(0)} KB</div>
          </div>
        </div>
      </div>

      {/* TestCase Results */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Test Case Results</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Expected Output</th>
                  <th>Your Output</th>
                  <th>Memory</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {submission.testcases.map((tc) => (
                  <tr key={tc.testCase}>
                    <td>
                      {tc.passed ? (
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle2 className="w-5 h-5" />
                          Passed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-error">
                          <XCircle className="w-5 h-5" />
                          Failed
                        </div>
                      )}
                    </td>

                    <td className="font-mono">{tc.expected}</td>
                    <td className="font-mono">{tc.stdout || "null"}</td>
                    <td>{tc.memory}</td>
                    <td>{tc.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResult;
