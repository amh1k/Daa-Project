import { exec } from "child_process";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { fileContent } = await req.json();

    if (!fileContent) {
      return NextResponse.json(
        { error: "File content is required" },
        { status: 400 }
      );
    }

    const projectRoot = path.join(process.cwd(), "..");
    const exeFile =
      process.platform === "win32"
        ? "integer_multiplication.exe"
        : "integer_multiplication";
    const exePath = path.join(projectRoot, exeFile);

    // Create a temporary file for the custom input
    const tempFileName = `custom_${Date.now()}.txt`;
    const tempFilePath = path.join(
      projectRoot,
      "test_data",
      "integer_multiplication",
      tempFileName
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

    // Write content to temporary file
    fs.writeFileSync(tempFilePath, fileContent);

    try {
      // Execute C++ program
      const command = `"${exePath}" "${tempFilePath}"`;
      let stdout, stderr;

      try {
        const result = await execPromise(command, { timeout: 60000 });
        stdout = result.stdout;
        stderr = result.stderr;
      } catch (execError: any) {
        // Clean up temp file
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
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
        // Clean up temp file
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        return NextResponse.json({ error: stderr }, { status: 500 });
      }

      // Parse output
      const lines = stdout
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length < 4) {
        // Clean up temp file
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        return NextResponse.json(
          {
            error: "Unexpected output format from executable",
            output: stdout,
            details: "Expected at least 4 lines of output",
          },
          { status: 500 }
        );
      }

      const digitsMatch = lines[0]?.match(/d1=(\d+), d2=(\d+)/);
      const lengthMatch = lines[1]?.match(/Product length: (\d+)/);
      const productMatch = lines[2]?.match(/Product: (.+)/);
      const timeMatch = lines[3]?.match(/Time: ([\d.]+)/);

      if (!digitsMatch || !lengthMatch || !productMatch || !timeMatch) {
        // Clean up temp file
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        return NextResponse.json(
          {
            error: "Failed to parse output",
            output: stdout,
          },
          { status: 500 }
        );
      }

      // Read output file to get full product if needed
      const outputFilePath = tempFilePath.replace(".txt", "_output.txt");
      let fullProduct = productMatch[1];

      if (fs.existsSync(outputFilePath)) {
        const outputContent = fs.readFileSync(outputFilePath, "utf-8");
        const resultMatch = outputContent.match(/Result: (.+)/);
        if (resultMatch) {
          fullProduct = resultMatch[1].trim();
        }
        // Clean up output file
        fs.unlinkSync(outputFilePath);
      }

      // Try to read tree JSON if it exists
      const treeFilePath = tempFilePath.replace(".txt", "_tree.json");
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

          // Clean up tree file
          fs.unlinkSync(treeFilePath);
        } catch (e) {
          console.log("Tree parsing failed:", e);
        }
      }

      // Clean up temp file
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

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
      // Clean up temp file on error
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      throw error;
    }
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
