"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Move3d, Maximize2, RefreshCw, Layers, Eye, 
  Copy, Scissors, Undo, Redo, Paintbrush, Eraser, 
  Hand, ZoomIn, ClipboardCopy, ClipboardPaste, 
  MonitorSmartphone, MousePointer, SwatchBook, Info
} from 'lucide-react';

// Custom hook for managing tooltip visibility
const useTooltipVisibility = () => {
  const [hasSeenTooltip, setHasSeenTooltip] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasSeenModifierTooltip') === 'true';
    }
    return false;
  });

  const markTooltipAsSeen = () => {
    setHasSeenTooltip(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenModifierTooltip', 'true');
    }
  };

  return { hasSeenTooltip, markTooltipAsSeen };
};

// Custom hook for intersection observer
const useIntersectionObserver = (callback, options = {}) => {
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [callback, options]);

  return targetRef;
};

// Animated button component for modifier expansion
const AnimatedExpandButton = ({ isExpanded, onClick, showAnimation }) => {
  return (
    <TooltipProvider>
      <Tooltip open={showAnimation}>
        <TooltipTrigger asChild>
          <button 
            className={`
              text-gray-400 hover:text-gray-600 
              transition-all duration-300
              ${showAnimation ? 'animate-bounce' : ''}
              relative
              ${isExpanded ? 'rotate-180' : ''}
            `}
            onClick={onClick}
            aria-label="Toggle modifiers"
          >
            <RefreshCw className="w-4 h-4" />
            {showAnimation && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top"
          className="bg-blue-600 text-white p-2 rounded shadow-lg"
        >
          <p>Click to see modifier keys!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// KeyCombo component - Renders keyboard shortcut combinations
const KeyCombo = ({ keys, isMac }) => (
  <span className="inline-flex items-center gap-1">
    {keys.map((key, i) => {
      const macKey = key === 'Ctrl' ? '⌘' : 
                    key === 'Alt' ? '⌥' :
                    key === 'Shift' ? '⇧' : key;
      
      return (
        <React.Fragment key={i}>
          <kbd className="px-2 py-1 text-sm font-semibold bg-gray-100 border border-gray-300 rounded shadow-sm">
            {isMac ? macKey : key}
          </kbd>
          {i < keys.length - 1 && <span>+</span>}
        </React.Fragment>
      );
    })}
  </span>
);

// ModifierHint component - Shows additional modifier key information
const ModifierHint = ({ modifiers, isMac }) => (
  <div className="text-sm text-gray-500">
    <p className="font-medium text-gray-700 mb-2">Modifier Keys:</p>
    <ul className="space-y-2">
      {modifiers.map((mod, index) => (
        <li key={index} className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-1">
            <KeyCombo 
              keys={Array.isArray(mod.key) ? mod.key : [mod.key]} 
              isMac={isMac} 
            />
          </div>
          <span className="flex-1 leading-relaxed">{mod.description}</span>
        </li>
      ))}
    </ul>
  </div>
);

// ShortcutCard component - Individual shortcut card with expandable modifier hints
const ShortcutCard = ({ title, shortcut, description, icon: Icon, modifiers, isMac }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { hasSeenTooltip, markTooltipAsSeen } = useTooltipVisibility();
  
  // Intersection observer to trigger tooltip animation
  const observerCallback = () => {
    if (!hasSeenTooltip && modifiers) {
      setShowTooltip(true);
      // Auto-hide tooltip after 5 seconds
      setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
    }
  };

  const targetRef = useIntersectionObserver(observerCallback, {
    threshold: 0.5,
    triggerOnce: true
  });

  const handleModifierClick = () => {
    setIsExpanded(!isExpanded);
    if (showTooltip) {
      setShowTooltip(false);
      markTooltipAsSeen();
    }
  };
  
  return (
    <Card 
      ref={targetRef}
      className={`transition-all duration-200 ${isHovered ? 'shadow-lg' : 'shadow'} ${modifiers ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => modifiers && handleModifierClick()}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg transition-colors ${isHovered ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Icon className={`w-6 h-6 transition-colors ${isHovered ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-lg truncate">{title}</h3>
              {modifiers && (
                <AnimatedExpandButton 
                  isExpanded={isExpanded}
                  onClick={handleModifierClick}
                  showAnimation={showTooltip}
                />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <KeyCombo keys={shortcut} isMac={isMac} />
              {shortcut.length > 1 && (
                <span className="text-xs text-gray-500"></span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
            {modifiers && isExpanded && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <ModifierHint modifiers={modifiers} isMac={isMac} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ShortcutSection component - Groups related shortcuts together
const ShortcutSection = ({ title, shortcuts, isMac, columns = 2 }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    <div className={`grid gap-4 grid-cols-1 md:grid-cols-${columns}`}>
      {shortcuts.map((shortcut, index) => (
        <ShortcutCard key={index} {...shortcut} isMac={isMac} />
      ))}
    </div>
  </div>
);

// OSToggle component - Toggles between Mac and Windows shortcuts
const OSToggle = ({ isMac, setIsMac }) => (
  <button
    onClick={() => setIsMac(!isMac)}
    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
  >
    <MonitorSmartphone className="w-5 h-5" />
    <span className="font-medium">
      {isMac ? 'Show Windows Keys' : 'Show Mac Keys'}
    </span>
  </button>
);

// Main PhotoshopCheatsheet component
const PhotoshopCheatsheet = () => {
  const [isMac, setIsMac] = useState(false);

  // Shortcut data organized by category
  const essentialNavigation = [
    {
      title: "Pan Around Canvas",
      shortcut: ["Space"],
      description: "Hold spacebar and click + drag to pan around the canvas. Double-click Hand tool to fit to screen.",
      icon: Hand
    },
    {
      title: "Zoom In/Out",
      shortcut: ["Ctrl", "Scroll"],
      description: "Use Ctrl + Mouse Wheel or Ctrl + [+]/[-] to zoom. Ctrl + 0 fits to screen, Ctrl + 1 for 100%",
      icon: ZoomIn
    },
    {
      title: "Zoom to Fit",
      shortcut: ["Ctrl", "0"],
      description: "Fit the entire canvas to your screen. Ctrl + 1 returns to 100% zoom",
      icon: Maximize2
    },
    {
      title: "Select All",
      shortcut: ["Ctrl", "A"],
      description: "Select everything on the current layer. Double-click for all layers",
      icon: MousePointer
    },
    {
      title: "Deselect",
      shortcut: ["Ctrl", "D"],
      description: "Clear any active selection. Use Ctrl + Shift + D to reselect",
      icon: MousePointer
    },
    {
      title: "Swap Colors",
      shortcut: ["X"],
      description: "Swap between primary and secondary colors. Press D to reset to black/white",
      icon: SwatchBook
    }
  ];

  const quickTools = [
    {
      title: "Brush Tool",
      shortcut: ["B"],
      description: "Switch to Brush. [ or ] to resize, Shift + [ or ] for hardness. Hold Shift for straight lines",
      icon: Paintbrush
    },
    {
      title: "Eraser Tool",
      shortcut: ["E"],
      description: "Switch to Eraser. [ or ] to resize, Shift + [ or ] for hardness. Hold Shift for straight erasing",
      icon: Eraser
    },
    {
      title: "Move Tool",
      shortcut: ["V"],
      description: "Switch to Move tool. Hold Shift to constrain movement to 45° angles",
      icon: Hand
    },
    {
      title: "Color Picker",
      shortcut: ["Alt"],
      description: "Hold Alt to temporarily switch to Color Picker with any tool",
      icon: SwatchBook
    },
    {
      title: "Brush Size",
      shortcut: ["[", "]"],
      description: "[ decreases and ] increases brush size. Add Shift to adjust hardness",
      icon: Paintbrush
    },
    {
      title: "Default Colors",
      shortcut: ["D"],
      description: "Reset colors to black and white. Press X to swap between them",
      icon: SwatchBook
    }
  ];

  const clipboardOperations = [
    {
      title: "Copy",
      shortcut: ["Ctrl", "C"],
      description: "Copy selected area or layer. Works with multiple selected layers",
      icon: ClipboardCopy
    },
    {
      title: "Cut",
      shortcut: ["Ctrl", "X"],
      description: "Cut selection to clipboard. Removes content from current layer",
      icon: Scissors
    },
    {
      title: "Paste",
      shortcut: ["Ctrl", "V"],
      description: "Paste as new layer. Content centers in view by default",
      icon: ClipboardPaste
    },
    {
      title: "Copy Merged",
      shortcut: ["Ctrl", "Shift", "C"],
      description: "Copy combined visible content from all layers",
      icon: Layers
    },
    {
      title: "Paste in Place",
      shortcut: ["Ctrl", "Shift", "V"],
      description: "Paste content exactly where it was copied from",
      icon: ClipboardPaste
    },
    {
      title: "Paste Special",
      shortcut: ["Ctrl", "Alt", "V"],
      description: "Opens paste options dialog for more control",
      icon: ClipboardPaste
    }
  ];

  const layerOperations = [
    {
      title: "New Layer",
      shortcut: ["Ctrl", "Shift", "N"],
      description: "Create new layer. Hold Alt for options dialog",
      icon: Layers
    },
    {
      title: "Duplicate Layer",
      shortcut: ["Ctrl", "J"],
      description: "Duplicate selected layer or selection to new layer",
      icon: Copy
    },
    {
      title: "Delete Layer",
      shortcut: ["Delete"],
      description: "Delete selected layer(s). Hold Alt to skip confirmation",
      icon: Scissors
    },
    {
      title: "Merge Layers",
      shortcut: ["Ctrl", "E"],
      description: "Merge selected layers. Ctrl+Shift+E merges all visible",
      icon: Layers
    },
    {
      title: "Layer Opacity",
      shortcut: ["0-9"],
      description: "Quick opacity: 0 = 0%, 1 = 10%, 9 = 90%, 0 = 100%",
      icon: Eye
    }
  ];

  const viewControls = [
    {
      title: "Full Screen",
      shortcut: ["F"],
      description: "Cycle through screen modes. Press Tab to hide panels",
      icon: Maximize2
    },
    {
      title: "Hide Panels",
      shortcut: ["Tab"],
      description: "Toggle all panels. Shift+Tab keeps toolbar visible",
      icon: MonitorSmartphone
    },
    {
      title: "Actual Pixels",
      shortcut: ["Ctrl", "1"],
      description: "View at 100% zoom. Double-click Zoom tool for same",
      icon: ZoomIn
    },
    {
      title: "Screen Modes",
      shortcut: ["F"],
      description: "Cycle through: Standard, Full with Menu, Full Screen",
      icon: Maximize2
    }
  ];

  const toolModifiers = [
    {
      title: "Brush Modifiers",
      shortcut: ["Alt"],
      description: "Hold Alt for color picker, Shift for straight lines",
      icon: Paintbrush,
      modifiers: [
        { key: "Shift", description: "Draw straight lines" },
        { key: "Alt", description: "Sample color" },
        { key: "[/]", description: "Size adjustment" }
      ]
    },
    {
      title: "Selection Modifiers",
      shortcut: ["Shift"],
      description: "Hold Shift to add, Alt to subtract from selection",
      icon: MousePointer,
      modifiers: [
        { key: "Shift", description: "Add to selection" },
        { key: "Alt", description: "Subtract from selection" },
        { key: "Shift+Alt", description: "Intersect with selection" }
      ]
    },
    {
      title: "Transform Modifiers",
      shortcut: ["Ctrl", "T"],
      description: "Free transform with modifiers for precise control",
      icon: Move3d,
      modifiers: [
        { key: "Shift", description: "Maintain aspect ratio" },
        { key: "Alt", description: "Transform from center" },
        { key: "Ctrl", description: "Distort/perspective" }
      ]
    }
  ];

  const undoRedo = [
    {
      title: "Undo",
      shortcut: ["Ctrl", "Z"],
      description: "Undo the last action",
      icon: Undo
    },
    {
      title: "Redo",
      shortcut: ["Ctrl", "Shift", "Z"],
      description: "Redo the last undone action",
      icon: Redo
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Photoshop Essential Shortcuts</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Quick reference for common Photoshop operations</p>
          </div>
          <OSToggle isMac={isMac} setIsMac={setIsMac} />
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column - Primary Tools */}
        <div className="space-y-8">
          <ShortcutSection 
            title="Essential Navigation" 
            shortcuts={essentialNavigation} 
            isMac={isMac} 
            columns={2} 
          />
          <ShortcutSection 
            title="Quick Tools" 
            shortcuts={quickTools} 
            isMac={isMac} 
            columns={2} 
          />
          <ShortcutSection 
            title="Tool Modifiers" 
            shortcuts={toolModifiers} 
            isMac={isMac} 
            columns={1} 
          />
          <ShortcutSection 
            title="View Controls" 
            shortcuts={viewControls} 
            isMac={isMac} 
            columns={2} 
          />
        </div>
        
        {/* Right Column - Operations */}
        <div className="space-y-8">
          <ShortcutSection 
            title="Layer Operations" 
            shortcuts={layerOperations} 
            isMac={isMac} 
            columns={2} 
          />
          <ShortcutSection 
            title="Clipboard Operations" 
            shortcuts={clipboardOperations} 
            isMac={isMac} 
            columns={2} 
          />
          <ShortcutSection 
            title="Undo/Redo" 
            shortcuts={undoRedo} 
            isMac={isMac} 
            columns={2} 
          />
        </div>
      </div>
      
      {/* Pro Tips Section */}
      <div className="mt-8 border-t pt-8">
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">Pro Tips</h3>
                <ul className="mt-2 space-y-2 text-sm text-blue-800">
                  <li>• Hold Shift while using any tool to constrain to straight lines or 45° angles</li>
                  <li>• Ctrl-click layer thumbnail to select all non-transparent pixels</li>
                  <li>• Hold Space while using any tool to temporarily switch to Hand tool</li>
                  <li>• Right-click while transforming for additional options</li>
                  <li>• Hold Alt + Ctrl + Rightclick-Drag left/right to adjust brush size without opening the brush panel</li>
                  <li>• Hold Alt + Ctrl + Rightclick-Drag up/down to adjust brush hardness</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhotoshopCheatsheet