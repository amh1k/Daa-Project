
#include <bits/stdc++.h>
using namespace std;

int merge(vector<int> &arr, int low, int mid, int high)
{
    vector<int> temp;
    int left = low;
    int right = mid + 1;

    int cnt = 0;

    while (left <= mid && right <= high)
    {
        if (arr[left] <= arr[right])
        {
            temp.push_back(arr[left]);
            left++;
        }
        else
        {
            temp.push_back(arr[right]);
            cnt += (mid - left + 1);
            right++;
        }
    }

    while (left <= mid)
    {
        temp.push_back(arr[left]);
        left++;
    }

    while (right <= high)
    {
        temp.push_back(arr[right]);
        right++;
    }

    for (int i = low; i <= high; i++)
    {
        arr[i] = temp[i - low];
    }

    return cnt;
}

int mergeSort(vector<int> &arr, int low, int high)
{
    int cnt = 0;
    if (low >= high)
        return cnt;
    int mid = (low + high) / 2;
    cnt += mergeSort(arr, low, mid);
    cnt += mergeSort(arr, mid + 1, high);

    cnt += merge(arr, low, mid, high);
    return cnt;
}

int noOfInversions(vector<int> &a, int n)
{

    return mergeSort(a, 0, n - 1);
}

int main()
{
    vector<int> a = {2, 3, 8, 6, 1, 3, 9, 1, 2, 10};
    int n = 10;
    int cnt = noOfInversions(a, n);
    cout << "The number of inversions are: "
         << cnt << endl;
    cout << "\nRecurrence Relation: T(n) = 2T(n/2) + O(n)" << endl;
    cout << "Time Complexity: O(n log n) - Same as merge sort" << endl;
    cout << "The algorithm counts inversions during the merge step by tracking" << endl;
    cout << "how many elements from the right half are smaller than left half elements." << endl;
    return 0;
}
