/*
------------------------------------------------------------
CS302 - Design and Analysis of Algorithms
Project Part 1 (e)
Exercise 5.5 (1): Closest Pair Problem (1D)
-------------------------------------------------------------
*/

#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <climits>
using namespace std;

// Function to find minimum distance in sorted array using divide & conquer
double closestPairUtil(const vector<double>& arr, int low, int high) {
    // Base cases
    if (high - low == 1)
        return fabs(arr[high] - arr[low]);
    if (high - low == 2) {
        double d1 = fabs(arr[low + 1] - arr[low]);
        double d2 = fabs(arr[high] - arr[low + 1]);
        double d3 = fabs(arr[high] - arr[low]);
        return min(d1, min(d2, d3));
    }

    // Divide
    int mid = (low + high) / 2;

    // Conquer (recursively find in left and right halves)
    double leftMin = closestPairUtil(arr, low, mid);
    double rightMin = closestPairUtil(arr, mid + 1, high);

    // Combine (check across boundary)
    double crossMin = fabs(arr[mid + 1] - arr[mid]);

    return min({leftMin, rightMin, crossMin});
}

int main() {
    vector<double> arr = {4.5, 1.2, 9.8, 3.1, 5.0, 2.8, 7.6, 6.2};

    // Step 1: Sort the array first
    sort(arr.begin(), arr.end());

    // Step 2: Apply divide & conquer
    double minDistance = closestPairUtil(arr, 0, arr.size() - 1);

    cout << "Closest distance between any two numbers: " << minDistance << endl;

    return 0;
}

/*
------------------------------------------------------------
Sample Output:
Closest distance between any two numbers: 0.3
------------------------------------------------------------
*/
