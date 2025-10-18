#include <bits/stdc++.h>
using namespace std;

vector<int> A, B;

int getA(int k) { return A[k - 1]; } // 1-indexed
int getB(int k) { return B[k - 1]; } // 1-indexed

int findMedian(int n)
{
    int low = 0, high = n;

    while (low <= high)
    {
        int i = (low + high) / 2; // number of elements taken from A
        int j = n - i;            // number from B

        // Handle boundaries carefully
        int A_left = (i == 0) ? INT_MIN : getA(i);
        int A_right = (i == n) ? INT_MAX : getA(i + 1);
        int B_left = (j == 0) ? INT_MIN : getB(j);
        int B_right = (j == n) ? INT_MAX : getB(j + 1);

        // Check if we found the correct partition
        if (A_left <= B_right && B_left <= A_right)
        {
            return max(A_left, B_left); // n-th smallest (median)
        }
        // Move partition in A left
        else if (A_left > B_right)
        {
            high = i - 1;
        }
        // Move partition in A right
        else
        {
            low = i + 1;
        }
    }

    return -1; // should never reach here if inputs are valid
}

int main()
{
    int n;
    cin >> n;

    A.resize(n);
    B.resize(n);

    for (int i = 0; i < n; i++)
        cin >> A[i];
    for (int i = 0; i < n; i++)
        cin >> B[i];

    sort(A.begin(), A.end());
    sort(B.begin(), B.end());

    cout << "Median (n-th smallest value) = " << findMedian(n) << endl;

    return 0;
}
