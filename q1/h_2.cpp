

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
    cout << "A pair (i,j) is a significant inversion if i < j and arr[i] > 2*arr[j]" << endl;
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

/*`
 * TIME COMPLEXITY ANALYSIS:
 *
 * Recurrence Relation: T(n) = 2T(n/2) + O(n)
 * - 2T(n/2): Two recursive calls on half-sized arraysp
 * - O(n): Counting cross inversions + merging
 *
 * Solution: T(n) = O(n log n) by Master Theorem
 *
 * SPACE COMPLEXITY: O(n) for temporary arrays during merging
 *
 *
 * TEST CASES:
 *
 * Test 1: [8, 4, 2, 1]
 * Expected: 3 inversions
 * - (0,2): 8 > 2*2=4
 * - (0,3): 8 > 2*1=2
 * - (1,3): 4 > 2*1=2
 *
 * Test 2: [10, 5, 2, 1]
 * Expected: 5 inversions
 * - (0,1): 10 > 2*5=10? No (equal)
 * - (0,2): 10 > 2*2=4? Yes
 * - (0,3): 10 > 2*1=2? Yes
 * - (1,2): 5 > 2*2=4? Yes
 * - (1,3): 5 > 2*1=2? Yes
 * - (2,3): 2 > 2*1=2? No
 * Total: 4 inversions
 *
 * Test 3: [1, 2, 3, 4, 5]
 * Expected: 0 inversions (sorted ascending)
 *
 * Test 4: [5, 4, 3, 2, 1]
 * Expected: Multiple inversions (sorted descending)
 */
