import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Plus, Trash2, GripHorizontal, X, ChevronDown, ChevronRight, 
  FileText, Network, FolderOpen, Palette, Check, ZoomIn, ZoomOut, Focus,
  Download, Upload, Undo2, Redo2, Layers, Link2, ExternalLink, HelpCircle,
  Sparkles, CheckSquare, Clock, AlertCircle, BarChart2, PanelLeftClose, PanelLeft,
  Grid, Move, Copy, ArrowUp, ArrowDown, RefreshCw, List, Maximize2
} from 'lucide-react';

// --- Premium Color Themes ---
const THEMES = {
  amber: { 
    name: 'Amber Glow', 
    wrapper: 'bg-[#fdfbf7] border-amber-200/80 hover:border-amber-400/50', 
    header: 'bg-[#fffbeb] border-amber-200', 
    tag: 'bg-amber-100/80 border-amber-300 text-amber-800', 
    port: 'bg-amber-500 hover:bg-amber-400 border-amber-100', 
    text: 'text-amber-900', 
    line: '#f59e0b',
    groupBg: 'bg-amber-50/10 border-amber-300/40', 
    groupHeader: 'bg-amber-100/40 border-amber-200/50',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]'
  },
  blue: { 
    name: 'Ocean Blue', 
    wrapper: 'bg-slate-50 border-blue-200/80 hover:border-blue-400/50', 
    header: 'bg-blue-50/80 border-blue-200', 
    tag: 'bg-blue-100/80 border-blue-300 text-blue-800', 
    port: 'bg-blue-500 hover:bg-blue-400 border-blue-100', 
    text: 'text-blue-900', 
    line: '#3b82f6',
    groupBg: 'bg-blue-50/10 border-blue-300/40', 
    groupHeader: 'bg-blue-100/40 border-blue-200/50',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]'
  },
  emerald: { 
    name: 'Mint Emerald', 
    wrapper: 'bg-emerald-50/20 border-emerald-200/80 hover:border-emerald-400/50', 
    header: 'bg-emerald-50/80 border-emerald-200', 
    tag: 'bg-emerald-100/80 border-emerald-300 text-emerald-800', 
    port: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-100', 
    text: 'text-emerald-900', 
    line: '#10b981',
    groupBg: 'bg-emerald-50/10 border-emerald-300/40', 
    groupHeader: 'bg-emerald-100/40 border-emerald-200/50',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]'
  },
  purple: { 
    name: 'Royal Purple', 

    wrapper: 'bg-purple-50/20 border-purple-200/80 hover:border-purple-400/50', 
    header: 'bg-purple-50/80 border-purple-200', 
    tag: 'bg-purple-100/80 border-purple-300 text-purple-800', 
    port: 'bg-purple-500 hover:bg-purple-400 border-purple-100', 
    text: 'text-purple-900', 
    line: '#8b5cf6',
    groupBg: 'bg-purple-50/10 border-purple-300/40', 
    groupHeader: 'bg-purple-100/40 border-purple-200/50',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]'
  },
  rose: { 
    name: 'Blush Rose', 
    wrapper: 'bg-rose-50/20 border-rose-200/80 hover:border-rose-400/50', 
    header: 'bg-rose-50/80 border-rose-200', 
    tag: 'bg-rose-100/80 border-rose-300 text-rose-800', 
    port: 'bg-rose-500 hover:bg-rose-400 border-rose-100', 
    text: 'text-rose-900', 
    line: '#f43f5e',
    groupBg: 'bg-rose-50/10 border-rose-300/40', 
    groupHeader: 'bg-rose-100/40 border-rose-200/50',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]'
  }
};

const defaultWorkspaces = [
  {
    id: 'ws-1', name: 'Product Launch Roadmap',
    groups: [
      { id: 'g-1', name: 'Phase 1: Discovery & Research', x: 80, y: 80, width: 440, height: 440, expanded: true, theme: 'amber', parentGroupId: null },
      { id: 'g-2', name: 'Phase 2: Product Design UI', x: 580, y: 80, width: 440, height: 440, expanded: true, theme: 'purple', parentGroupId: null }
    ],
    nodes: [
      { id: '1', x: 130, y: 150, title: 'User Interviews', content: 'Synthesize feedback from 15 target users.', expanded: true, theme: 'amber', groupId: 'g-1', status: 'In Progress', priority: 'High' },
      { id: '2', x: 130, y: 310, title: 'Competitor Benchmark', content: 'Benchmark workflows against Top 3 competitors.', expanded: true, theme: 'blue', groupId: 'g-1', status: 'Todo', priority: 'Medium' },
      { id: '3', x: 630, y: 150, title: 'Component Library', content: 'Establish design system in Figma.', expanded: true, theme: 'purple', groupId: 'g-2', status: 'In Progress', priority: 'High' },
      { id: '4', x: 1100, y: 200, title: 'Launch Strategy Plan', content: 'Define GTM parameters.', expanded: true, theme: 'rose', groupId: null, status: 'Todo', priority: 'Low' }
    ],
    edges: [
      { id: 'e1', source: '1', target: '3' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' }
    ]
  }
];

