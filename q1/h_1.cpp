#include <bits/stdc++.h>
using namespace std;

int findMedian(vector<int> &A, vector<int> &B, int n)
{
    int low = 0, high = n;
    while (low <= high)
    {
        int i = (low + high) / 2;
        int j = n - i;

        int A_left = (i == 0) ? INT_MIN : A[i - 1];
        int A_right = (i == n) ? INT_MAX : A[i];
        int B_left = (j == 0) ? INT_MIN : B[j - 1];
        int B_right = (j == n) ? INT_MAX : B[j];

        if (A_left <= B_right && B_left <= A_right)
            return max(A_left, B_left);
        else if (A_left > B_right)
            high = i - 1;
        else
            low = i + 1;
    }
    return -1;
}

int main()
{
    vector<int> A = {3, 8, 15, 17, 20, 25, 30, 35, 40, 45};
    vector<int> B = {1, 4, 7, 10, 12, 18, 22, 28, 33, 50};

    int n = A.size();

    sort(A.begin(), A.end());
    sort(B.begin(), B.end());

    cout << findMedian(A, B, n) << endl;
    return 0;
}
