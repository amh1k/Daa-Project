# DAA Algorithm Visualizer - UI

This is the Next.js frontend and backend for the DAA project, providing interactive visualizations for Closest Pair of Points and Integer Multiplication algorithms.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- C++ executables compiled in parent directory (`../closest_pair.exe`, `../integer_multiplication.exe`)
- Test data files in `../test_data/` directory

### Installation

```bash
cd ui
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
ui/
├── app/
│   ├── page.tsx                          # Home page
│   ├── layout.tsx                        # Root layout with navigation
│   ├── globals.css                       # Global styles
│   ├── closest-pair/
│   │   └── page.tsx                      # Closest pair visualization page
│   ├── integer-multiplication/
│   │   └── page.tsx                      # Integer multiplication page
│   ├── benchmark/
│   │   └── page.tsx                      # Benchmark dashboard
│   └── api/
│       ├── closest-pair/route.ts         # API for closest pair
│       └── integer-multiplication/route.ts # API for integer multiplication
├── components/
│   ├── ui/                               # shadcn/ui components
│   ├── navigation.tsx                    # Navigation bar
│   ├── points-canvas.tsx                 # Canvas for plotting points
│   ├── theme-provider.tsx                # Theme context provider
│   └── theme-toggle.tsx                  # Dark/light mode toggle
├── lib/
│   └── utils.ts                          # Utility functions
└── package.json
```

## 🎯 Features

### Pages

1. **Home** (`/`)
   - Algorithm overview cards
   - Quick navigation to each algorithm

2. **Closest Pair** (`/closest-pair`)
   - File selector for 10 test files (100-1000 points)
   - Interactive canvas visualization
   - Results display with execution time
   - Algorithm explanation

3. **Integer Multiplication** (`/integer-multiplication`)
   - File selector for 10 test files (100-1000 digits)
   - Product display (truncated for large numbers)
   - Performance metrics
   - Karatsuba algorithm explanation

4. **Benchmark** (`/benchmark`)
   - Run all 20 tests automatically
   - Progress tracking
   - Results table for both algorithms
   - Success/failure indicators

### API Routes

- **POST /api/closest-pair**
  - Input: `{ testFile: "test_1_n100.txt" }`
  - Executes `closest_pair.exe`
  - Returns: points data, closest pair, distance, execution time

- **POST /api/integer-multiplication**
  - Input: `{ testFile: "test_1_d100.txt" }`
  - Executes `integer_multiplication.exe`
  - Returns: product, digit counts, execution time

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Next.js API Routes (Node.js)

## ⚙️ Configuration

### Path Configuration

The API routes expect C++ executables and test data in the following structure:

```
q2/
├── closest_pair.exe
├── integer_multiplication.exe
├── test_data/
│   ├── closest_pair/
│   │   ├── test_1_n100.txt
│   │   └── ...
│   └── integer_multiplication/
│       ├── test_1_d100.txt
│       └── ...
└── ui/  # This Next.js project
```

If your structure is different, update the paths in:
- `app/api/closest-pair/route.ts`
- `app/api/integer-multiplication/route.ts`

## 🎨 Theme

- Supports light and dark modes
- Toggle in navigation bar
- Persists user preference

## 🐛 Troubleshooting

### "Executable not found" error

Check that:
1. C++ programs are compiled
2. `.exe` files are in the correct location (`../../closest_pair.exe`)
3. Update paths in API routes if needed

### "Test file not found" error

Ensure:
1. Test data is generated (`../../test_data/`)
2. File names match the expected format

### Port already in use

Change the dev port:
```bash
npm run dev -- -p 3001
```

## 📝 Development Notes

- API routes run C++ executables via Node.js `child_process`
- Console output is parsed to extract results
- Canvas visualization uses HTML5 Canvas API
- All components are responsive and mobile-friendly

## 🚀 Deployment

For deployment, ensure:
1. C++ executables are included in deployment
2. File paths are correctly configured for production environment
3. Consider using environment variables for paths

Example deployment structure:
```
deploy/
├── closest_pair.exe
├── integer_multiplication.exe
├── test_data/
└── ui/.next/  # Built Next.js app
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
