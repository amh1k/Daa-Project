

#include <bits/stdc++.h>
using namespace std;

long long mergeAndCount(vector<int> &arr, int left, int mid, int right)
{
    vector<int> temp(right - left + 1);
    long long crossInversions = 0;

    int j = mid + 1;
    for (int i = left; i <= mid; i++)
    {

        while (j <= right && arr[i] > 2 * arr[j])
        {
            j++;
        }

        crossInversions += (j - (mid + 1));
    }

    int i = left;
    j = mid + 1;
    int k = 0;

    while (i <= mid && j <= right)
    {
        if (arr[i] <= arr[j])
        {
            temp[k++] = arr[i++];
        }
        else
        {
            temp[k++] = arr[j++];
        }
    }

    while (i <= mid)
    {
        temp[k++] = arr[i++];
    }

    while (j <= right)
    {
        temp[k++] = arr[j++];
    }

    for (int i = left; i <= right; i++)
    {
        arr[i] = temp[i - left];
    }

    return crossInversions;
}

long long mergeSortAndCount(vector<int> &arr, int left, int right)
{
    long long inversionCount = 0;

    if (left < right)
    {
        int mid = left + (right - left) / 2;

        inversionCount += mergeSortAndCount(arr, left, mid);

        inversionCount += mergeSortAndCount(arr, mid + 1, right);

        inversionCount += mergeAndCount(arr, left, mid, right);
    }

    return inversionCount;
}

long long countSignificantInversions(vector<int> arr)
{
    int n = arr.size();
    return mergeSortAndCount(arr, 0, n - 1);
}

int main()
{
    cout << "=== Significant Inversions Counter ===" << endl;

    cout << "ALGORITHM COMPLEXITY ANALYSIS:" << endl;
    cout << "Recurrence Relation: T(n) = 2T(n/2) + O(n)" << endl;
    cout << "  - 2T(n/2): Two recursive calls on half-sized arrays" << endl;
    cout << "  - O(n): Counting cross inversions + merging" << endl;
    cout << "Time Complexity: O(n log n)" << endl;
    cout << "Space Complexity: O(n)" << endl;
    cout << endl;

    int n;
    cout << "Enter the number of elements: ";
    cin >> n;

    vector<int> arr(n);
    cout << "Enter " << n << " elements: ";
    for (int i = 0; i < n; i++)
    {
        cin >> arr[i];
    }

    vector<int> arrCopy = arr;

    cout << "\nOriginal array: ";
    for (int x : arr)
        cout << x << " ";
    cout << endl;

    long long result = countSignificantInversions(arrCopy);

    cout << "\nNumber of significant inversions: " << result << endl;

    return 0;
}


