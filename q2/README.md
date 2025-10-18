# DAA Algorithm Visualizer 🚀

A stunning, modern web application for visualizing Divide & Conquer algorithms with beautiful animations and real-time performance benchmarks.

![Next.js](https://img.shields.io/badge/Next.js-14.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer-11.0-FF0055?style=for-the-badge&logo=framer)

## ✨ Features

- 🎨 **Beautiful UI**: Modern glassmorphism design with smooth animations
- 🌙 **Dark/Light Mode**: Seamless theme switching
- 📊 **Interactive Visualizations**: Real-time algorithm visualization
- 📈 **Performance Benchmarks**: Comprehensive performance analysis with charts
- ⚡ **Fast & Responsive**: Optimized for all devices
- 🎯 **Two Algorithms**:
  - Closest Pair of Points - O(n log n)
  - Karatsuba Integer Multiplication - O(n^1.585)

## 📁 Project Structure

```
your-project/
├── q2/                           # Root directory with C++ programs
│   ├── closest_pair.cpp          # Closest pair algorithm
│   ├── closest_pair.exe          # Compiled executable
│   ├── integer_multiplication.cpp # Karatsuba algorithm
│   ├── integer_multiplication.exe # Compiled executable
│   ├── generate_test_data.cpp    # Test data generator
│   ├── test_data/                # Test data directory
│   │   ├── closest_pair/         # 10 test files (100-1000 points)
│   │   └── integer_multiplication/ # 10 test files (100-1000 digits)
│   └── ui/                       # Next.js application (THIS FOLDER)
│       ├── app/                  # App router pages
│       ├── components/           # React components
│       ├── lib/                  # Utilities
│       └── package.json          # Dependencies
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **C++ Compiler** (g++ or similar)
4. **Compiled C++ executables** in the parent directory

### Step 1: Compile C++ Programs

First, make sure your C++ programs are compiled. Navigate to the parent directory (q2):

```bash
# Go to the q2 directory
cd q2

# Compile the C++ programs
g++ -O2 closest_pair.cpp -o closest_pair
g++ -O2 integer_multiplication.cpp -o integer_multiplication
g++ -O2 generate_test_data.cpp -o generate_test_data

# Generate test data if not already present
./generate_test_data
```

### Step 2: Setup Next.js Application

```bash
# Navigate to the ui directory
cd ui

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Step 3: Open in Browser

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Usage

### Home Page
- Overview of both algorithms
- Quick navigation cards
- Beautiful animations

### Closest Pair Page
1. Select a test file from the dropdown
2. Click "Run Algorithm"
3. View the visualization with highlighted closest points
4. See execution time and distance metrics

### Integer Multiplication Page
1. Select a test file with different digit sizes
2. Click "Run Algorithm"
3. View the Karatsuba algorithm breakdown
4. See the multiplication result and performance

### Benchmark Page
1. Run individual algorithm benchmarks
2. Or run all benchmarks at once
3. View performance charts (Line, Area, Bar)
4. Compare algorithm performance across different input sizes
5. Export results for analysis

## 🛠️ Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn/ui components
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes

## 📊 Algorithm Complexities

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Closest Pair | O(n log n) | O(n) |
| Karatsuba Multiplication | O(n^1.585) | O(n) |

## 🎨 Features Highlights

### Modern UI Design
- Glassmorphism effects
- Gradient backgrounds
- Smooth animations
- Responsive layout

### Interactive Visualizations
- Real-time point plotting
- Animated connections
- Color-coded results
- Zoom and pan controls

### Performance Analysis
- Multiple chart types
- Comparative analysis
- Export capabilities
- Detailed metrics

## 🐛 Troubleshooting

### Common Issues

1. **"Executable not found" error**
   - Make sure C++ programs are compiled
   - Check file paths in API routes
   - On Unix/Linux, executables don't have .exe extension

2. **"Command failed" error**
   - Ensure test_data directory exists
   - Check file permissions
   - Verify test files are generated

3. **Performance issues**
   - Large test files may take time
   - Consider increasing timeout in API routes
   - Use production build for better performance

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📝 API Endpoints

- `POST /api/closest-pair` - Run closest pair algorithm
- `POST /api/integer-multiplication` - Run integer multiplication
- `POST /api/benchmark` - Run performance benchmarks

## 🎯 Performance Tips

1. **Development**: Use smaller test files for quick testing
2. **Production**: Build with `npm run build` for optimized performance
3. **Benchmarks**: Run benchmarks individually for large datasets

## 🤝 Contributing

Feel free to contribute to this project! Here are some areas for improvement:

- Add more algorithms
- Enhance visualizations
- Add export functionality
- Improve error handling
- Add more test cases

## 📄 License

This project is created for CS302 - Design and Analysis of Algorithms course.

## 🌟 Credits

Created with ❤️ for the 5th Semester DAA Project

---

**Note**: Make sure all C++ programs are compiled and test data is generated before running the UI application.
