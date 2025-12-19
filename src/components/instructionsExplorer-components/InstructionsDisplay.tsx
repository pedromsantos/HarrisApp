/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
import React, { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  BarryLineInstructionDto,
  InstructionsResponse,
} from '@/types/barryHarrisInstructions';

import PathCard from './PathCard';

interface InstructionsDisplayProps {
  instructions: InstructionsResponse;
  onTogglePathSelection: (
    transitionIndex: number,
    pathId: string,
    instruction: BarryLineInstructionDto
  ) => void;
  isPathSelected: (transitionIndex: number, pathId: string) => boolean;
}

const ITEMS_PER_PAGE = 12;

const InstructionsDisplay: React.FC<InstructionsDisplayProps> = ({
  instructions,
  onTogglePathSelection,
  isPathSelected,
}) => {
  const [filterByTarget, setFilterByTarget] = useState<string>('all');
  const [searchPattern, setSearchPattern] = useState<string>('');
  const [currentPages, setCurrentPages] = useState<Record<number, number>>({});

  const getFilteredPaths = (transitionIndex: number) => {
    const transition = instructions.transitions[transitionIndex];
    if (!transition) return [];
    let filtered = transition.possible_paths;

    // Filter by target degree
    if (filterByTarget !== 'all') {
      filtered = filtered.filter((path) => path.metadata.target_degree === filterByTarget);
    }

    // Filter by pattern search
    if (searchPattern.trim()) {
      const searchLower = searchPattern.toLowerCase();
      filtered = filtered.filter((path) =>
        path.instruction.patterns.some((pattern) =>
          pattern.toLowerCase().includes(searchLower)
        )
      );
    }

    return filtered;
  };

  const getPagedPaths = (transitionIndex: number) => {
    const filtered = getFilteredPaths(transitionIndex);
    const page = currentPages[transitionIndex] ?? 0;
    const start = page * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return {
      paths: filtered.slice(start, end),
      totalPages: Math.ceil(filtered.length / ITEMS_PER_PAGE),
      currentPage: page,
      totalFiltered: filtered.length,
    };
  };

  const handlePageChange = (transitionIndex: number, newPage: number) => {
    setCurrentPages((prev) => ({ ...prev, [transitionIndex]: newPage }));
  };

  // Get available target degrees from all paths
  const availableTargets = useMemo(() => {
    const targets = new Set<string>();
    instructions.transitions.forEach((transition) => {
      transition.possible_paths.forEach((path) => {
        targets.add(path.metadata.target_degree);
      });
    });
    return Array.from(targets).sort();
  }, [instructions]);

  return (
    <div className="space-y-6">
      {/* Metadata Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Original Chords:</span>
              <p className="font-medium">{instructions.metadata.original_chords.join(' → ')}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Transitions:</span>
              <p className="font-medium">{instructions.metadata.total_transitions}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Paths:</span>
              <p className="font-medium">{instructions.metadata.total_paths}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Paths</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Degree Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Degree</label>
              <div className="flex gap-2">
                <Button
                  variant={filterByTarget === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setFilterByTarget('all');
                    setCurrentPages({});
                  }}
                >
                  All
                </Button>
                {availableTargets.map((target) => (
                  <Button
                    key={target}
                    variant={filterByTarget === target ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setFilterByTarget(target);
                      setCurrentPages({});
                    }}
                  >
                    {target}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pattern Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Patterns</label>
              <Input
                type="text"
                placeholder="e.g., ChordUp, ScaleDown..."
                value={searchPattern}
                onChange={(e) => {
                  setSearchPattern(e.target.value);
                  setCurrentPages({});
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transitions */}
      {instructions.transitions.map((transition, transitionIndex) => {
        const { paths, totalPages, currentPage, totalFiltered } = getPagedPaths(transitionIndex);

        return (
          <Card key={transitionIndex}>
            <CardHeader>
              <CardTitle className="text-lg">
                Transition {transitionIndex + 1}: {transition.from_chord} → {transition.to_chord}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {transition.from_scale.root} {transition.from_scale.pattern} →{' '}
                {transition.to_scale.root} {transition.to_scale.pattern}
              </p>
              <p className="text-xs text-muted-foreground">
                Showing {paths.length} of {totalFiltered} filtered paths ({transition.possible_paths.length} total)
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paths.map((path) => (
                  <PathCard
                    key={path.path_id}
                    path={path}
                    transitionIndex={transitionIndex}
                    isSelected={isPathSelected(transitionIndex, path.path_id)}
                    onToggleSelection={() =>
                      { onTogglePathSelection(transitionIndex, path.path_id, path.instruction); }
                    }
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => { handlePageChange(transitionIndex, currentPage - 1); }}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => { handlePageChange(transitionIndex, currentPage + 1); }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default InstructionsDisplay;
