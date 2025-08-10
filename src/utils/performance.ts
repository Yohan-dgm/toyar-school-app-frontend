import React, { useCallback, useRef, useMemo } from "react";

// Debounce hook for performance optimization
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay],
  );
};

// Throttle hook for performance optimization
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T => {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= delay) {
        lastCallRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, delay - timeSinceLastCall);
      }
    }) as T,
    [callback, delay],
  );
};

// Memoization utilities
export const createMemoizedSelector = <T, R>(
  selector: (input: T) => R,
  equalityFn?: (a: R, b: R) => boolean,
) => {
  let lastInput: T;
  let lastResult: R;
  let hasResult = false;

  return (input: T): R => {
    if (!hasResult || input !== lastInput) {
      const newResult = selector(input);

      if (!hasResult || !equalityFn || !equalityFn(lastResult, newResult)) {
        lastResult = newResult;
        lastInput = input;
        hasResult = true;
      }
    }

    return lastResult;
  };
};

// Performance monitoring
export class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map();

  static startMeasurement(name: string): () => number {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (!this.measurements.has(name)) {
        this.measurements.set(name, []);
      }

      const measurements = this.measurements.get(name)!;
      measurements.push(duration);

      // Keep only last 100 measurements
      if (measurements.length > 100) {
        measurements.shift();
      }

      return duration;
    };
  }

  static getAverageTime(name: string): number {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) {
      return 0;
    }

    const sum = measurements.reduce((acc, time) => acc + time, 0);
    return sum / measurements.length;
  }

  static getStats(name: string): {
    average: number;
    min: number;
    max: number;
    count: number;
  } {
    const measurements = this.measurements.get(name) || [];

    if (measurements.length === 0) {
      return { average: 0, min: 0, max: 0, count: 0 };
    }

    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    const average =
      measurements.reduce((acc, time) => acc + time, 0) / measurements.length;

    return { average, min, max, count: measurements.length };
  }

  static logStats(): void {
    if (__DEV__) {
      console.group("Performance Stats");
      for (const [name] of this.measurements) {
        const stats = this.getStats(name);
        console.log(`${name}:`, {
          avg: `${stats.average.toFixed(2)}ms`,
          min: `${stats.min.toFixed(2)}ms`,
          max: `${stats.max.toFixed(2)}ms`,
          count: stats.count,
        });
      }
      console.groupEnd();
    }
  }

  static clear(): void {
    this.measurements.clear();
  }
}

// Memory management utilities
export class MemoryManager {
  private static cache: Map<
    string,
    { data: any; timestamp: number; ttl: number }
  > = new Map();
  private static cleanupInterval: NodeJS.Timeout | null = null;

  static set(key: string, data: any, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });

    // Start cleanup if not already running
    if (!this.cleanupInterval) {
      this.startCleanup();
    }
  }

  static get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  static delete(key: string): void {
    this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  private static startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const keysToDelete: string[] = [];

      for (const [key, item] of this.cache) {
        if (now - item.timestamp > item.ttl) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach((key) => this.cache.delete(key));

      // Stop cleanup if cache is empty
      if (this.cache.size === 0 && this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        this.cleanupInterval = null;
      }
    }, 60000); // Cleanup every minute
  }

  static getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// React component performance utilities
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
): T => {
  return useCallback(callback, deps);
};

export const useMemoizedValue = <T>(
  factory: () => T,
  deps: React.DependencyList,
): T => {
  return useMemo(factory, deps);
};

// Bundle size optimization utilities
export const lazyImport = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> => {
  return React.lazy(importFn);
};

// Network optimization
export class NetworkOptimizer {
  private static requestQueue: {
    id: string;
    request: () => Promise<any>;
    priority: number;
  }[] = [];

  private static isProcessing = false;
  private static maxConcurrent = 3;
  private static activeRequests = 0;

  static addRequest(
    id: string,
    request: () => Promise<any>,
    priority: number = 0,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        id,
        request: async () => {
          try {
            const result = await request();
            resolve(result);
            return result;
          } catch (error) {
            reject(error);
            throw error;
          }
        },
        priority,
      });

      // Sort by priority (higher priority first)
      this.requestQueue.sort((a, b) => b.priority - a.priority);

      this.processQueue();
    });
  }

  private static async processQueue(): Promise<void> {
    if (this.isProcessing || this.activeRequests >= this.maxConcurrent) {
      return;
    }

    if (this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const item = this.requestQueue.shift()!;
    this.activeRequests++;

    try {
      await item.request();
    } catch (error) {
      console.warn(`Request ${item.id} failed:`, error);
    } finally {
      this.activeRequests--;
      this.isProcessing = false;

      // Process next item in queue
      if (this.requestQueue.length > 0) {
        setTimeout(() => this.processQueue(), 0);
      }
    }
  }

  static getQueueStats(): { pending: number; active: number } {
    return {
      pending: this.requestQueue.length,
      active: this.activeRequests,
    };
  }

  static clearQueue(): void {
    this.requestQueue.length = 0;
  }
}
