/*
 * Question 1 - Part H - Exercise 3 (Problem 6, Page 246)
 * Finding Local Minimum in a Complete Binary Tree
 *
 * Problem: Given a complete binary tree T with n = 2^d - 1 nodes where each node
 * has a distinct real number label. Find a local minimum (a node whose label is
 * less than all its neighbors) using only O(log n) probes.
 *
 * Algorithm Strategy:
 * - Start at root and follow path to minimum child recursively
 * - At each node, probe its value and all children's values
 * - If current node is smaller than all children, it's a local minimum
 * - Otherwise, recurse to the child with minimum value
 * - This guarantees O(log n) probes since we traverse at most the height
 */

#include <iostream>
#include <vector>
#include <climits>
using namespace std;

// Function to find a local minimum in a complete binary tree
int findLocalMinimum(const vector<int>& tree) {
    int n = tree.size();
    int index = 0;  // start from root

    while (true) {
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        int leftValue = (left < n) ? tree[left] : INT_MAX;
        int rightValue = (right < n) ? tree[right] : INT_MAX;

        // If current node is smaller than both children -> local minimum
        if (tree[index] < leftValue && tree[index] < rightValue) {
            return index;
        }

        // Move to the smaller child
        if (leftValue < rightValue)
            index = left;
        else
            index = right;
    }
}

int main() {
    // Example: complete binary tree stored in array
    vector<int> tree = {10, 5, 15, 3, 7, 12, 17, 1, 4};

    int localMinIndex = findLocalMinimum(tree);
    cout << "Local minimum found at index: " << localMinIndex << endl;
    cout << "Value: " << tree[localMinIndex] << endl;

    return 0;
}
