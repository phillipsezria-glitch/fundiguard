'use client';

import { useState } from 'react';
import { MapDebugger } from '../lib/mapDebugRuntime';
import LocationPicker from '../components/LocationPicker';

export default function MapDebugPage() {
  const [testResults, setTestResults] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('South C');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResults('Running tests...');
    
    // Run tests in the browser console as well
    const result = await MapDebugger.runAllTests();
    MapDebugger.printSystemInfo();
    
    setTestResults(
      `Tests completed!\n\nResult: ${result.status}\nMessage: ${result.message}\n\nCheck browser console (F12) for detailed output.`
    );
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">🗺️ Map Functionality Debugger</h1>
        <p className="text-gray-600 mb-8">Test and debug map features for FundiGuard.ke</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Runner */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Automated Tests</h2>
            
            <button
              onClick={handleRunTests}
              disabled={isRunning}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg mb-4 transition"
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </button>

            {testResults && (
              <div className="bg-gray-100 rounded p-4 font-mono text-sm whitespace-pre-wrap text-gray-800 max-h-96 overflow-y-auto">
                {testResults}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
              <p>💡 <strong>Tip:</strong> Open your browser console (F12) to see detailed test output and debug information.</p>
            </div>
          </div>

          {/* Location Picker Test */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Location Picker Test</h2>
            
            <LocationPicker
              value={selectedLocation}
              onChange={setSelectedLocation}
              onCoordinatesChange={setCoordinates}
            />

            {coordinates && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm font-medium text-green-900">Selected Coordinates:</p>
                <p className="text-sm text-green-800">
                  Latitude: {coordinates.lat.toFixed(4)}
                </p>
                <p className="text-sm text-green-800">
                  Longitude: {coordinates.lng.toFixed(4)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Diagnostic Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Diagnostic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm font-medium text-blue-900">Environment</p>
              <p className="text-sm text-blue-800">{process.env.NODE_ENV}</p>
            </div>

            <div className="p-4 bg-green-50 rounded border border-green-200">
              <p className="text-sm font-medium text-green-900">Geolocation API</p>
              <p className="text-sm text-green-800">
                {typeof navigator !== 'undefined' && navigator.geolocation ? '✓ Available' : '✗ Unavailable'}
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded border border-purple-200">
              <p className="text-sm font-medium text-purple-900">Viewport</p>
              <p className="text-sm text-purple-800">
                {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm font-medium text-yellow-900 mb-2">Console Commands:</p>
            <code className="text-xs text-yellow-800 block bg-white p-2 rounded font-mono">
              {`// Run all map tests\nwindow.__mapDebugger.runAllTests()\n\n// Print system info\nwindow.__mapDebugger.printSystemInfo()`}
            </code>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">✨ Quick Debugging Guide</h3>
          
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              <strong>1. Run Automated Tests:</strong> Click "Run All Tests" to verify all map functions work correctly.
            </li>
            <li>
              <strong>2. Test Location Picker:</strong> Use the location picker on the right to test geocoding and map interaction.
            </li>
            <li>
              <strong>3. Check Console:</strong> Open browser console (F12) to see detailed debug output and errors.
            </li>
            <li>
              <strong>4. Verify APIs:</strong> Tests will check Leaflet, Mapbox, and Nominatim API availability.
            </li>
            <li>
              <strong>5. Distance Calculation:</strong> Tests verify that job filtering by proximity works correctly.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
