// Q2 Part (i): Closest Pair of Points - Divide & Conquer O(n log n)
#include <iostream>
#include <fstream>
#include <vector>
#include <cmath>
#include <algorithm>
#include <limits>
#include <chrono>
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

Result bruteForce(vector<Point>& pts, int l, int r) {
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
    return res;
}

Result stripClosest(vector<Point>& strip, double d) {
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
    return res;
}

Result closestRec(vector<Point>& pX, vector<Point>& pY, int l, int r) {
    if (r - l <= 3) return bruteForce(pX, l, r);

    int mid = l + (r-l)/2;
    Point midPt = pX[mid];

    vector<Point> lY, rY;
    for (auto& p : pY) {
        if (p.x <= midPt.x && lY.size() < (size_t)(mid-l+1)) lY.push_back(p);
        else rY.push_back(p);
    }

    Result lRes = closestRec(pX, lY, l, mid);
    Result rRes = closestRec(pX, rY, mid+1, r);
    Result res = (lRes.d < rRes.d) ? lRes : rRes;

    vector<Point> strip;
    for (auto& p : pY)
        if (abs(p.x - midPt.x) < res.d) strip.push_back(p);

    Result stripRes = stripClosest(strip, res.d);
    return (stripRes.d < res.d) ? stripRes : res;
}

Result findClosestPair(vector<Point>& pts) {
    vector<Point> pX = pts, pY = pts;
    sort(pX.begin(), pX.end(), [](Point a, Point b){ return a.x < b.x; });
    sort(pY.begin(), pY.end(), [](Point a, Point b){ return a.y < b.y; });
    return closestRec(pX, pY, 0, pX.size()-1);
}

int main(int argc, char* argv[]) {
    string file = (argc > 1) ? argv[1] : "test_data/closest_pair/test_1_n100.txt";

    ifstream in(file);
    int n; in >> n;
    vector<Point> pts(n);
    for (int i = 0; i < n; i++) in >> pts[i].x >> pts[i].y;
    in.close();

    auto start = chrono::high_resolution_clock::now();
    Result res = findClosestPair(pts);
    auto end = chrono::high_resolution_clock::now();
    double time_ms = chrono::duration<double, milli>(end - start).count();

    cout << "Closest Pair (n=" << n << "):\n";
    cout << "P1: (" << res.p1.x << ", " << res.p1.y << ")\n";
    cout << "P2: (" << res.p2.x << ", " << res.p2.y << ")\n";
    cout << "Distance: " << res.d << "\n";
    cout << "Time: " << time_ms << " ms\n";

    ofstream out(file.substr(0, file.find_last_of('.')) + "_output.txt");
    out << "Points: " << n << "\nDistance: " << res.d << "\nTime: " << time_ms << " ms\n";
    out.close();

    return 0;
}
