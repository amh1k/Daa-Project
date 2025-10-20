#include <bits/stdc++.h>
using namespace std;

int maxCrossSum(vector<int> &arr, int start, int mid, int end)
{
    int leftSum = INT_MIN;
    int sum = 0;

    for (int i = mid; i >= start; i--)
    {
        sum += arr[i];
        leftSum = max(leftSum, sum);
    }

    int rightSum = INT_MIN;
    sum = 0;

    for (int i = mid + 1; i <= end; i++)
    {
        sum += arr[i];
        rightSum = max(rightSum, sum);
    }

    return leftSum + rightSum;
}

int maxSubarraySum(vector<int> &arr, int start, int end)
{
    if (start == end)
        return arr[start];

    int mid = (start + end) / 2;

    int leftMax = maxSubarraySum(arr, start, mid);
    int rightMax = maxSubarraySum(arr, mid + 1, end);
    int crossMax = maxCrossSum(arr, start, mid, end);

    return max({leftMax, rightMax, crossMax});
}

int main()
{
    vector<int> prices = {100, 180, 260, 310, 40, 535, 695, 80, 20, 10};

    vector<int> diff;
    for (int i = 1; i < prices.size(); i++)
    {
        diff.push_back(prices[i] - prices[i - 1]);
    }

    int maxProfit = maxSubarraySum(diff, 0, diff.size() - 1);
    cout << "Maximum Profit: " << maxProfit << endl;

    return 0;
}
