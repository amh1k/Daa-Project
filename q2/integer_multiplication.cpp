// Q2 Part (ii): Integer Multiplication - Karatsuba Algorithm O(n^1.585)
#include <iostream>
#include <fstream>
#include <string>
#include <algorithm>
#include <chrono>
using namespace std;

string trim(string s) {
    size_t p = s.find_first_not_of('0');
    return (p == string::npos) ? "0" : s.substr(p);
}

string add(string a, string b) {
    string res = "";
    int carry = 0, i = a.size()-1, j = b.size()-1;
    while (i >= 0 || j >= 0 || carry) {
        int sum = carry;
        if (i >= 0) sum += a[i--] - '0';
        if (j >= 0) sum += b[j--] - '0';
        res = char('0' + sum%10) + res;
        carry = sum/10;
    }
    return trim(res);
}

string sub(string a, string b) {
    string res = "";
    int borrow = 0, i = a.size()-1, j = b.size()-1;
    while (i >= 0) {
        int diff = (a[i--] - '0') - borrow;
        if (j >= 0) diff -= (b[j--] - '0');
        if (diff < 0) { diff += 10; borrow = 1; }
        else borrow = 0;
        res = char('0' + diff) + res;
    }
    return trim(res);
}

void makeEqual(string& a, string& b) {
    int d = a.size() - b.size();
    if (d > 0) b = string(d, '0') + b;
    else if (d < 0) a = string(-d, '0') + a;
}

string shift(string s, int n) {
    return (s == "0") ? "0" : s + string(n, '0');
}

string naive(string a, string b) {
    int n = a.size(), m = b.size();
    string res(n+m, '0');
    for (int i = n-1; i >= 0; i--)
        for (int j = m-1, k = i+m, c = 0; j >= 0 || c; j--, k--) {
            int p = (j >= 0 ? (a[i]-'0')*(b[j]-'0') : 0) + (res[k]-'0') + c;
            res[k] = '0' + p%10;
            c = p/10;
        }
    return trim(res);
}

string karatsuba(string x, string y) {
    makeEqual(x, y);
    int n = x.size();
    if (n <= 10) return naive(x, y);

    int m = n/2;
    string a = x.substr(0, n-m), b = x.substr(n-m);
    string c = y.substr(0, n-m), d = y.substr(n-m);

    string z2 = karatsuba(a, c);
    string z0 = karatsuba(b, d);
    string z1 = karatsuba(add(a,b), add(c,d));
    z1 = sub(sub(z1, z2), z0);

    return add(add(shift(z2, 2*m), shift(z1, m)), z0);
}

int main(int argc, char* argv[]) {
    string file = (argc > 1) ? argv[1] : "test_data/integer_multiplication/test_1_d100.txt";

    ifstream in(file);
    string num1, num2;
    getline(in, num1);
    getline(in, num2);
    in.close();

    num1 = trim(num1);
    num2 = trim(num2);

    auto start = chrono::high_resolution_clock::now();
    string res = karatsuba(num1, num2);
    auto end = chrono::high_resolution_clock::now();
    double time_ms = chrono::duration<double, milli>(end - start).count();

    cout << "Integer Multiplication (d1=" << num1.size() << ", d2=" << num2.size() << "):\n";
    cout << "Product length: " << res.size() << " digits\n";
    if (res.size() <= 100) cout << "Product: " << res << "\n";
    else cout << "Product: " << res.substr(0, 50) << "..." << res.substr(res.size()-50) << "\n";
    cout << "Time: " << time_ms << " ms\n";

    ofstream out(file.substr(0, file.find_last_of('.')) + "_output.txt");
    out << "Num1: " << num1.size() << " digits\n";
    out << "Num2: " << num2.size() << " digits\n";
    out << "Product: " << res.size() << " digits\n";
    out << "Time: " << time_ms << " ms\n";
    out << "Result: " << res << "\n";
    out.close();

    return 0;
}
