# Integration Guide: Adding Mobile Support to WorkflowApp

This guide shows how to integrate the mobile enhancements into your existing `WorkflowApp.jsx` component.

## Step 1: Import Mobile Components

Add these imports at the top of your `WorkflowApp.jsx`:

```javascript
import { BottomSheetActionPanel, OutlineBoardView } from './MobileComponents';
import { List, Maximize2 } from 'lucide-react'; // Add to existing lucide imports
```

## Step 2: Add State Management

Add these new state variables after your existing state declarations:

```javascript
// View mode toggle (canvas vs outline)
const [viewMode, setViewMode] = useState('canvas');

// Bottom sheet for mobile
const [bottomSheet, setBottomSheet] = useState(null);

// Touch gesture states
const [touchStart, setTouchStart] = useState(null);
const [touchDistance, setTouchDistance] = useState(null);
const [initialPinchScale, setInitialPinchScale] = useState(1);
```

## Step 3: Add Touch Event Handlers

Add these handler functions before your return statement:

```javascript
// Detect if device is mobile
const isMobile = () => window.innerWidth < 768;

// Handle touch start for pinch-to-zoom
const handleTouchStart = useCallback((e) => {
  if (e.touches.length === 2) {
    // Two-finger pinch zoom
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    setTouchDistance(dist);
    setInitialPinchScale(transform.scale);
  } else if (e.touches.length === 1) {
    // Single-finger pan
    const isClickBg = e.target === workspaceRef.current || 
                      e.target.classList.contains('canvas-grid-clickable');
    if (isClickBg) {
      setIsPanning(true);
      setPanStart({
        x: e.touches[0].clientX - transform.x,
        y: e.touches[0].clientY - transform.y
      });
    }
  }
}, [transform]);

// Handle touch move for gestures
const handleTouchMove = useCallback((e) => {
  if (e.touches.length === 2 && touchDistance) {
    // Pinch zoom
    e.preventDefault();
    const newDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const scaleChange = newDist / touchDistance;
    const newScale = Math.max(0.2, Math.min(3, initialPinchScale * scaleChange));
    
    // Calculate zoom center point
    const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    
    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    const mouseX = centerX - rect.left;
    const mouseY = centerY - rect.top;
    
    const scaleFactor = newScale / transform.scale;
    
    setTransform({
      scale: newScale,
      x: mouseX - scaleFactor * (mouseX - transform.x),
      y: mouseY - scaleFactor * (mouseY - transform.y)
    });
  } else if (e.touches.length === 1 && isPanning) {
    // Pan
    e.preventDefault();
    setTransform(prev => ({
      ...prev,
      x: e.touches[0].clientX - panStart.x,
      y: e.touches[0].clientY - panStart.y
    }));
  }
}, [touchDistance, initialPinchScale, isPanning, panStart, transform]);

// Handle touch end
const handleTouchEnd = useCallback(() => {
  setIsPanning(false);
  setTouchDistance(null);
}, []);

// Handle node tap on mobile
const handleNodeTapMobile = useCallback((e, nodeId) => {
  e.stopPropagation();
  if (isMobile()) {
    setBottomSheet({ nodeId });
  }
}, []);
```

## Step 4: Modify Main Canvas Element

Update your main workspace element to include touch handlers:

```javascript
<main
  ref={workspaceRef}
  className="flex-1 relative overflow-hidden bg-[#fafafa] touch-none text-slate-800"
  onPointerDown={handlePointerDownMain}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  onPointerLeave={handlePointerUp}
  onWheel={handleWheel}
  onContextMenu={handleContextMenu}
  // Add touch handlers
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  style={{ touchAction: 'none' }} // Prevent default touch behaviors
>
```

## Step 5: Add View Mode Toggle to Header

Add this button to your header toolbar (after the sidebar toggle):

```javascript
<div className="flex items-center bg-slate-100 rounded-lg p-1 ml-2">
  <button
    onClick={() => setViewMode('canvas')}
    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
      viewMode === 'canvas'
        ? 'bg-white shadow-sm text-indigo-600'
        : 'text-slate-600 hover:text-slate-800'
    }`}
    title="Canvas View"
  >
    <Maximize2 className="w-4 h-4 inline mr-1" />
    Canvas
  </button>
  <button
    onClick={() => setViewMode('outline')}
    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
      viewMode === 'outline'
        ? 'bg-white shadow-sm text-indigo-600'
        : 'text-slate-600 hover:text-slate-800'
    }`}
    title="Outline Board"
  >
    <List className="w-4 h-4 inline mr-1" />
    Outline
  </button>
</div>
```

## Step 6: Modify Node Click Handler

Update each node's `onContextMenu` to also handle mobile taps:

```javascript
<div
  key={node.id}
  className={`absolute rounded-xl border w-[${NODE_WIDTH}px] ...`}
  onClick={(e) => handleNodeTapMobile(e, node.id)} // Add this
  onContextMenu={(e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMobile()) {
      // Mobile: open bottom sheet
      setBottomSheet({ nodeId: node.id });
    } else {
      // Desktop: open context menu
      const rect = workspaceRef.current.getBoundingClientRect();
      setNodeContextMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        nodeId: node.id
      });
      setContextMenu(null);
    }
  }}
  // ... rest of node props
>
```

## Step 7: Conditional Rendering Based on View Mode

Replace your main workspace content area with:

```javascript
{/* Main Workspace Content Area */}
<main className="flex-1 flex overflow-hidden w-full relative">
  
  {/* Existing Sidebar */}
  {showSidebar && (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-40 animate-in slide-in-from-left duration-200">
      {/* ... existing sidebar content ... */}
    </aside>
  )}

  {/* Conditional View Rendering */}
  {viewMode === 'canvas' ? (
    // Existing canvas view
    <main
      ref={workspaceRef}
      // ... all existing canvas props and content ...
    >
      {/* ... existing canvas content ... */}
    </main>
  ) : (
    // New outline board view
    <OutlineBoardView
      workspace={activeWs}
      groups={groups}
      nodes={nodes}
      themes={THEMES}
      onUpdateNode={updateNode}
      onUpdateGroup={updateGroup}
      onDeleteNode={deleteNode}
      onDeleteGroup={deleteGroup}
      onAddNode={addNode}
      takeSnapshot={takeSnapshot}
    />
  )}
</main>
```

## Step 8: Add Bottom Sheet Component

Before the closing `</div>` of your main app container, add:

```javascript
{/* Mobile Bottom Sheet */}
{bottomSheet && isMobile() && (
  <BottomSheetActionPanel
    nodeId={bottomSheet.nodeId}
    node={nodes.find(n => n.id === bottomSheet.nodeId)}
    themes={THEMES}
    onClose={() => setBottomSheet(null)}
    onBringToFront={bringToFront}
    onSendToBack={sendToBack}
    onDuplicate={duplicateNode}
    onDisconnect={disconnectNodeLinks}
    onDelete={deleteNode}
    onThemeChange={(nodeId, theme) => {
      takeSnapshot();
      updateNode(nodeId, { theme });
    }}
  />
)}
```

## Step 9: Add Mobile-Specific CSS

Add these styles to your existing `<style>` tag:

```css
/* Touch target sizing for mobile */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}

/* Prevent bounce/zoom on touch */
body {
  overscroll-behavior: none;
  -webkit-user-select: none;
  user-select: none;
}

/* Bottom sheet animations */
@keyframes slide-in-from-bottom {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* Mobile viewport adjustments */
@media (max-width: 768px) {
  /* Hide desktop-only elements */
  .desktop-only {
    display: none !important;
  }
  
  /* Adjust header for mobile */
  header {
    padding: 0.75rem 1rem;
  }
  
  /* Stack header items on mobile */
  header > div {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  /* Make buttons touch-friendly */
  button {
    min-width: 44px;
    min-height: 44px;
  }
}

/* Tablet adjustments */
@media (max-width: 1024px) and (min-width: 769px) {
  aside {
    width: 16rem; /* Narrower sidebar on tablet */
  }
}
```

## Step 10: Test Mobile Functionality

1. **Test on Desktop**:
   - Canvas view should work as before
   - Outline view should display structured list
   - View toggle should switch between modes

2. **Test on Mobile** (use Chrome DevTools mobile emulation):
   - Pinch-to-zoom should work smoothly
   - Single-finger pan should navigate canvas
   - Tapping a node should open bottom sheet
   - Outline view should be fully functional
   - All touch targets should be at least 44x44px

3. **Test Responsive Breakpoints**:
   - Mobile (<640px): Outline view recommended
   - Tablet (640-1024px): Both views usable
   - Desktop (>1024px): Full canvas experience

## Troubleshooting

### Issue: Touch events not working
**Solution**: Ensure `touch-action: none` is set on the canvas element and body has `overscroll-behavior: none`.

### Issue: Bottom sheet not appearing
**Solution**: Check z-index values and ensure backdrop is clickable. The sheet should have `z-index: 160`.

### Issue: Pinch zoom too sensitive
**Solution**: Add a threshold or damping to the scale calculation:
```javascript
const damping = 0.5;
const newScale = Math.max(0.2, Math.min(3, initialPinchScale * (1 + (scaleChange - 1) * damping)));
```

### Issue: Outline view changes not syncing
**Solution**: Ensure all `onUpdate*` functions properly call the parent state setters and `computeLayout` for groups.

## Additional Enhancements

### Add Haptic Feedback (iOS/Android)
```javascript
const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10); // Short 10ms vibration
  }
};

// Call on node tap, delete, etc.
```

### Add Swipe Gestures for Undo/Redo
```javascript
const handleSwipe = (direction) => {
  if (direction === 'left') performUndo();
  if (direction === 'right') performRedo();
};
```

### Progressive Web App (PWA) Support
Add a `manifest.json` and service worker for offline functionality and app-like experience on mobile.

## Performance Tips

1. Use `React.memo()` for node and group components
2. Virtualize long lists in Outline view
3. Debounce text input handlers
4. Use CSS transforms instead of top/left for animations
5. Lazy load images in nodes

## Browser Testing Checklist

- [ ] iOS Safari (iPhone & iPad)
- [ ] Chrome Mobile (Android)
- [ ] Samsung Internet Browser
- [ ] Firefox Mobile
- [ ] Desktop browsers still work

## Next Steps

After integration, consider adding:
- Gesture-based multi-select
- Voice input for task creation
- Offline sync with localStorage
- Export to PDF/Image
- Collaborative real-time editing
