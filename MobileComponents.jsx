import React from 'react';
import { 
  X, ArrowUp, ArrowDown, Copy, Link2, Trash2, Palette, Check
} from 'lucide-react';

/**
 * Bottom Sheet Action Panel for Mobile
 * Slides up from bottom when user taps a node on mobile devices
 */
export function BottomSheetActionPanel({ 
  nodeId, 
  node, 
  themes, 
  onClose, 
  onBringToFront, 
  onSendToBack, 
  onDuplicate, 
  onDisconnect, 
  onDelete, 
  onThemeChange 
}) {
  const [showThemePicker, setShowThemePicker] = React.useState(false);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-[150] animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[160] animate-in slide-in-from-bottom duration-300 max-h-[70vh] overflow-y-auto">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-800">{node?.title || 'Task Node'}</h3>
              <p className="text-xs text-slate-500 mt-0.5">ID: {nodeId}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="p-6 space-y-3">
          {/* Layer Controls */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onBringToFront(nodeId);
                onClose();
              }}
              className="flex flex-col items-center gap-2 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors touch-target"
            >
              <ArrowUp className="w-6 h-6 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-900">Bring to Front</span>
            </button>
            
            <button
              onClick={() => {
                onSendToBack(nodeId);
                onClose();
              }}
              className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors touch-target"
            >
              <ArrowDown className="w-6 h-6 text-slate-600" />
              <span className="text-sm font-semibold text-slate-700">Send to Back</span>
            </button>
          </div>

          {/* Content Actions */}
          <button
            onClick={() => {
              onDuplicate(nodeId);
              onClose();
            }}
            className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors touch-target"
          >
            <Copy className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">Duplicate Card</span>
          </button>

          <button
            onClick={() => {
              onDisconnect(nodeId);
              onClose();
            }}
            className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors touch-target"
          >
            <Link2 className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">Break All Connections</span>
          </button>

          {/* Theme Picker */}
          <div>
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors touch-target"
            >
              <Palette className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-semibold text-slate-700">Change Theme</span>
            </button>
            
            {showThemePicker && (
              <div className="mt-3 grid grid-cols-5 gap-3 p-4 bg-slate-50 rounded-xl">
                {Object.keys(themes).map(themeKey => (
                  <button
                    key={themeKey}
                    onClick={() => {
                      onThemeChange(nodeId, themeKey);
                      onClose();
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all hover:scale-110 ${themes[themeKey].port} ${
                      node?.theme === themeKey ? 'border-white ring-2 ring-indigo-500' : 'border-transparent'
                    }`}
                  >
                    {node?.theme === themeKey && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="pt-3 border-t border-slate-200">
            <button
              onClick={() => {
                if (window.confirm('Delete this card permanently?')) {
                  onDelete(nodeId);
                  onClose();
                }
              }}
              className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors touch-target"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold text-red-700">Delete Card</span>
            </button>
          </div>
        </div>

        {/* Safe Area Bottom Padding */}
        <div className="h-8" />
      </div>
    </>
  );
}

/**
 * Outline Board View - Mobile-Optimized Structured List
 * Perfect for mobile project management without complex canvas interactions
 */
export function OutlineBoardView({ 
  workspace, 
  groups, 
  nodes, 
  themes,
  onUpdateNode, 
  onUpdateGroup, 
  onDeleteNode, 
  onDeleteGroup,
  onAddNode,
  takeSnapshot
}) {
  const [expandedGroups, setExpandedGroups] = React.useState(
    groups.reduce((acc, g) => ({ ...acc, [g.id]: true }), {})
  );

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const renderNode = (node) => {
    const theme = themes[node.theme] || themes.amber;
    
    return (
      <div
        key={node.id}
        className={`p-4 rounded-xl border-2 mb-3 ${theme.wrapper}`}
      >
        {/* Node Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <input
            className="flex-1 font-bold text-base bg-transparent focus:outline-none focus:bg-white/50 rounded px-2 py-1"
            value={node.title || ''}
            onChange={(e) => {
              takeSnapshot();
              onUpdateNode(node.id, { title: e.target.value });
            }}
            placeholder="Task title..."
          />
          <button
            onClick={() => {
              if (window.confirm('Delete this task?')) {
                takeSnapshot();
                onDeleteNode(node.id);
              }
            }}
            className="p-2 hover:bg-red-50 rounded-lg text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Status & Priority */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Status</label>
            <select
              className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 font-semibold"
              value={node.status || 'Todo'}
              onChange={(e) => {
                takeSnapshot();
                onUpdateNode(node.id, { status: e.target.value });
              }}
            >
              <option value="Todo">📌 Todo</option>
              <option value="In Progress">⚡ In Progress</option>
              <option value="Done">✅ Done</option>
              <option value="Milestone">🏁 Milestone</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Priority</label>
            <select
              className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 font-semibold"
              value={node.priority || 'Medium'}
              onChange={(e) => {
                takeSnapshot();
                onUpdateNode(node.id, { priority: e.target.value });
              }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">🔥 High</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <textarea
          className="w-full text-sm bg-white/50 border border-slate-200 rounded-lg px-3 py-2 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={node.content || ''}
          onChange={(e) => {
            onUpdateNode(node.id, { content: e.target.value });
          }}
          onBlur={takeSnapshot}
          placeholder="Task description..."
        />
      </div>
    );
  };

  const renderGroup = (group, level = 0) => {
    const theme = themes[group.theme] || themes.amber;
    const isExpanded = expandedGroups[group.id];
    const childGroups = groups.filter(g => g.parentGroupId === group.id);
    const childNodes = nodes.filter(n => n.groupId === group.id);

    return (
      <div key={group.id} className="mb-4" style={{ marginLeft: level * 16 }}>
        {/* Group Header */}
        <div className={`p-4 rounded-xl border-2 ${theme.groupBg} ${theme.groupHeader} mb-2`}>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => toggleGroup(group.id)}
              className="p-1 hover:bg-white/50 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            
            <input
              className={`flex-1 font-bold text-sm bg-transparent focus:outline-none focus:bg-white/50 rounded px-2 py-1 ${theme.text}`}
              value={group.name || ''}
              onChange={(e) => {
                takeSnapshot();
                onUpdateGroup(group.id, { name: e.target.value });
              }}
            />
            
            <span className="text-xs text-slate-500 font-semibold px-2 py-1 bg-white/50 rounded">
              {childNodes.length + childGroups.length} items
            </span>
            
            <button
              onClick={() => {
                if (window.confirm('Delete this group?')) {
                  takeSnapshot();
                  onDeleteGroup(group.id);
                }
              }}
              className="p-1 hover:bg-red-50 rounded text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Group Contents */}
        {isExpanded && (
          <div className="ml-4 space-y-2">
            {/* Child Groups (Subgroups) */}
            {childGroups.map(sg => renderGroup(sg, level + 1))}
            
            {/* Child Nodes */}
            {childNodes.map(node => renderNode(node))}
            
            {/* Add Node Button */}
            <button
              onClick={() => onAddNode(undefined, undefined, group.id)}
              className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-xl text-sm font-semibold text-indigo-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Task to {group.name}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Root groups (no parent)
  const rootGroups = groups.filter(g => !g.parentGroupId);
  
  // Unassigned nodes (no group)
  const unassignedNodes = nodes.filter(n => !n.groupId);

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <List className="w-6 h-6 text-indigo-600" />
          Outline Board View
        </h2>

        {/* Render Groups */}
        {rootGroups.map(group => renderGroup(group, 0))}

        {/* Unassigned Tasks Section */}
        {unassignedNodes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              📋 Unassigned Tasks
            </h3>
            {unassignedNodes.map(node => renderNode(node))}
          </div>
        )}

        {/* Empty State */}
        {nodes.length === 0 && groups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No tasks or groups yet</p>
            <p className="text-slate-400 text-xs mt-1">Switch to Canvas view to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
