import { exec } from "child_process";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { testFile } = await req.json();

    if (!testFile) {
      return NextResponse.json(
        { error: "Test file is required" },
        { status: 400 }
      );
    }

    // Paths relative to the Next.js project root
    // process.cwd() is the 'ui' folder, so '../' goes to 'q2' folder
    const projectRoot = path.join(process.cwd(), "..");
    const exeFile =
      process.platform === "win32" ? "closest_pair.exe" : "closest_pair";
    const exePath = path.join(projectRoot, exeFile);
    const testFilePath = path.join(
      projectRoot,
      "test_data",
      "closest_pair",
      testFile
    );

    // Check if exe exists
    if (!fs.existsSync(exePath)) {
      return NextResponse.json(
        {
          error: "Closest pair executable not found",
          path: exePath,
        },
        { status: 500 }
      );
    }

    // Check if test file exists
    if (!fs.existsSync(testFilePath)) {
      return NextResponse.json(
        {
          error: "Test file not found",
          path: testFilePath,
        },
        { status: 404 }
      );
    }

    // Execute C++ program
    const command = `"${exePath}" "${testFilePath}"`;
    let stdout, stderr;

    try {
      const result = await execPromise(command, { timeout: 30000 });
      stdout = result.stdout;
      stderr = result.stderr;
    } catch (execError: any) {
      return NextResponse.json(
        {
          error: "Failed to execute closest pair algorithm",
          details: execError.message,
          command: command,
        },
        { status: 500 }
      );
    }

    if (stderr && !stdout) {
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    // Parse output
    const lines = stdout
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 5) {
      return NextResponse.json(
        {
          error: "Unexpected output format from executable",
          output: stdout,
          details: "Expected at least 5 lines of output",
        },
        { status: 500 }
      );
    }

    // Expected format:
    // Closest Pair (n=100):
    // P1: (-697.955, 553.301)
    // P2: (-697.577, 558.027)
    // Distance: 4.74121
    // Time: 0.2915 ms
    // (Optional) TRACE_START
    // [trace json]
    // TRACE_END

    const nMatch = lines[0]?.match(/n=(\d+)/);
    const p1Match = lines[1]?.match(/P1: \(([^,]+), ([^)]+)\)/);
    const p2Match = lines[2]?.match(/P2: \(([^,]+), ([^)]+)\)/);
    const distMatch = lines[3]?.match(/Distance: ([\d.]+)/);
    const timeMatch = lines[4]?.match(/Time: ([\d.]+)/);

    if (!nMatch || !p1Match || !p2Match || !distMatch || !timeMatch) {
      return NextResponse.json(
        {
          error: "Failed to parse output",
          output: stdout,
        },
        { status: 500 }
      );
    }

    const numPoints = parseInt(nMatch[1]);

    // Parse trace if available (for n <= 50)
    let trace = null;
    const traceStartIdx = lines.findIndex((l) => l === "TRACE_START");
    const traceEndIdx = lines.findIndex((l) => l === "TRACE_END");

    if (
      traceStartIdx !== -1 &&
      traceEndIdx !== -1 &&
      traceEndIdx > traceStartIdx
    ) {
      try {
        const traceJson = lines.slice(traceStartIdx + 1, traceEndIdx).join("");
        trace = JSON.parse(traceJson);
      } catch (e) {
        console.error("Failed to parse trace JSON:", e);
        // Continue without trace
      }
    }

    // Read all points from input file
    const fileContent = fs.readFileSync(testFilePath, "utf-8");
    const fileLines = fileContent
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const n = parseInt(fileLines[0]);
    const allPoints = [];

    for (let i = 1; i <= n && i < fileLines.length; i++) {
      const [x, y] = fileLines[i].split(/\s+/).map(parseFloat);
      if (!isNaN(x) && !isNaN(y)) {
        allPoints.push({ x, y });
      }
    }

    return NextResponse.json({
      success: true,
      numPoints,
      allPoints,
      closestPair: {
        point1: { x: parseFloat(p1Match[1]), y: parseFloat(p1Match[2]) },
        point2: { x: parseFloat(p2Match[1]), y: parseFloat(p2Match[2]) },
        distance: parseFloat(distMatch[1]),
      },
      executionTime: parseFloat(timeMatch[1]),
      trace: trace || [],
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
