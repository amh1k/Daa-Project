
/*
Team Members:
23k-0553 Abdul Moiz Hussain
23k-0782 Huzaifa Abdul Rehman
23k-0514 Ajay Kumar
*/

#include <iostream>
#include <vector>
using namespace std;

pair<int, int> findMinMax(const vector<int> &arr, int low, int high)
{

    if (low == high)
    {
        return {arr[low], arr[low]};
    }

    if (high == low + 1)
    {
        if (arr[low] < arr[high])
            return {arr[low], arr[high]};
        else
            return {arr[high], arr[low]};
    }

    int mid = (low + high) / 2;
    pair<int, int> left = findMinMax(arr, low, mid);
    pair<int, int> right = findMinMax(arr, mid + 1, high);

    int overallMin = (left.first < right.first) ? left.first : right.first;
    int overallMax = (left.second > right.second) ? left.second : right.second;

    return {overallMin, overallMax};
}

int main()
{
    vector<int> arr = {7, 2, 9, 1, 5, 11, 4, 3, 8, 6};

    pair<int, int> result = findMinMax(arr, 0, arr.size() - 1);

    cout << "Minimum element: " << result.first << endl;
    cout << "Maximum element: " << result.second << endl;
    cout << "Recurrence: T(n) = 2T(n/2) + 2 ⇒ T(n) = (3n/2) − 2." << endl;
    cout << "It performs about 25% fewer comparisons than the bruteforce (2n − 2) algorithm." << endl;
    return 0;
}
