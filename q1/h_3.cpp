#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int findLocalMinimum(const vector<int> &tree)
{
    int n = tree.size();
    int index = 0;
    while (true)
    {
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        int leftValue = (left < n) ? tree[left] : INT_MAX;
        int rightValue = (right < n) ? tree[right] : INT_MAX;

        if (tree[index] < leftValue && tree[index] < rightValue)
            return index;

        if (leftValue < rightValue)
            index = left;
        else
            index = right;
    }
}

int main()
{
    vector<int> tree = {10, 5, 15, 3, 7, 12, 17, 1, 4};
    int localMinIndex = findLocalMinimum(tree);
    cout << "Local minimum found at index: " << localMinIndex << endl;
    cout << "Value: " << tree[localMinIndex] << endl;
    return 0;
}
