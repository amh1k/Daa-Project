// Test Data Generator for Q2 - Generates 10 files for each algorithm (100-1000 size)
#include <iostream>
#include <fstream>
#include <random>
using namespace std;

double randDouble(double min, double max) {
    static mt19937 gen(random_device{}());
    return uniform_real_distribution<>(min, max)(gen);
}

char randDigit() {
    static mt19937 gen(random_device{}());
    return '0' + uniform_int_distribution<>(0, 9)(gen);
}

int main() {
    int sizes[] = {100, 150, 200, 300, 400, 500, 600, 700, 850, 1000};

    // Generate Closest Pair tests
    for (int i = 0; i < 10; i++) {
        ofstream f("test_data/closest_pair/test_" + to_string(i+1) + "_n" + to_string(sizes[i]) + ".txt");
        f << sizes[i] << "\n";
        for (int j = 0; j < sizes[i]; j++)
            f << randDouble(-1000, 1000) << " " << randDouble(-1000, 1000) << "\n";
        f.close();
        cout << "Created closest_pair test " << (i+1) << " (n=" << sizes[i] << ")\n";
    }

    // Generate Integer Multiplication tests
    for (int i = 0; i < 10; i++) {
        ofstream f("test_data/integer_multiplication/test_" + to_string(i+1) + "_d" + to_string(sizes[i]) + ".txt");
        string num1, num2;
        num1 += randDigit(); if(num1[0]=='0') num1[0]='1';
        num2 += randDigit(); if(num2[0]=='0') num2[0]='1';
        for (int j = 1; j < sizes[i]; j++) {
            num1 += randDigit();
            num2 += randDigit();
        }
        f << num1 << "\n" << num2 << "\n";
        f.close();
        cout << "Created integer_mult test " << (i+1) << " (d=" << sizes[i] << ")\n";
    }

    cout << "\nDone! 20 test files created.\n";
    return 0;
}
