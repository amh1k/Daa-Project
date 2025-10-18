export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Project Info */}
          <div>
            <h3 className="font-semibold mb-3">DAA Algorithm Visualizer</h3>
            <p className="text-sm text-muted-foreground">
              CS302 - Design and Analysis of Algorithms
            </p>
            <p className="text-sm text-muted-foreground">
              Fall 2025 Project
            </p>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="font-semibold mb-3">Team Members</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Huzaifa Abdul Rehman</li>
              <li>Abdul Moiz Hossain</li>
              <li>Ajay Kumar</li>
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="font-semibold mb-3">Built With</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-primary/10 rounded">Next.js</span>
              <span className="text-xs px-2 py-1 bg-primary/10 rounded">TypeScript</span>
              <span className="text-xs px-2 py-1 bg-primary/10 rounded">Tailwind</span>
              <span className="text-xs px-2 py-1 bg-primary/10 rounded">C++</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 DAA Project - All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}
