import React, { useState } from "react";
import * as XLSX from "xlsx";

interface Job {
  [key: string]: any;
}

const getColumnIndex = (header: string[], col: string) => {
  // Convert column letter (A-K) to index
  return col.charCodeAt(0) - "A".charCodeAt(0);
};

const parseJobs = (sheet: XLSX.WorkSheet): Job[] => {
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  if (rows.length < 2) return [];
  const jobs: Job[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const job: Job = {};
    // Store columns from A to K (0-10)
    for (let col = 0; col <= 10; col++) {
      job[String.fromCharCode("A".charCodeAt(0) + col)] = row[col] ?? "";
    }
    jobs.push(job);
  }
  return jobs;
};

const findProblemChild = (jobs: Job[]) => {
  const installerCount: Record<string, number> = {};
  jobs.forEach((job) => {
    const installer = job["C"];
    if (installer) {
      installerCount[installer] = (installerCount[installer] || 0) + 1;
    }
  });
  // Find installer with most jobs
  let maxInstaller = "";
  let maxCount = 0;
  for (const [installer, count] of Object.entries(installerCount)) {
    if (count > maxCount) {
      maxInstaller = installer;
      maxCount = count;
    }
  }
  return { installer: maxInstaller, count: maxCount };
};

const countCustomerSatisfaction = (jobs: Job[]) => {
  let count = 0;
  jobs.forEach((job) => {
    if (
      typeof job["F"] === "string" &&
      job["F"].toLowerCase().includes("customer satisfaction")
    ) {
      count++;
    }
  });
  return count;
};

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [problemChild, setProblemChild] = useState<{ installer: string; count: number } | null>(null);
  const [customerSatisfactionCount, setCustomerSatisfactionCount] = useState<number>(0);
  const [driverName, setDriverName] = useState<string>("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (typeof data !== "string" && !(data instanceof ArrayBuffer)) return;
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const parsedJobs = parseJobs(sheet);
      setJobs(parsedJobs);

      const problem = findProblemChild(parsedJobs);
      setProblemChild(problem);

      const driver = parsedJobs.length > 0 ? parsedJobs[0]["C"] : "";
      setDriverName(driver);

      setCustomerSatisfactionCount(countCustomerSatisfaction(parsedJobs));
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "Segoe UI, sans-serif" }}>
      <h1>Installer Problem Child Analyzer</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
        style={{ marginBottom: 20 }}
      />
      {jobs.length > 0 && (
        <div>
          <h2>Problem Child</h2>
          <p>
            <strong>Installer with most issues:</strong> {problemChild?.installer || "N/A"}<br />
            <strong>Number of jobs:</strong> {problemChild?.count || 0}
          </p>
          <p>
            <strong>Driver Name (box C of first job):</strong> {driverName || "N/A"}
          </p>
          <p>
            <strong># of times "Customer Satisfaction" appears in box F:</strong> {customerSatisfactionCount}
          </p>
          <h2>All Jobs</h2>
          <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {[..."ABCDEFGHIJK"].map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, i) => (
                <tr key={i}>
                  {[..."ABCDEFGHIJK"].map((col) => (
                    <td key={col}>{job[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {jobs.length === 0 && (
        <p style={{ color: "#888" }}>Please upload an .xlsx file to analyze installer issues.</p>
      )}
      <footer style={{ marginTop: 50, color: "#888", fontSize: 12 }}>
        &copy; {new Date().getFullYear()} Problem Child Analyzer for Installers
      </footer>
    </div>
  );
};

export default App;