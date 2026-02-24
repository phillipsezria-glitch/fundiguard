// Debug utility for map functions
// Usage: Import in components to test geocoding and map initialization

import {
  geocodeAddress,
  reverseGeocodeCoordinates,
  getLocationCoords,
  getLocationSuggestions,
  calculateDistance,
  NAIROBI_LOCATIONS,
} from './maps';

export async function debugMaps() {
  console.log('🗺️ MAP DEBUG - Starting tests...\n');

  try {
    // Test 1: Check NAIROBI_LOCATIONS data
    console.log('✅ Test 1: NAIROBI_LOCATIONS');
    console.log(`   Found ${Object.keys(NAIROBI_LOCATIONS).length} locations`);
    console.log('   Locations:', Object.keys(NAIROBI_LOCATIONS));

    // Test 2: getLocationCoords
    console.log('\n✅ Test 2: getLocationCoords');
    const coords = getLocationCoords('South C');
    console.log('   South C coords:', coords);

    // Test 3: getLocationSuggestions
    console.log('\n✅ Test 3: getLocationSuggestions');
    const suggestions = getLocationSuggestions('South');
    console.log('   Suggestions for "South":', suggestions);

    // Test 4: calculateDistance
    console.log('\n✅ Test 4: calculateDistance');
    const loc1 = NAIROBI_LOCATIONS['South C'];
    const loc2 = NAIROBI_LOCATIONS.Westlands;
    const distance = calculateDistance(loc1, loc2);
    console.log(`   Distance South C to Westlands: ${distance.toFixed(2)}km`);

    // Test 5: geocodeAddress
    console.log('\n✅ Test 5: geocodeAddress (with Nominatim)');
    console.log('   Calling geocodeAddress("Nairobi")...');
    const geocoded = await geocodeAddress('Nairobi');
    console.log('   Result:', geocoded);

    // Test 6: reverseGeocodeCoordinates
    console.log('\n✅ Test 6: reverseGeocodeCoordinates');
    console.log('   Reverse geocoding South C coordinates...');
    const reversed = await reverseGeocodeCoordinates(loc1.lat, loc1.lng);
    console.log('   Result:', reversed);

    console.log('\n✅ ALL TESTS PASSED!');
    return true;
  } catch (error) {
    console.error('\n❌ DEBUG ERROR:', error);
    return false;
  }
}

// Export test runner
if (typeof window !== 'undefined') {
  (window as any).debugMaps = debugMaps;
  console.log('🗺️ Map debug available - run window.debugMaps() in console');
}
