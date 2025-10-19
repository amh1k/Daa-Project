# How to Create Custom Test Files

This guide explains how to manually create test files for the algorithms in Notepad or any text editor.

## 📝 File Formats

### 1. Closest Pair of Points

**File Format:**
```
n
x1 y1
x2 y2
x3 y3
...
xn yn
```

**Example:** `my_test_points.txt`
```
5
10.5 20.3
-5.2 15.7
30.0 -10.5
0.0 0.0
25.5 18.2
```

**Explanation:**
- First line: `n` = number of points
- Next `n` lines: Each line contains `x y` coordinates (space-separated)
- Use decimal numbers (can be negative)

**Steps to create in Notepad:**
1. Open Notepad
2. Type the number of points on first line
3. Type each point's coordinates (x y) on separate lines
4. Save as `.txt` file (e.g., `my_test_points.txt`)
5. Save in folder: `q2/test_data/closest_pair/`

---

### 2. Integer Multiplication (Karatsuba)

**File Format:**
```
number1
number2
```

**Example:** `my_test_multiply.txt`
```
12345678901234567890
98765432109876543210
```

**Explanation:**
- First line: First large integer (any number of digits)
- Second line: Second large integer (any number of digits)
- Only positive integers, no spaces or commas

**Steps to create in Notepad:**
1. Open Notepad
2. Type first number on line 1 (no commas, just digits)
3. Type second number on line 2
4. Save as `.txt` file (e.g., `my_test_multiply.txt`)
5. Save in folder: `q2/test_data/integer_multiplication/`

---

## 📂 Example Test Files

### Example 1: Small Closest Pair Test
**Filename:** `custom_points_small.txt`
```
10
1.0 2.0
3.0 4.0
5.0 6.0
7.0 8.0
9.0 10.0
11.0 12.0
13.0 14.0
15.0 16.0
17.0 18.0
19.0 20.0
```

### Example 2: Large Closest Pair Test (200 points)
**Filename:** `custom_points_200.txt`
```
200
-100.5 200.3
-99.2 199.7
...
(198 more lines)
```

### Example 3: Small Integer Multiplication
**Filename:** `custom_multiply_small.txt`
```
1234
5678
```

### Example 4: Large Integer Multiplication (100 digits)
**Filename:** `custom_multiply_100d.txt`
```
1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
9876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210
```

---

## 🎯 Quick Tips

### For Closest Pair:
- ✅ Use at least 10 points for meaningful results
- ✅ Coordinates can be positive or negative
- ✅ Use decimal points (10.5) or integers (10)
- ✅ Separate x and y with a space
- ❌ Don't use commas in numbers

### For Integer Multiplication:
- ✅ Can be any length (10 digits to 1000+ digits)
- ✅ Only digits 0-9
- ✅ For tree visualization, use ≤50 digits
- ❌ No spaces, commas, or special characters
- ❌ No negative numbers

---

## 🚀 How to Use Custom Files

### Option 1: Using the UI (Recommended)
1. Go to the algorithm page (Closest Pair or Integer Multiplication)
2. Click on **"Custom File"** tab
3. Click **"Upload Custom File"**
4. Select your `.txt` file
5. Click **"Run Algorithm"**

### Option 2: Adding to Predefined List
1. Create your test file in the appropriate folder:
   - Closest Pair: `q2/test_data/closest_pair/`
   - Integer Multiplication: `q2/test_data/integer_multiplication/`
2. Restart the dev server
3. Your file will appear in the dropdown list

---

## 📋 Sample Test File Templates

### Template: Random Points Generator (Python)
```python
import random

n = 100  # number of points
with open('custom_random_points.txt', 'w') as f:
    f.write(f"{n}\n")
    for _ in range(n):
        x = random.uniform(-1000, 1000)
        y = random.uniform(-1000, 1000)
        f.write(f"{x:.6f} {y:.6f}\n")
```

### Template: Random Large Numbers (Python)
```python
import random

digits = 50
num1 = ''.join([str(random.randint(0, 9)) for _ in range(digits)])
num2 = ''.join([str(random.randint(0, 9)) for _ in range(digits)])

with open('custom_random_multiply.txt', 'w') as f:
    f.write(f"{num1}\n{num2}\n")
```

---

## 🔍 Validation

Your files are valid if:
- **Closest Pair:**
  - First line is a valid integer (number of points)
  - Exactly that many point lines follow
  - Each point line has two numbers separated by space

- **Integer Multiplication:**
  - Exactly 2 lines
  - Each line contains only digits (0-9)
  - No spaces, letters, or special characters

---

## 💡 Example: Creating a Test File Step-by-Step

### Creating `my_test.txt` for Closest Pair in Notepad:

1. **Open Notepad** (Windows) or TextEdit (Mac)

2. **Type this exactly:**
   ```
   3
   1.0 2.0
   3.5 4.5
   6.0 7.0
   ```

3. **Save the file:**
   - Click File → Save As
   - Navigate to `q2/test_data/closest_pair/`
   - Filename: `my_test.txt`
   - Save as type: "All Files (*.*)"
   - Click Save

4. **Use in the app:**
   - Go to Closest Pair page
   - Click "Custom File" tab
   - Upload `my_test.txt`
   - Click "Run Algorithm"

**Result:** The algorithm will find the two closest points among the 3 points you provided!

---

## 📞 Troubleshooting

**Error: "Unexpected output format"**
- Check file format matches exactly (no extra spaces, correct number of lines)

**Error: "Test file not found"**
- Make sure file is saved in the correct folder
- Check file extension is `.txt`

**Error: "Failed to parse output"**
- For Closest Pair: Ensure all coordinates are valid numbers
- For Integer Multiplication: Ensure only digits, no spaces

---

## 🎓 Summary

**Closest Pair Files:**
```
<number_of_points>
<x1> <y1>
<x2> <y2>
...
```

**Integer Multiplication Files:**
```
<first_number>
<second_number>
```

That's it! Create your test files and test the algorithms with your own data! 🎉
