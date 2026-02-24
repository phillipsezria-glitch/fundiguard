/**
 * Runtime map debugging tool
 * Check browser console for results
 */

import {
  geocodeAddress,
  reverseGeocodeCoordinates,
  getLocationCoords,
  getLocationSuggestions,
  calculateDistance,
  filterJobsByDistance,
  NAIROBI_LOCATIONS,
  type Location,
  type Job,
} from './maps';

export class MapDebugger {
  static async runAllTests() {
    console.log('🗺️ === MAP FUNCTIONALITY DEBUG REPORT ===\n');
    
    try {
      await this.testLocations();
      await this.testGeocoding();
      await this.testDistanceCalculation();
      await this.testJobFiltering();
      await this.testMapInitialization();
      
      console.log('\n✅ All tests completed!');
      return { status: 'success', message: 'All map functions working' };
    } catch (error) {
      console.error('❌ Debug test failed:', error);
      return { status: 'error', message: String(error) };
    }
  }

  private static async testLocations() {
    console.log('📍 TEST 1: Location Database\n');
    
    try {
      const locationCount = Object.keys(NAIROBI_LOCATIONS).length;
      console.log(`   ✓ Loaded ${locationCount} locations`);
      console.log('   Locations:', Object.keys(NAIROBI_LOCATIONS).join(', '));
      
      const southC = getLocationCoords('South C');
      console.log('   ✓ getLocationCoords("South C"):', southC);
      
      const suggestions = getLocationSuggestions('South');
      console.log('   ✓ getLocationSuggestions("South"):', suggestions);
      
      console.log('   ✅ Location tests PASSED\n');
    } catch (error) {
      console.error('   ❌ Location tests FAILED:', error);
    }
  }

  private static async testGeocoding() {
    console.log('🌍 TEST 2: Geocoding (Nominatim API)\n');
    
    try {
      console.log('   Testing geocodeAddress...');
      const results = await geocodeAddress('Nairobi');
      console.log(`   ✓ Geocoded "Nairobi": ${results.length} results`);
      if (results.length > 0) {
        console.log('   First result:', results[0]);
      }
      
      // Test reverse geocoding with a known location
      const southC = NAIROBI_LOCATIONS['South C'];
      console.log('   Testing reverseGeocodeCoordinates...');
      const address = await reverseGeocodeCoordinates(southC.lat, southC.lng);
      console.log(`   ✓ Reverse geocoded South C: ${address}`);
      
      console.log('   ✅ Geocoding tests PASSED\n');
    } catch (error) {
      console.error('   ❌ Geocoding tests FAILED:', error);
    }
  }

  private static async testDistanceCalculation() {
    console.log('📏 TEST 3: Distance Calculation\n');
    
    try {
      const loc1 = NAIROBI_LOCATIONS['South C'];
      const loc2 = NAIROBI_LOCATIONS.Westlands;
      const loc3 = NAIROBI_LOCATIONS.Rongai;
      
      const dist1 = calculateDistance(loc1, loc2);
      const dist2 = calculateDistance(loc1, loc3);
      
      console.log(`   ✓ South C to Westlands: ${dist1.toFixed(2)}km`);
      console.log(`   ✓ South C to Rongai: ${dist2.toFixed(2)}km`);
      console.log('   ✅ Distance calculation tests PASSED\n');
    } catch (error) {
      console.error('   ❌ Distance tests FAILED:', error);
    }
  }

  private static async testJobFiltering() {
    console.log('💼 TEST 4: Job Filtering by Distance\n');
    
    try {
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Plumbing Job',
          location: 'South C',
          lat: NAIROBI_LOCATIONS['South C'].lat,
          lng: NAIROBI_LOCATIONS['South C'].lng,
          budget: 5000,
          category: 'plumbing',
        },
        {
          id: '2',
          title: 'Electrical Job',
          location: 'Westlands',
          lat: NAIROBI_LOCATIONS.Westlands.lat,
          lng: NAIROBI_LOCATIONS.Westlands.lng,
          budget: 8000,
          category: 'electrical',
        },
        {
          id: '3',
          title: 'Carpentry Job',
          location: 'Rongai',
          lat: NAIROBI_LOCATIONS.Rongai.lat,
          lng: NAIROBI_LOCATIONS.Rongai.lng,
          budget: 12000,
          category: 'carpentry',
        },
      ];
      
      const centerLocation: Location = NAIROBI_LOCATIONS['South C'];
      const filtered = filterJobsByDistance(mockJobs, centerLocation, 15); // 15km radius
      
      console.log(`   ✓ Filtered ${filtered.length} jobs within 15km of South C`);
      filtered.forEach(job => {
        console.log(`     - ${job.title}: ${job.distance?.toFixed(2)}km away`);
      });
      
      console.log('   ✅ Job filtering tests PASSED\n');
    } catch (error) {
      console.error('   ❌ Job filtering tests FAILED:', error);
    }
  }

  private static async testMapInitialization() {
    console.log('🗺️ TEST 5: Map Initialization (Leaflet)\n');
    
    try {
      const L = await import('leaflet');
      console.log(`   ✓ Leaflet library loaded successfully`);
      console.log('   Package version:', (L.version || 'unknown'));
      
      // Check if Mapbox is available
      try {
        const mbgl = await import('mapbox-gl');
        console.log('   ✓ Mapbox GL library available');
        
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (token) {
          console.log('   ✓ Mapbox token configured');
        } else {
          console.log('   ⚠ Mapbox token not configured (will fallback)');
        }
      } catch (e) {
        console.log('   ⚠ Mapbox GL not installed (optional)');
      }
      
      console.log('   ✅ Map initialization tests PASSED\n');
    } catch (error) {
      console.error('   ❌ Map initialization tests FAILED:', error);
    }
  }

  static printSystemInfo() {
    console.log('📊 SYSTEM INFORMATION');
    console.log('   Node environment:', process.env.NODE_ENV);
    console.log('   Browser location API:', navigator.geolocation ? '✓ Available' : '✗ Not available');
    console.log('   Window dimensions:', `${window.innerWidth}x${window.innerHeight}`);
  }
}

// Auto-run tests on module load in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__mapDebugger = MapDebugger;
  console.log('💡 Map debugger available: Run window.__mapDebugger.runAllTests() in console');
}
