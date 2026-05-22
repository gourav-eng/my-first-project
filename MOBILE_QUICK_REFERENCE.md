# Mobile Quick Reference Card

## 📱 Touch Gestures (Canvas View)

| Gesture | Action |
|---------|--------|
| **Pinch (two fingers)** | Zoom in/out |
| **Single-finger drag** | Pan canvas |
| **Tap node** | Open action bottom sheet |
| **Long press node** | Start dragging (optional) |
| **Double tap** | Reset zoom to 100% |

## 🎯 Bottom Sheet Actions

When you tap a node on mobile, a bottom sheet slides up with these actions:

- **Bring to Front**: Move node above all others
- **Send to Back**: Move node below all others  
- **Duplicate Card**: Create a copy of the node
- **Break All Connections**: Remove all edges to/from this node
- **Change Theme**: Pick a color theme
- **Delete Card**: Permanently remove the node

## 📋 Outline Board View

Perfect for mobile editing! Switch to Outline view from the header toggle.

**Features:**
- Hierarchical list of all groups and tasks
- Tap to expand/collapse groups
- Inline editing of all fields
- Add tasks directly to groups
- No complex gestures needed
- Changes sync instantly to Canvas

## 🔄 View Modes

### Canvas View (Spatial)
Best for: Desktop, visualizing relationships, creative planning
- Drag-and-drop positioning
- Visual connections between nodes
- Pinch-to-zoom on mobile
- Group nesting with boundaries

### Outline Board View (Structured)
Best for: Mobile, quick updates, focused task management
- Clean hierarchical list
- Easy text editing
- Status/priority updates
- No precision dragging needed

## ⚙️ Mobile-Optimized Settings

### Recommended Settings for Mobile:
1. **Use Outline View** for editing tasks
2. **Use Canvas View** for visualizing relationships
3. **Hide sidebar** for more screen space (tap sidebar toggle)
4. **Collapse groups** you're not working on
5. **Use landscape mode** for Canvas view when possible

## 🎨 Theme Colors (Quick Access)

In bottom sheet, tap "Change Theme" to see:

| Color | Best For |
|-------|----------|
| **Amber** | Discovery, research |
| **Blue** | Development, technical |
| **Emerald** | Completed, successful |
| **Purple** | Design, creative |
| **Rose** | Marketing, outreach |

## 🚀 Quick Actions (Mobile)

### Add New Node:
1. Switch to Outline view
2. Scroll to desired group
3. Tap "Add Task to [Group]"
4. Fill in details

### Edit Node:
1. Tap node in Canvas or Outline view
2. Edit fields inline (Outline) or tap to edit (Canvas)
3. Changes auto-save

### Move Node to Group:
1. In Outline view, delete from current location
2. Add to target group
3. Or use Canvas drag-and-drop

### Connect Nodes:
1. Best done in Canvas view on desktop
2. Or add notes in Outline view mentioning dependencies

## 📊 Status & Priority Quick Reference

### Status Options:
- 📌 **Todo**: Not started
- ⚡ **In Progress**: Currently working
- ✅ **Done**: Completed
- 🏁 **Milestone**: Major checkpoint

### Priority Levels:
- **Low**: Can wait
- **Medium**: Normal priority
- 🔥 **High**: Urgent, do first

## 💡 Pro Tips for Mobile

1. **Use landscape orientation** for Canvas view with groups
2. **Portrait is perfect** for Outline Board editing
3. **Collapse groups** to reduce clutter
4. **Use search** (future feature) instead of scrolling
5. **Export regularly** to avoid losing work
6. **Pinch slowly** for precise zoom control
7. **Single-finger pan** only works on empty canvas areas
8. **Outline view syncs instantly** - edit there, visualize in Canvas

## 🔧 Troubleshooting Mobile

### Canvas won't pan:
- Make sure you're dragging on empty space (not a node)
- Try tapping once first to deselect

### Zoom feels stuck:
- Tap the "Reset View" button (compass icon)
- Or double-tap empty canvas

### Bottom sheet won't open:
- Ensure you're tapping the node header, not dragging
- Try tapping the node title text

### Text input not working:
- Switch to Outline view for easier text editing
- Canvas text editing is desktop-optimized

### Nodes disappearing:
- Check if parent group is collapsed
- Use Outline view to see all nodes regardless of canvas state

## 🌐 Browser Compatibility

| Browser | Canvas View | Outline View | Gestures |
|---------|-------------|--------------|----------|
| iOS Safari | ✅ | ✅ | ✅ |
| Chrome Mobile | ✅ | ✅ | ✅ |
| Firefox Mobile | ✅ | ✅ | ✅ |
| Samsung Internet | ✅ | ✅ | ✅ |

## 📱 Recommended Devices

- **Phone**: Use Outline view primarily
- **Tablet**: Both views work great
- **Desktop**: Full Canvas experience

## 🎯 Mobile Workflow Examples

### Morning Task Review:
1. Open app on phone
2. Switch to Outline view
3. Expand "Today" group
4. Update status of completed tasks
5. Set priorities for day

### Quick Task Addition:
1. Tap + button in header
2. Or use Outline view "Add Task" button
3. Fill in title and priority
4. Details can be added later on desktop

### Client Meeting Notes:
1. Create new group for meeting
2. Add task nodes for action items
3. Use Outline view for fast note-taking
4. Review connections later on desktop

### Sprint Planning on Tablet:
1. Use landscape Canvas view
2. Create groups for sprint phases
3. Drag tasks into groups
4. Connect dependencies visually
5. Switch to Outline for final priority review

## ⌨️ Keyboard Shortcuts (Desktop)

While this is a mobile reference, here are desktop shortcuts:

- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y`: Redo
- Right-click canvas: Context menu
- Right-click node: Node actions
- Scroll wheel: Zoom (with modifier key in future)

## 🔐 Data & Privacy

- All data stored locally in browser
- No server sync (yet)
- Export to backup your data
- Clear browser data = lose everything (export first!)

## 🆘 Need Help?

1. Check this quick reference
2. Read full documentation in MOBILE_ENHANCEMENTS.md
3. Check INTEGRATION_GUIDE.md for technical details
4. Submit issues to project repository

---

**Version**: 1.0 Mobile-Enhanced Edition  
**Last Updated**: 2026  
**Platform**: React Web App with Touch Support
