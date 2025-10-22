/*
Team Members:
23k-0553 Abdul Moiz Hussain
23k-0782 Huzaifa Abdul Rehman
23k-0514 Ajay Kumar
*/

#include <bits/stdc++.h>
using namespace std;
long long binpow(long long a, long long b)
{
    if (b == 0)
        return 1;
    long long res = binpow(a, b / 2);
    if (b % 2)
        return res * res * a;
    else
        return res * res;
}
int main()
{
    long long a, b;
    cin >> a >> b;
    cout << binpow(a, b) << endl;
    cout << "(2) Recurrence: T(n) = T(n/2) + 1 ⇒ T(n) = O(log n)." << endl;
    cout << "(3) It uses log n multiplications, which is much faster than the brute - force O(n) multiplications." << endl;
    return 0;
}
