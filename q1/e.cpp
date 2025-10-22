/*
Team Members:
23k-0553 Abdul Moiz Hussain
23k-0782 Huzaifa Abdul Rehman
23k-0514 Ajay Kumar
*/

#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <climits>
using namespace std;

double closestPairUtil(const vector<double> &arr, int low, int high)
{
    if (high - low == 1)
        return fabs(arr[high] - arr[low]);
    if (high - low == 2)
    {
        double d1 = fabs(arr[low + 1] - arr[low]);
        double d2 = fabs(arr[high] - arr[low + 1]);
        double d3 = fabs(arr[high] - arr[low]);
        return min(d1, min(d2, d3));
    }

    int mid = (low + high) / 2;

    double leftMin = closestPairUtil(arr, low, mid);
    double rightMin = closestPairUtil(arr, mid + 1, high);

    double crossMin = fabs(arr[mid + 1] - arr[mid]);

    return min({leftMin, rightMin, crossMin});
}

int main()
{
    vector<double> arr = {4.5, 1.2, 9.8, 3.1, 5.0, 2.8, 7.6, 6.2, 9.9, 10.0};

    sort(arr.begin(), arr.end());

    double minDistance = closestPairUtil(arr, 0, arr.size() - 1);

    cout << "Closest distance between any two numbers: " << minDistance << endl;
    cout << "\nRecurrence Relation: T(n) = 2T(n/2) + O(1)" << endl;
    cout << "Time Complexity: O(n log n) - O(n log n) for sorting + O(n) for divide-and-conquer" << endl;
    cout << "The algorithm divides the sorted array and checks the minimum distance" << endl;
    cout << "in left half, right half, and across the boundary (adjacent elements)." << endl;

    return 0;
}
