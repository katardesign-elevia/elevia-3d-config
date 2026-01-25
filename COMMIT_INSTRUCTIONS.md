# Git Commit Instructions for 3D Config Tool

## Repository
https://github.com/petrmoravec-maker/Elevia-design

## Files to Commit

### New Files Created
```
src/components/3d-config/
├── README.md
├── types.ts
├── SplineConfigTool.tsx
├── SplineConfigTool.css (placeholder - needs full extraction)
└── index.ts

src/pages/3d-config/
└── index.tsx

spline-tool-v1.html (existing - reference implementation)
```

## Commit Message Template

```
feat: Add 3D Config Tool for Spline animations

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

Structure:
  * src/components/3d-config/ - Component files
  * src/pages/3d-config/ - Page wrapper
  * spline-tool-v1.html - Reference implementation

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
}
```

## Git Commands

```bash
# Navigate to the repository
cd "/Users/patrikkantor/Elevia e-commerce"

# Add all new files
git add src/components/3d-config/
git add src/pages/3d-config/
git add spline-tool-v1.html

# Commit with the message above
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

Structure:
  * src/components/3d-config/ - Component files
  * src/pages/3d-config/ - Page wrapper
  * spline-tool-v1.html - Reference implementation

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

# Set remote to correct repository if needed
git remote set-url origin https://github.com/petrmoravec-maker/Elevia-design.git

# Push to the correct repository
git push origin main
```

## Important Notes

1. **Repository Mismatch**: Current git remote points to `katardesign-elevia/elevia-3d-config` but target is `petrmoravec-maker/Elevia-design`
   - You need to either:
     - Clone the correct repo and copy files there
     - OR change the remote URL

2. **CSS Extraction**: The `SplineConfigTool.css` file is a placeholder. To complete:
   - Copy all CSS from `spline-tool-v1.html` (between <style> tags)
   - Paste into `SplineConfigTool.css`

3. **HTML File**: Include `spline-tool-v1.html` so the iframe wrapper works

4. **Dependencies**: Add to package.json:
   ```json
   {
     "dependencies": {
       "@splinetool/runtime": "latest"
     }
   }
   ```

5. **Full React Conversion**: The current implementation uses an iframe wrapper. For full React conversion, see `src/components/3d-config/README.md`

## Next Steps After Commit

The AI will wire up the tool to the app router and tools registry using the tool config provided in the commit message.

