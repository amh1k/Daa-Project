/*
 * Exercise 2: Counting Significant Inversions
 * Source: Algorithm Design, Jon Kleinberg, 1st Edition, Page 247
 *
 * Problem: Given a sequence of n numbers a1, a2, ..., an
 * Count the number of "significant inversions"
 * A pair (i, j) is a significant inversion if i < j and ai > 2*aj
 *
 * Algorithm: Modified Merge Sort - O(n log n)
 *
 * Key Idea:
 * - Use divide and conquer like merge sort
 * - Count inversions in left half, right half, and cross inversions
 * - For cross inversions: exploit the fact that both halves are sorted
 */

#include <bits/stdc++.h>
using namespace std;

// Function to merge two sorted halves and count cross significant inversions
long long mergeAndCount(vector<int> &arr, int left, int mid, int right)
{
    vector<int> temp(right - left + 1);
    long long crossInversions = 0;

    // STEP 1: Count cross significant inversions
    // For each element in left half, count elements in right half where arr[i] > 2*arr[j]
    int j = mid + 1;
    for (int i = left; i <= mid; i++)
    {
        // Find the position where arr[i] > 2*arr[j] stops being true
        // Since right half is sorted, all elements from (mid+1) to (j-1) satisfy the condition
        while (j <= right && arr[i] > 2 * arr[j])
        {
            j++;
        }
        // All elements from (mid+1) to (j-1) form significant inversions with arr[i]
        crossInversions += (j - (mid + 1));
    }

    // STEP 2: Merge the two sorted halves (standard merge sort merge)
    int i = left; // pointer for left half
    j = mid + 1;  // pointer for right half
    int k = 0;    // pointer for temp array

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

    // Copy remaining elements from left half
    while (i <= mid)
    {
        temp[k++] = arr[i++];
    }

    // Copy remaining elements from right half
    while (j <= right)
    {
        temp[k++] = arr[j++];
    }

    // Copy merged elements back to original array
    for (int i = left; i <= right; i++)
    {
        arr[i] = temp[i - left];
    }

    return crossInversions;
}

// Main divide and conquer function
long long mergeSortAndCount(vector<int> &arr, int left, int right)
{
    long long inversionCount = 0;

    if (left < right)
    {
        int mid = left + (right - left) / 2;

        // Count inversions in left half
        inversionCount += mergeSortAndCount(arr, left, mid);

        // Count inversions in right half
        inversionCount += mergeSortAndCount(arr, mid + 1, right);

        // Count cross inversions and merge
        inversionCount += mergeAndCount(arr, left, mid, right);
    }

    return inversionCount;
}

// Wrapper function
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

    // Make a copy for counting (since the algorithm modifies the array)
    vector<int> arrCopy = arr;

    cout << "\nOriginal array: ";
    for (int x : arr)
        cout << x << " ";
    cout << endl;

    // Count significant inversions
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
