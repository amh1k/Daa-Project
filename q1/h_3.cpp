#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int probeCount = 0;

int findLocalMinimum(const vector<int> &tree)
{
    int n = tree.size();
    int index = 0;

    cout << "\nSearching for local minimum..." << endl;

    while (true)
    {
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        probeCount++;
        int currentValue = tree[index];
        cout << "Probe " << probeCount << ": Visiting node " << index
             << " with value " << currentValue << endl;

        int leftValue = INT_MAX;
        int rightValue = INT_MAX;

        if (left < n) {
            probeCount++;
            leftValue = tree[left];
            cout << "Probe " << probeCount << ": Left child (index " << left
                 << ") has value " << leftValue << endl;
        }

        if (right < n) {
            probeCount++;
            rightValue = tree[right];
            cout << "Probe " << probeCount << ": Right child (index " << right
                 << ") has value " << rightValue << endl;
        }

        if (currentValue < leftValue && currentValue < rightValue)
        {
            cout << "\nLocal minimum found!" << endl;
            return index;
        }

        if (leftValue < rightValue)
        {
            cout << "Moving to left child (smaller value)\n" << endl;
            index = left;
        }
        else
        {
            cout << "Moving to right child (smaller value)\n" << endl;
            index = right;
        }
    }
}

int main()
{
    cout << "=== Local Minimum in Binary Tree ===" << endl;
    cout << "Recurrence: T(n) = T(n/2) + O(1)" << endl;
    cout << "Time Complexity: O(log n)" << endl;
    cout << "Space Complexity: O(1)" << endl;
    cout << endl;

    vector<int> tree = {10, 5, 15, 3, 7, 12, 17, 1, 4};

    cout << "Tree (level-order): ";
    for (int val : tree) cout << val << " ";
    cout << endl;

    int localMinIndex = findLocalMinimum(tree);
    cout << "\nLocal minimum at index " << localMinIndex << " with value " << tree[localMinIndex] << endl;
    return 0;
}
