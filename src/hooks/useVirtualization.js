import { useState, useEffect, useCallback, useMemo , useContext } from 'react';

/**
 * Custom hook for virtualizing large lists
 * @param {Array} items - Array of items to virtualize
 * @param {number} itemHeight - Height of each item in pixels
 * @param {number} containerHeight - Height of the container in pixels
 * @param {number} overscan - Number of items to render outside visible area
 * @returns {Object} Virtualization data and methods
 */
export const useVirtualization = ({
  items = [],
  itemHeight = 100,
  containerHeight = 400,
  overscan = 5,
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleItemsCount + overscan * 2
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight,
    }));
  }, [items, startIndex, endIndex, itemHeight]);

  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll,
    containerProps: {
      style: {
        height: containerHeight,
        overflow: 'auto',
      },
      onScroll: handleScroll,
    },
    innerProps: {
      style: {
        height: totalHeight,
        position: 'relative',
      },
    },
  };
};

/**
 * Hook for grid virtualization
 * @param {Array} items - Array of items to virtualize
 * @param {number} itemWidth - Width of each item
 * @param {number} itemHeight - Height of each item
 * @param {number} containerWidth - Width of the container
 * @param {number} containerHeight - Height of the container
 * @param {number} gap - Gap between items
 * @returns {Object} Grid virtualization data
 */
export const useGridVirtualization = ({
  items = [],
  itemWidth = 200,
  itemHeight = 200,
  containerWidth = 800,
  containerHeight = 600,
  gap = 16,
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const columnsCount = Math.floor((containerWidth + gap) / (itemWidth + gap));
  const rowsCount = Math.ceil(items.length / columnsCount);
  
  const totalHeight = rowsCount * (itemHeight + gap) - gap;
  const visibleRowsCount = Math.ceil(containerHeight / (itemHeight + gap));
  
  const startRow = Math.max(0, Math.floor(scrollTop / (itemHeight + gap)) - 1);
  const endRow = Math.min(rowsCount - 1, startRow + visibleRowsCount + 2);

  const visibleItems = useMemo(() => {
    const visible = [];
    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < columnsCount; col++) {
        const index = row * columnsCount + col;
        if (index < items.length) {
          visible.push({
            ...items[index],
            index,
            row,
            col,
            left: col * (itemWidth + gap),
            top: row * (itemHeight + gap),
          });
        }
      }
    }
    return visible;
  }, [items, startRow, endRow, columnsCount, itemWidth, itemHeight, gap]);

  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    columnsCount,
    rowsCount,
    handleScroll,
    containerProps: {
      style: {
        height: containerHeight,
        width: containerWidth,
        overflow: 'auto',
      },
      onScroll: handleScroll,
    },
    innerProps: {
      style: {
        height: totalHeight,
        position: 'relative',
      },
    },
  };
};

/**
 * Hook for dynamic item height virtualization
 * @param {Array} items - Array of items
 * @param {Function} getItemHeight - Function to get item height
 * @param {number} containerHeight - Container height
 * @param {number} estimatedItemHeight - Estimated item height for initial calculation
 * @returns {Object} Dynamic virtualization data
 */
export const useDynamicVirtualization = ({
  items = [],
  getItemHeight,
  containerHeight = 400,
  estimatedItemHeight = 100,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [itemHeights, setItemHeights] = useState(new Map());

  const updateItemHeight = useCallback((index, height) => {
    setItemHeights(prev => {
      const newMap = new Map(prev);
      newMap.set(index, height);
      return newMap;
    });
  }, []);

  const { visibleItems, totalHeight, startIndex, endIndex } = useMemo(() => {
    let totalHeight = 0;
    let startIndex = 0;
    let endIndex = 0;
    let currentTop = 0;
    let foundStart = false;

    const itemPositions = [];

    for (let i = 0; i < items.length; i++) {
      const height = itemHeights.get(i) || getItemHeight?.(items[i], i) || estimatedItemHeight;
      
      itemPositions.push({
        index: i,
        top: currentTop,
        height,
        bottom: currentTop + height,
      });

      if (!foundStart && currentTop + height > scrollTop) {
        startIndex = Math.max(0, i - 1);
        foundStart = true;
      }

      if (foundStart && currentTop > scrollTop + containerHeight) {
        endIndex = i;
        break;
      }

      currentTop += height;
      totalHeight = currentTop;
    }

    if (!foundStart) {
      endIndex = items.length - 1;
    }

    const visibleItems = itemPositions
      .slice(startIndex, endIndex + 1)
      .map(pos => ({
        ...items[pos.index],
        ...pos,
      }));

    return { visibleItems, totalHeight, startIndex, endIndex };
  }, [items, itemHeights, scrollTop, containerHeight, getItemHeight, estimatedItemHeight]);

  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    startIndex,
    endIndex,
    updateItemHeight,
    handleScroll,
    containerProps: {
      style: {
        height: containerHeight,
        overflow: 'auto',
      },
      onScroll: handleScroll,
    },
    innerProps: {
      style: {
        height: totalHeight,
        position: 'relative',
      },
    },
  };
};

