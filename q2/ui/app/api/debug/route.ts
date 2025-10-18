import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

export async function GET() {
  const projectRoot = path.join(process.cwd(), '..')

  const closestPairExe = path.join(projectRoot, 'closest_pair.exe')
  const intMultExe = path.join(projectRoot, 'integer_multiplication.exe')
  const testDataDir = path.join(projectRoot, 'test_data')

  const closestPairTestFile = path.join(testDataDir, 'closest_pair', 'test_1_n100.txt')
  const intMultTestFile = path.join(testDataDir, 'integer_multiplication', 'test_1_d100.txt')

  return NextResponse.json({
    cwd: process.cwd(),
    projectRoot,
    paths: {
      closestPairExe: {
        path: closestPairExe,
        exists: fs.existsSync(closestPairExe)
      },
      intMultExe: {
        path: intMultExe,
        exists: fs.existsSync(intMultExe)
      },
      testDataDir: {
        path: testDataDir,
        exists: fs.existsSync(testDataDir)
      },
      closestPairTestFile: {
        path: closestPairTestFile,
        exists: fs.existsSync(closestPairTestFile)
      },
      intMultTestFile: {
        path: intMultTestFile,
        exists: fs.existsSync(intMultTestFile)
      }
    }
  })
}
