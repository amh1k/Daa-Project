/*
Team Members:
23k-0553 Abdul Moiz Hussain
23k-0782 Huzaifa Abdul Rehman
23k-0514 Ajay Kumar
*/

#include <bits/stdc++.h>
using namespace std;
int findPeak(vector<int> &arr, int start, int end)
{
    int mid = start + (end - start) / 2;
    if (mid == 0 && arr[mid] >= arr[mid + 1])
        return mid;
    if (mid == arr.size() - 1 && arr[mid] >= arr[mid - 1])
        return mid;
    if (arr[mid] >= arr[mid - 1] && arr[mid] >= arr[mid + 1])
        return mid;
    if (mid > 0 && arr[mid - 1] > arr[mid])
    {
        return findPeak(arr, start, mid - 1);
    }
    else
    {
        return findPeak(arr, mid + 1, end);
    }
}
int main()
{
    vector<int> arr = {1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1};
    int peakIndex = findPeak(arr, 0, arr.size() - 1);
    cout << "Peak element is " << arr[peakIndex] << " at index " << peakIndex << endl;
    cout << "\nRecurrence Relation: T(n) = T(n/2) + O(1)" << endl;
    cout << "Time Complexity: O(log n) - Binary search approach" << endl;
    cout << "The algorithm recursively searches only one half of the array" << endl;
    cout << "by comparing the middle element with its neighbors." << endl;
    return 0;
}