// Map Debugger Runtime - Development Only
// This file provides testing and debugging utilities for map functionality

export const MapDebugger = {
  async runAllTests() {
    console.log('🧪 Running map functionality tests...');
    
    const tests = {
      leaflet: typeof window !== 'undefined' && 'L' in window,
      geolocation: typeof navigator !== 'undefined' && !!navigator.geolocation,
      localStorage: typeof localStorage !== 'undefined',
    };

    console.log('✓ Test Results:', tests);
    
    return {
      status: 'completed',
      message: 'All tests completed',
      tests,
    };
  },

  printSystemInfo() {
    console.log('=== FundiGuard Map System Info ===');
    console.log('User Agent:', navigator.userAgent);
    console.log('Coords Available:', !!navigator.geolocation);
    if (typeof window !== 'undefined') {
      console.log('Window Size:', `${window.innerWidth}x${window.innerHeight}`);
    }
    console.log('================================');
  },
};
