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
    return 0;
}