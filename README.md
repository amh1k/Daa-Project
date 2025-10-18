# Design and Analysis of Algorithms - Project 2025

[![C++](https://img.shields.io/badge/C++-11%2B-blue.svg)](https://isocpp.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A comprehensive collection of algorithm implementations demonstrating divide-and-conquer strategies, sorting techniques, and optimization problems for the Design and Analysis of Algorithms course.

## 👥 Team Members

| Name | Roll Number |
|------|-------------|
| **Huzaifa Abdul Rehman** | 23k-0782 |
| **Abdul Moiz Hossain** | 23k-0553 |
| **Ajay Kumar** | 23K-0514 |

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Problem Statements](#problem-statements)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Implementation Details](#implementation-details)
- [How to Run](#how-to-run)
- [Time Complexity Analysis](#time-complexity-analysis)
- [Contributing](#contributing)

---

## 🎯 About the Project

This project contains implementations of various algorithmic problems focusing on **Divide and Conquer** paradigm. Each solution is optimized for both time and space complexity, demonstrating a deep understanding of algorithm design principles.

---

## 📝 Problem Statements

### Question 1: Algorithm Implementations

#### Part B: Binary Exponentiation
**Problem**: Implement an efficient algorithm to compute `a^b` using divide and conquer.
- **File**: `q1/b.cpp`
- **Approach**: Binary exponentiation (exponentiation by squaring)
- **Time Complexity**: O(log b)

#### Part C: Counting Inversions
**Problem**: Count the number of inversions in an array using merge sort.
- **File**: `q1/c.cpp`
- **Approach**: Modified merge sort to count inversions
- **Time Complexity**: O(n log n)

#### Part F: Peak Element Finder
**Problem**: Find a peak element in an array where a peak is greater than or equal to its neighbors.
- **File**: `q1/f.cpp`
- **Approach**: Binary search-based divide and conquer
- **Time Complexity**: O(log n)

#### Part G: Maximum Stock Profit
**Problem**: Find the maximum profit that can be made by buying and selling stocks using the maximum subarray sum approach.
- **File**: `q1/g.cpp`
- **Approach**: Divide and conquer on difference array (Kadane's variant)
- **Time Complexity**: O(n log n)

#### Part H: Median of Two Sorted Arrays
**Problem**: Find the median (n-th smallest element) from two sorted arrays of equal size.
- **File**: `q1/h_1.cpp`
- **Approach**: Binary search on partitions
- **Time Complexity**: O(log n)

---

## 🛠️ Technologies Used

- **Language**: C++ (C++11 or later)
- **Compiler**: g++ / MinGW
- **Standard Library**: STL (Standard Template Library)
- **IDE**: Visual Studio Code

---

## 📁 Project Structure

```
Daa-Project/
│
├── README.md                 # Project documentation
├── .gitignore               # Git ignore file
├── DAA_Project2025.pdf      # Problem statement document
│
├── Books/                   # Reference materials
│
└── q1/                      # Question 1 implementations
    ├── b.cpp                # Binary exponentiation
    ├── c.cpp                # Counting inversions
    ├── f.cpp                # Peak element finder
    ├── g.cpp                # Maximum stock profit
    └── h_1.cpp              # Median of two sorted arrays
```

---

## 💡 Implementation Details

### 1. Binary Exponentiation (`b.cpp`)
Uses the divide and conquer principle to compute powers efficiently:
- If exponent is even: `a^b = (a^(b/2))^2`
- If exponent is odd: `a^b = (a^(b/2))^2 × a`

### 2. Counting Inversions (`c.cpp`)
Counts pairs (i, j) where i < j but arr[i] > arr[j]:
- Utilizes merge sort to count inversions during the merge process
- Efficiently counts cross-inversions between subarrays

### 3. Peak Element Finder (`f.cpp`)
Finds an element that is greater than or equal to its neighbors:
- Uses binary search to reduce search space by half each iteration
- Handles edge cases (first and last elements)

### 4. Maximum Stock Profit (`g.cpp`)
Finds the best time to buy and sell to maximize profit:
- Converts price array to difference array
- Applies maximum subarray sum using divide and conquer
- Finds the maximum sum of consecutive differences

### 5. Median of Two Sorted Arrays (`h_1.cpp`)
Finds the n-th smallest element from two sorted arrays:
- Binary search on partitions to find the correct split
- Ensures elements on left are smaller than elements on right
- O(log n) time complexity solution

---

## 🚀 How to Run

### Prerequisites
- C++ compiler (g++, MinGW, or MSVC)
- Windows/Linux/macOS terminal

### Compilation and Execution

**On Windows (PowerShell):**
```powershell
# Navigate to the q1 directory
cd q1

# Compile a specific program (example: b.cpp)
g++ b.cpp -o b.exe

# Run the compiled program
.\b.exe
```

**On Linux/macOS:**
```bash
# Navigate to the q1 directory
cd q1

# Compile a specific program
g++ b.cpp -o b

# Run the compiled program
./b
```

### Example Runs

**Binary Exponentiation:**
```bash
g++ b.cpp -o b && echo "2 10" | ./b
# Output: 1024
```

**Counting Inversions:**
```bash
g++ c.cpp -o c && ./c
# Output: The number of inversions are: 22
```

**Peak Element:**
```bash
g++ f.cpp -o f && ./f
# Output: Peak element is 7 at index 3
```

**Maximum Profit:**
```bash
g++ g.cpp -o g && ./g
# Output: Maximum Profit: 655
```

**Median Finder:**
```bash
g++ h_1.cpp -o h_1
# Input: n and two sorted arrays
# Output: Median (n-th smallest value)
```

---

## ⏱️ Time Complexity Analysis

| Problem | Algorithm | Time Complexity | Space Complexity |
|---------|-----------|----------------|------------------|
| Binary Exponentiation | Divide & Conquer | O(log b) | O(log b) - recursion stack |
| Counting Inversions | Modified Merge Sort | O(n log n) | O(n) |
| Peak Element | Binary Search | O(log n) | O(log n) - recursion stack |
| Maximum Profit | Divide & Conquer | O(n log n) | O(n) |
| Median of Arrays | Binary Search | O(log n) | O(1) |

---

## 📚 Key Concepts Demonstrated

- **Divide and Conquer**: Breaking problems into smaller subproblems
- **Binary Search**: Efficient searching in sorted/partially sorted data
- **Merge Sort**: Efficient sorting with additional applications
- **Dynamic Problem Solving**: Converting problems to known formats
- **Optimization**: Achieving logarithmic and linearithmic time complexities

---

## 🤝 Contributing

This is an academic project. If you'd like to suggest improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## 📧 Contact

For questions or discussions about this project:

- **Huzaifa Abdul Rehman** - 23k-0782
- **Abdul Moiz Hossain** - 23k-0553
- **Ajay Kumar** - 23K-0514

---

## 📄 License

This project is created for educational purposes as part of the Design and Analysis of Algorithms course.

---

## 🙏 Acknowledgments

- Introduction to Algorithms (CLRS)
- GeeksforGeeks and LeetCode for problem-solving inspiration

---

**⭐ If you find this repository helpful, please consider giving it a star!**
