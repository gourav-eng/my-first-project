# Architecture & Flow Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Nexus Workflow App                          │
│                    (WorkflowApp.jsx)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │  State Layer   │  │ Event Handlers │  │  View Router    │  │
│  ├────────────────┤  ├────────────────┤  ├─────────────────┤  │
│  │ • workspaces   │  │ • Mouse Events │  │ if (canvas)     │  │
│  │ • activeTab    │  │ • Touch Events │  │   → Canvas      │  │
│  │ • nodes        │  │ • Keyboard     │  │ else            │  │
│  │ • groups       │  │ • Gestures     │  │   → Outline     │  │
│  │ • edges        │  │ • Drag/Drop    │  └─────────────────┘  │
│  │ • transform    │  └────────────────┘                        │
│  │ • viewMode ⭐  │                                             │
│  │ • bottomSheet⭐│                                             │
│  └────────────────┘                                             │
│                                                                  │
└──────────────────────┬───────────────────────┬──────────────────┘
                       │                       │
         ┌─────────────▼──────────┐  ┌────────▼─────────────┐
         │    Canvas View         │  │   Outline Board      │
         │    (Spatial Mode)      │  │   (List Mode) ⭐     │
         ├────────────────────────┤  ├──────────────────────┤
         │ • Infinite Canvas      │  │ • Hierarchical List  │
         │ • Drag & Drop          │  │ • Inline Editing     │
         │ • Zoom/Pan             │  │ • Mobile-Optimized   │
         │ • Visual Connections   │  │ • Fast Updates       │
         │ • Group Boundaries     │  │ • No Gestures Needed │
         │ • Touch Support ⭐     │  │ • Perfect for Phone  │
         └────────────────────────┘  └──────────────────────┘
                       │
                       │ (Mobile Only)
                       │
         ┌─────────────▼──────────────┐
         │   Bottom Sheet Panel ⭐    │
         ├────────────────────────────┤
         │ • Slide-up Animation       │
         │ • Touch-Friendly Actions   │
         │ • Theme Picker             │
         │ • Confirmation Dialogs     │
         │ • Replaces Context Menus   │
         └────────────────────────────┘
```

⭐ = New mobile enhancements

---

## Touch Gesture Flow

```
User Touch Input
       │
       ▼
┌──────────────────┐
│ Touch Start      │
│ e.touches.length │
└────┬─────────┬───┘
     │         │
     │ = 1     │ = 2
     ▼         ▼
┌─────────┐ ┌─────────┐
│  Pan    │ │  Pinch  │
│ Canvas  │ │  Zoom   │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────────┐
│ Update  │ │  Calculate  │
│ X, Y    │ │ New Scale   │
│ Pan     │ │ & Center    │
└────┬────┘ └────┬────────┘
     │           │
     └─────┬─────┘
           ▼
    ┌──────────────┐
    │   Update     │
    │  Transform   │
    │  State       │
    └──────┬───────┘
           ▼
    ┌──────────────┐
    │   Re-render  │
    │   Canvas     │
    └──────────────┘
```

---

## View Mode State Machine

```
        ┌──────────────┐
        │   Initial    │
        │ (Canvas View)│
        └──────┬───────┘
               │
    User Clicks Toggle
               │
        ┌──────▼───────┐
        │              │
    ┌───▼────┐    ┌────▼─────┐
    │ Canvas │◄───┤  Outline │
    │  Mode  │    │   Mode   │
    └───┬────┘    └────┬─────┘
        │              │
        └──────────────┘
        Bidirectional
         State Sync
```

**State Preservation**:
- Both views share same data source
- Changes in Outline immediately reflect in Canvas
- Canvas position/zoom preserved when switching back

---

## Bottom Sheet Interaction Flow

```
┌─────────────────┐
│ User Taps Node  │
│   (Mobile)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│ Is Mobile?      │──NO──┤ Show Context │
│ (width < 768px) │      │   Menu       │
└────────┬────────┘      └──────────────┘
         │ YES
         ▼
┌─────────────────────┐
│ setBottomSheet({    │
│   nodeId: node.id   │
│ })                  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Render Bottom      │
│  Sheet Component    │
├─────────────────────┤
│ • Backdrop (blur)   │
│ • Slide-up animate  │
│ • Action buttons    │
│ • Theme picker      │
└────────┬────────────┘
         │
    User Action
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│ Action │ │  Close   │
│ Handler│ │  Sheet   │
└───┬────┘ └────┬─────┘
    │           │
    ▼           │
┌────────┐      │
│ Update │      │
│ State  │      │
└───┬────┘      │
    │           │
    └─────┬─────┘
          ▼
   ┌─────────────┐
   │ Re-render   │
   │ Views       │
   └─────────────┘
```

---

## Responsive Breakpoint Strategy

```
Screen Width Spectrum:

0px        640px         1024px           ∞
 │──────────│──────────────│──────────────│
 │  Mobile  │   Tablet     │   Desktop    │
 │──────────│──────────────│──────────────│
    ⬇            ⬇              ⬇
┌─────────┐  ┌─────────┐  ┌─────────────┐
│Outline  │  │Canvas + │  │ Full Canvas │
│Primary  │  │Outline  │  │ + Sidebar   │
│         │  │Both Good│  │ All Features│
│Touch    │  │         │  │ Mouse       │
│Bottom   │  │Touch +  │  │ Keyboard    │
│Sheet    │  │Mouse OK │  │ Right-click │
└─────────┘  └─────────┘  └─────────────┘
```

**Recommendations by Device**:
- **Phone (< 640px)**: Use Outline view for editing, Canvas for visualization
- **Tablet (640-1024px)**: Both views work well, landscape = Canvas, portrait = Outline
- **Desktop (> 1024px)**: Full Canvas experience with sidebar and right-click menus

---

## Data Sync Architecture

```
┌──────────────────────────────────────┐
│          Global State                │
│      (workspaces array)              │
├──────────────────────────────────────┤
│ {                                    │
│   id: 'ws-1',                        │
│   name: 'Project Roadmap',           │
│   groups: [ {...}, {...} ],          │
│   nodes: [ {...}, {...} ],           │
│   edges: [ {...}, {...} ]            │
│ }                                    │
└─────────┬────────────────────────────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌───────┐   ┌────────┐
│Canvas │   │Outline │
│ Read  │   │  Read  │
└───┬───┘   └───┬────┘
    │           │
    ▼           ▼
┌───────┐   ┌────────┐
│Canvas │   │Outline │
│Update │   │ Update │
└───┬───┘   └───┬────┘
    │           │
    └─────┬─────┘
          ▼
   ┌────────────┐
   │ updateNode │
   │updateGroup │
   │  handlers  │
   └──────┬─────┘
          ▼
   ┌────────────────┐
   │ setWorkspaces( │
   │   newState     │
   │ )              │
   └──────┬─────────┘
          ▼
   ┌────────────────┐
   │ computeLayout  │
   │ (auto-adjust)  │
   └──────┬─────────┘
          ▼
   ┌────────────────┐
   │ localStorage   │
   │   .setItem     │
   └────────────────┘
```

**Key Insight**: Both views manipulate the same state object, ensuring perfect synchronization without additional sync logic.

---

## Pinch-to-Zoom Math

```
Initial State:
  touchDistance = √((x₂-x₁)² + (y₂-y₁)²)
  initialPinchScale = currentScale (e.g., 1.0)

During Pinch:
  newDistance = √((x₂'-x₁')² + (y₂'-y₁')²)
  scaleChange = newDistance / touchDistance
  newScale = initialPinchScale × scaleChange

Bounds:
  finalScale = clamp(newScale, 0.2, 3.0)

Center Point:
  centerX = (x₁ + x₂) / 2
  centerY = (y₁ + y₂) / 2

Zoom-to-Center:
  scaleFactor = newScale / oldScale
  newTransformX = centerX - scaleFactor × (centerX - oldTransformX)
  newTransformY = centerY - scaleFactor × (centerY - oldTransformY)
```

**Visual Representation**:
```
Finger 1: (100, 200)    Initial Distance: 300px
Finger 2: (400, 200)    Initial Scale: 1.0x
         ↓
Finger 1: (150, 200)    New Distance: 200px
Finger 2: (350, 200)    Scale Change: 200/300 = 0.67
                        New Scale: 1.0 × 0.67 = 0.67x (zoom out)
```

---

## Component Hierarchy

```
WorkflowApp
├── Header
│   ├── Logo
│   ├── View Toggle ⭐ (Canvas / Outline)
│   ├── Undo/Redo
│   ├── Action Buttons
│   └── Export/Import
│
├── Main Layout
│   ├── Sidebar (conditional)
│   │   ├── Workspace List
│   │   ├── Stats Dashboard
│   │   └── Node Directory
│   │
│   └── View Router ⭐
│       ├── IF viewMode === 'canvas'
│       │   └── Canvas View
│       │       ├── Grid Background
│       │       ├── Transform Layer
│       │       ├── Groups (rendered)
│       │       ├── Nodes (rendered)
│       │       ├── Edges (SVG)
│       │       └── Zoom Controls
│       │
│       └── IF viewMode === 'outline'
│           └── OutlineBoardView ⭐
│               ├── Group List
│               │   ├── Group Header
│               │   ├── Subgroups (recursive)
│               │   └── Nodes
│               └── Unassigned Section
│
└── Modals/Overlays
    ├── Confirm Clear
    ├── Error Message
    ├── Image Compress
    ├── Context Menu (desktop)
    └── Bottom Sheet ⭐ (mobile)
        ├── Backdrop
        ├── Handle Bar
        ├── Node Info
        ├── Action Grid
        └── Theme Picker
```

⭐ = New components for mobile

---

## Event Handler Priority

```
Touch Event Priority:
1. onTouchStart    → Capture initial touch
2. onTouchMove     → Process gesture (pinch/pan)
3. onTouchEnd      → Clean up state

Mouse Event Priority (Desktop):
1. onPointerDown   → Start drag/pan
2. onPointerMove   → Update position
3. onPointerUp     → Finalize action
4. onContextMenu   → Right-click menu

Hybrid Handling:
- Touch events take precedence on mobile
- Pointer events handle mouse on desktop
- No conflicts due to conditional rendering
```

---

## Performance Optimization Points

```
Rendering Pipeline:

User Interaction
      ▼
┌──────────────┐
│Event Handler │
└──────┬───────┘
       ▼
┌──────────────┐    useCallback
│ Debounce/    │◄────────────────┐
│ Throttle     │                 │
└──────┬───────┘                 │
       ▼                         │
┌──────────────┐                 │
│ State Update │                 │
└──────┬───────┘                 │
       ▼                         │
┌──────────────┐    React.memo   │
│ Conditional  │◄────────────────┤
│ Re-render    │                 │
└──────┬───────┘                 │
       ▼                         │
┌──────────────┐    CSS Transform│
│ GPU-accelera │◄────────────────┘
│ ted Animation│
└──────────────┘
```

**Optimization Techniques Used**:
1. **useCallback**: Prevent handler recreation
2. **React.memo**: Skip unnecessary re-renders
3. **CSS transforms**: Hardware acceleration
4. **Debouncing**: Reduce calculation frequency
5. **Conditional rendering**: Hide what's not needed

---

## Mobile vs Desktop Feature Matrix

```
┌─────────────────────┬──────────┬──────────┐
│     Feature         │  Mobile  │ Desktop  │
├─────────────────────┼──────────┼──────────┤
│ Canvas View         │    ✅    │    ✅    │
│ Outline View        │    ⭐    │    ✅    │
│ Drag & Drop Nodes   │    ⚠️    │    ✅    │
│ Pinch-to-Zoom       │    ⭐    │    ❌    │
│ Mouse Wheel Zoom    │    ❌    │    ✅    │
│ Right-Click Menu    │    ❌    │    ✅    │
│ Bottom Sheet        │    ⭐    │    ❌    │
│ Sidebar             │    ⚠️    │    ✅    │
│ Keyboard Shortcuts  │    ❌    │    ✅    │
│ Touch Pan           │    ⭐    │    ❌    │
│ Inline Editing      │    ⭐    │    ✅    │
│ Image Upload        │    ✅    │    ✅    │
│ Undo/Redo           │    ✅    │    ✅    │
│ Export/Import       │    ✅    │    ✅    │
└─────────────────────┴──────────┴──────────┘

Legend:
✅ Fully supported
⭐ New mobile-optimized version
⚠️ Limited (use Outline view recommended)
❌ Not applicable for this device type
```

---

## State Flow Diagram (Undo/Redo)

```
┌────────────────────────────────────────┐
│         History Management             │
├────────────────────────────────────────┤
│                                        │
│  Past: [state1, state2, state3]       │
│  Present: state4 ← Current             │
│  Future: []                            │
│                                        │
└────────┬──────────────┬────────────────┘
         │              │
    Undo │              │ Redo
         ▼              ▼
┌─────────────┐   ┌──────────────┐
│ Pop Past    │   │ Pop Future   │
│ → Present   │   │ → Present    │
│             │   │              │
│ Push Present│   │ Push Present │
│ → Future    │   │ → Past       │
└─────────────┘   └──────────────┘
         │              │
         └──────┬───────┘
                ▼
       ┌────────────────┐
       │ Update Display │
       └────────────────┘
```

---

## File Structure Overview

```
project/
│
├── WorkflowApp.jsx              # Main app (existing)
│   └── Add touch handlers ⭐
│
├── MobileComponents.jsx ⭐       # New mobile components
│   ├── BottomSheetActionPanel
│   └── OutlineBoardView
│
├── README.md                     # Updated docs
│
├── MOBILE_ENHANCEMENTS.md ⭐     # Technical specs
│
├── INTEGRATION_GUIDE.md ⭐       # Implementation steps
│
├── MOBILE_QUICK_REFERENCE.md ⭐  # User guide
│
├── IMPLEMENTATION_SUMMARY.md ⭐  # This overview
│
└── ARCHITECTURE_DIAGRAM.md ⭐    # Visual diagrams
```

---

## Deployment Flow

```
Development
    │
    ├─► Local Testing
    │   ├─ Chrome DevTools (Mobile Emulation)
    │   └─ Real Device Testing
    │
    ▼
Staging
    │
    ├─► QA Testing
    │   ├─ Multiple Devices
    │   └─ Multiple Browsers
    │
    ▼
Production
    │
    ├─► Build Optimization
    │   ├─ npm run build
    │   ├─ Gzip compression
    │   └─ CDN deployment
    │
    ▼
Monitoring
    ├─ Performance metrics
    ├─ Error tracking
    └─ User analytics (optional)
```

---

This architecture enables a seamless, responsive experience across all devices while maintaining code simplicity and performance.
