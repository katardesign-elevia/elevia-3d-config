# Setup Guide: Push 3D Config Tool to Elevia-design Repository

## Current Situation
- **Current Repository**: `git@github.com:katardesign-elevia/elevia-3d-config.git`
- **Target Repository**: `https://github.com/petrmoravec-maker/Elevia-design`

## Files Created

### Component Structure
```
src/
├── components/
│   └── 3d-config/
│       ├── README.md                 ✅ Created - Documentation
│       ├── types.ts                  ✅ Created - TypeScript interfaces
│       ├── SplineConfigTool.tsx      ✅ Created - React wrapper component
│       ├── SplineConfigTool.css      ⚠️  Created - Placeholder (needs CSS extraction)
│       └── index.ts                  ✅ Created - Export barrel
└── pages/
    └── 3d-config/
        └── index.tsx                 ✅ Created - Page wrapper
```

### Reference Implementation
- `spline-tool-v1.html` - Complete working HTML implementation (~3158 lines)

## Option 1: Clone Target Repo and Copy Files (RECOMMENDED)

```bash
# 1. Clone the target repository
cd /Users/patrikkantor
git clone https://github.com/petrmoravec-maker/Elevia-design.git
cd Elevia-design

# 2. Copy the created files from current location
cp -r "/Users/patrikkantor/Elevia e-commerce/src" ./
cp "/Users/patrikkantor/Elevia e-commerce/spline-tool-v1.html" ./public/

# 3. Stage all new files
git add src/components/3d-config/
git add src/pages/3d-config/
git add public/spline-tool-v1.html

# 4. Commit with tool config
git commit -m "feat: Add 3D Config Tool for Spline animations

- Added 3D configuration tool with scroll-based keyframe animations
- Supports responsive breakpoints (monitor, desktop, laptop, tablet, mobile)
- Component structure ready for React/TypeScript integration
- Currently using iframe wrapper for existing HTML implementation

Features:
  * Spline scene integration with object selection
  * Position and rotation controls with real-time preview
  * Keyframe management with ascending scroll position validation
  * Live preview with smooth interpolation
  * Export to JSON and CSS (per breakpoint)
  * Custom background (color/image) support
  * Relative positioning system (0,0,0 = original position)
  * Object visibility controls
  * Responsive breakpoint settings

Tool config for tools.ts:
{
  id: '3d-config',
  name: '3D Config Tool',
  description: 'Advanced 3D object configuration tool with scroll-based animations. Configure Spline 3D objects with keyframe animations, responsive breakpoints, and export to JSON/CSS.',
  icon: '🎨',
  category: 'design',
  path: '/3d-config',
  component: '3d-config',
  tags: ['3d', 'animation', 'spline', 'responsive', 'keyframes', 'scroll'],
  featured: true
}"

# 5. Push to main branch
git push origin main
```

## Option 2: Add New Remote and Push

```bash
cd "/Users/patrikkantor/Elevia e-commerce"

# Add new remote for target repository
git remote add elevia-design https://github.com/petrmoravec-maker/Elevia-design.git

# Stage files
git add src/
git add spline-tool-v1.html
git add COMMIT_INSTRUCTIONS.md

# Commit
git commit -m "feat: Add 3D Config Tool for Spline animations

[Full commit message same as above]"

# Push to the new remote
git push elevia-design main
```

## Before You Push - Complete These Tasks

### 1. Extract Full CSS (IMPORTANT)
The `SplineConfigTool.css` is currently a placeholder. You need to:

```bash
# Extract CSS from HTML file (lines 8-1508 approximately)
cd "/Users/patrikkantor/Elevia e-commerce"
sed -n '/<style>/,/<\/style>/p' spline-tool-v1.html | sed '1d;$d' > src/components/3d-config/SplineConfigTool.css
```

### 2. Place HTML File in Public Directory
The iframe wrapper needs access to the HTML file:

```bash
# If target repo has a 'public' folder:
mkdir -p public
cp spline-tool-v1.html public/

# Update SplineConfigTool.tsx iframe src to: "/spline-tool-v1.html"
```

### 3. Verify Repository Structure
The target repository should have this structure:

```
Elevia-design/
├── src/
│   ├── components/
│   ├── pages/
│   └── ...
├── public/
└── package.json
```

## Tool Configuration

When you commit, include this in your commit message. The AI will use it to wire up the tool:

```typescript
{
  id: '3d-config',
  name: '3D Config Tool',
  description: 'Advanced 3D object configuration tool with scroll-based animations. Configure Spline 3D objects with keyframe animations, responsive breakpoints, and export to JSON/CSS.',
  icon: '🎨',
  category: 'design',
  path: '/3d-config',
  component: '3d-config',
  tags: ['3d', 'animation', 'spline', 'responsive', 'keyframes', 'scroll'],
  featured: true
}
```

## Dependencies to Add

Add to `package.json`:

```json
{
  "dependencies": {
    "@splinetool/runtime": "^1.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

## After Pushing

The AI system mentioned in the instructions will:
1. Read the tool config from your commit message
2. Add the tool to `tools.ts` registry
3. Wire it up to the app router
4. Make it accessible at `/3d-config` path

## Current Implementation Approach

The tool is implemented as:
- **Phase 1** (Current): Iframe wrapper containing the complete HTML implementation
  - Pros: Fully functional immediately, no rework needed
  - Cons: Not fully integrated into React ecosystem

- **Phase 2** (Future): Full React/TypeScript conversion
  - See `src/components/3d-config/README.md` for conversion roadmap
  - Will require splitting ~3000 lines into proper React components
  - Will use custom hooks for state management

## Questions?

If the target repository has a different structure than expected, you may need to adjust paths accordingly. Check:
1. Does it use `src/` or a different directory?
2. Does it have a `public/` folder or `static/`?
3. What does the existing `tools.ts` file look like?

## Ready to Execute?

Choose Option 1 (recommended) and run the commands above!

