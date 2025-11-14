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
      process.platform === "win32"
        ? "integer_multiplication.exe"
        : "integer_multiplication";
    const exePath = path.join(projectRoot, exeFile);
    const testFilePath = path.join(
      projectRoot,
      "test_data",
      "integer_multiplication",
      testFile
    );

    // Check if exe exists
    if (!fs.existsSync(exePath)) {
      return NextResponse.json(
        {
          error: "Integer multiplication executable not found",
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
      const result = await execPromise(command, { timeout: 60000 });
      stdout = result.stdout;
      stderr = result.stderr;
    } catch (execError: any) {
      return NextResponse.json(
        {
          error: "Failed to execute integer multiplication algorithm",
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

    if (lines.length < 4) {
      return NextResponse.json(
        {
          error: "Unexpected output format from executable",
          output: stdout,
          details: "Expected at least 4 lines of output",
        },
        { status: 500 }
      );
    }

    // Expected format:
    // Integer Multiplication (d1=100, d2=100):
    // Product length: 200 digits
    // Product: 479777...223113
    // Time: 8.5577 ms

    const digitsMatch = lines[0]?.match(/d1=(\d+), d2=(\d+)/);
    const lengthMatch = lines[1]?.match(/Product length: (\d+)/);
    const productMatch = lines[2]?.match(/Product: (.+)/);
    const timeMatch = lines[3]?.match(/Time: ([\d.]+)/);

    if (!digitsMatch || !lengthMatch || !productMatch || !timeMatch) {
      return NextResponse.json(
        {
          error: "Failed to parse output",
          output: stdout,
        },
        { status: 500 }
      );
    }

    // Read output file to get full product if needed
    const outputFilePath = testFilePath.replace(".txt", "_output.txt");
    let fullProduct = productMatch[1];

    if (fs.existsSync(outputFilePath)) {
      const outputContent = fs.readFileSync(outputFilePath, "utf-8");
      const resultMatch = outputContent.match(/Result: (.+)/);
      if (resultMatch) {
        fullProduct = resultMatch[1].trim();
      }
    }

    // Try to read tree JSON if it exists
    const treeFilePath = testFilePath.replace(".txt", "_tree.json");
    let tree = null;
    let treeDepth = 0;

    if (fs.existsSync(treeFilePath)) {
      try {
        const treeContent = fs.readFileSync(treeFilePath, "utf-8");
        tree = JSON.parse(treeContent);

        // Calculate max depth
        const getMaxDepth = (node: any): number => {
          if (!node.children || node.children.length === 0) return node.depth;
          return Math.max(...node.children.map(getMaxDepth));
        };
        treeDepth = getMaxDepth(tree);
      } catch (e) {
        // Tree parsing failed, continue without tree
        console.log("Tree parsing failed:", e);
      }
    }

    return NextResponse.json({
      success: true,
      num1Digits: parseInt(digitsMatch[1]),
      num2Digits: parseInt(digitsMatch[2]),
      productDigits: parseInt(lengthMatch[1]),
      product: fullProduct,
      executionTime: parseFloat(timeMatch[1]),
      tree: tree,
      treeDepth: treeDepth,
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
