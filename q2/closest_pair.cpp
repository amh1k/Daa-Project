// Q2 Part (i): Closest Pair of Points - Divide & Conquer O(n log n)
#include <iostream>
#include <fstream>
#include <vector>
#include <cmath>
#include <algorithm>
#include <limits>
#include <chrono>
#include <sstream>
#include <iomanip>
using namespace std;

struct Point {
    double x, y;
};

double dist(const Point& p1, const Point& p2) {
    return sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));
}

struct Result {
    Point p1, p2;
    double d;
    Result() : d(numeric_limits<double>::max()) {}
};

// Trace structure for visualization
struct TraceStep {
    string type; // "divide", "base_case", "left_recurse", "right_recurse", "strip_check", "merge"
    int depth;
    double divideX;
    vector<Point> points;
    Result currentBest;
    vector<Point> stripPoints;
    double stripWidth;

    string toJSON() const {
        stringstream ss;
        ss << fixed << setprecision(2);
        ss << "{";
        ss << "\"type\":\"" << type << "\",";
        ss << "\"depth\":" << depth << ",";
        ss << "\"divideX\":" << divideX << ",";
        ss << "\"points\":[";
        for (size_t i = 0; i < points.size(); i++) {
            ss << "{\"x\":" << points[i].x << ",\"y\":" << points[i].y << "}";
            if (i < points.size() - 1) ss << ",";
        }
        ss << "],";
        ss << "\"currentBest\":{";
        ss << "\"p1\":{\"x\":" << currentBest.p1.x << ",\"y\":" << currentBest.p1.y << "},";
        ss << "\"p2\":{\"x\":" << currentBest.p2.x << ",\"y\":" << currentBest.p2.y << "},";
        ss << "\"distance\":" << currentBest.d;
        ss << "},";
        ss << "\"stripPoints\":[";
        for (size_t i = 0; i < stripPoints.size(); i++) {
            ss << "{\"x\":" << stripPoints[i].x << ",\"y\":" << stripPoints[i].y << "}";
            if (i < stripPoints.size() - 1) ss << ",";
        }
        ss << "],";
        ss << "\"stripWidth\":" << stripWidth;
        ss << "}";
        return ss.str();
    }
};

vector<TraceStep> trace;

Result bruteForce(vector<Point>& pts, int l, int r, int depth, bool enableTrace) {
    Result res;
    for (int i = l; i < r; i++)
        for (int j = i+1; j <= r; j++) {
            double d = dist(pts[i], pts[j]);
            if (d < res.d) {
                res.d = d;
                res.p1 = pts[i];
                res.p2 = pts[j];
            }
        }

    if (enableTrace) {
        TraceStep step;
        step.type = "base_case";
        step.depth = depth;
        step.divideX = 0;
        for (int i = l; i <= r; i++) step.points.push_back(pts[i]);
        step.currentBest = res;
        step.stripWidth = 0;
        trace.push_back(step);
    }

    return res;
}

Result stripClosest(vector<Point>& strip, double d, int depth, bool enableTrace) {
    Result res;
    res.d = d;
    sort(strip.begin(), strip.end(), [](Point a, Point b){ return a.y < b.y; });

    for (size_t i = 0; i < strip.size(); i++)
        for (size_t j = i+1; j < strip.size() && strip[j].y - strip[i].y < res.d; j++) {
            double dist_ij = dist(strip[i], strip[j]);
            if (dist_ij < res.d) {
                res.d = dist_ij;
                res.p1 = strip[i];
                res.p2 = strip[j];
            }
        }

    if (enableTrace && !strip.empty()) {
        TraceStep step;
        step.type = "strip_check";
        step.depth = depth;
        step.divideX = 0;
        step.currentBest = res;
        step.stripPoints = strip;
        step.stripWidth = 2 * d;
        trace.push_back(step);
    }

    return res;
}

Result closestRec(vector<Point>& pX, vector<Point>& pY, int l, int r, int depth, bool enableTrace) {
    // Use brute force for 3 or fewer points
    if (r - l <= 2) return bruteForce(pX, l, r, depth, enableTrace);

    int mid = l + (r-l)/2;
    Point midPt = pX[mid];

    // Trace divide step
    if (enableTrace) {
        TraceStep step;
        step.type = "divide";
        step.depth = depth;
        step.divideX = midPt.x;
        for (int i = l; i <= r; i++) step.points.push_back(pX[i]);
        step.currentBest = Result();
        step.stripWidth = 0;
        trace.push_back(step);
    }

    // Partition pY into left and right based on midpoint
    vector<Point> lY, rY;
    for (auto& p : pY) {
        if (p.x <= midPt.x) {
            lY.push_back(p);
        } else {
            rY.push_back(p);
        }
    }

    // Trace left recursion
    if (enableTrace) {
        TraceStep step;
        step.type = "left_recurse";
        step.depth = depth;
        step.divideX = midPt.x;
        for (int i = l; i <= mid; i++) step.points.push_back(pX[i]);
        step.currentBest = Result();
        step.stripWidth = 0;
        trace.push_back(step);
    }

    Result lRes = closestRec(pX, lY, l, mid, depth + 1, enableTrace);

    // Trace right recursion
    if (enableTrace) {
        TraceStep step;
        step.type = "right_recurse";
        step.depth = depth;
        step.divideX = midPt.x;
        for (int i = mid + 1; i <= r; i++) step.points.push_back(pX[i]);
        step.currentBest = Result();
        step.stripWidth = 0;
        trace.push_back(step);
    }

    Result rRes = closestRec(pX, rY, mid+1, r, depth + 1, enableTrace);
    Result res = (lRes.d < rRes.d) ? lRes : rRes;

    // Build strip from current Y-sorted subarray only (not all points)
    // Only include points within distance res.d from the dividing line
    vector<Point> strip;
    for (auto& p : pY) {
        if (abs(p.x - midPt.x) < res.d) {
            strip.push_back(p);
        }
    }

    Result stripRes = stripClosest(strip, res.d, depth, enableTrace);
    Result finalRes = (stripRes.d < res.d) ? stripRes : res;

    // Trace merge step
    if (enableTrace) {
        TraceStep step;
        step.type = "merge";
        step.depth = depth;
        step.divideX = midPt.x;
        for (int i = l; i <= r; i++) step.points.push_back(pX[i]);
        step.currentBest = finalRes;
        step.stripWidth = 0;
        trace.push_back(step);
    }

    return finalRes;
}

Result findClosestPair(vector<Point>& pts, bool enableTrace = false) {
    vector<Point> pX = pts, pY = pts;
    sort(pX.begin(), pX.end(), [](Point a, Point b){ return a.x < b.x; });
    sort(pY.begin(), pY.end(), [](Point a, Point b){ return a.y < b.y; });
    return closestRec(pX, pY, 0, pX.size()-1, 0, enableTrace);
}

int main(int argc, char* argv[]) {
    string file = (argc > 1) ? argv[1] : "test_data/closest_pair/test_1_n100.txt";

    ifstream in(file);
    int n; in >> n;
    vector<Point> pts(n);
    for (int i = 0; i < n; i++) in >> pts[i].x >> pts[i].y;
    in.close();

    // Enable trace only for n <= 50
    bool enableTrace = (n <= 50);
    trace.clear();

    auto start = chrono::high_resolution_clock::now();
    Result res = findClosestPair(pts, enableTrace);
    auto end = chrono::high_resolution_clock::now();
    double time_ms = chrono::duration<double, milli>(end - start).count();

    cout << "Closest Pair (n=" << n << "):\n";
    cout << "P1: (" << res.p1.x << ", " << res.p1.y << ")\n";
    cout << "P2: (" << res.p2.x << ", " << res.p2.y << ")\n";
    cout << "Distance: " << res.d << "\n";
    cout << "Time: " << time_ms << " ms\n";

    // Output trace as JSON if enabled
    if (enableTrace && !trace.empty()) {
        cout << "TRACE_START\n";
        cout << "[";
        for (size_t i = 0; i < trace.size(); i++) {
            cout << trace[i].toJSON();
            if (i < trace.size() - 1) cout << ",";
        }
        cout << "]\n";
        cout << "TRACE_END\n";
    }

    ofstream out(file.substr(0, file.find_last_of('.')) + "_output.txt");
    out << "Points: " << n << "\nDistance: " << res.d << "\nTime: " << time_ms << " ms\n";
    out.close();

    return 0;
}
