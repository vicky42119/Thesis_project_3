let sensorData = {}; // object to store EEG sensor data
let rotationSpeed = 0.005; // Adjust the rotation speed as needed

function preload() {
  // Load the CSV file
  table = loadTable(
    'data.csv',
    'csv',
    'header',
    (data) => {
      console.log('CSV data loaded successfully:', data);
    },
    (error) => {
      console.error('Error loading CSV file:', error);
    }
  );
}

function setup() {
  createCanvas(1400, 1000, WEBGL);

  // Check if the CSV data is loaded
  if (!table) {
    console.error('CSV data not loaded. Check the console for preload errors.');
    return;
  }

  // Extract data from the loaded table for each EEG sensor
  let sensorColumns = ['EEG.AF3', 'EEG.T7', 'EEG.Pz', 'EEG.T8', 'EEG.AF4'];

  // Initialize sensorData object
  for (let sensor of sensorColumns) {
    sensorData[sensor] = {
      minValue: table.getColumn(sensor).map(Number)[0],
      maxValue: table.getColumn(sensor).map(Number)[0],
      values: [],
      positions: [], // Added positions array for spherical mapping
    };
  }

  // Loop through the rows to find min and max values for each sensor
  for (let i = 0; i < table.getRowCount(); i++) {
    for (let sensor of sensorColumns) {
      let sensorValue = table.getNum(i, sensor);

      // Check for undefined or NaN values
      if (isNaN(sensorValue)) {
        console.warn(`Undefined or NaN value found in ${sensor} at row ${i}`);
        continue; // Skip this iteration if there's an issue with the data
      }

      // Update min and max values
      if (sensorValue < sensorData[sensor].minValue) {
        sensorData[sensor].minValue = sensorValue;
      }
      if (sensorValue > sensorData[sensor].maxValue) {
        sensorData[sensor].maxValue = sensorValue;
      }

      // Store sensor values and positions for spherical mapping
      sensorData[sensor].values.push(sensorValue);

      // Calculate spherical coordinates based on sensor value
      let radius = map(sensorValue, sensorData[sensor].minValue, sensorData[sensor].maxValue, 200, 400);
      let theta = map(i, 0, table.getRowCount(), 0, TWO_PI);
      let phi = map(sensorData[sensor].values[i], sensorData[sensor].minValue, sensorData[sensor].maxValue, -PI / 2, PI / 2);

      // Convert spherical coordinates to Cartesian coordinates
      let x = radius * cos(theta) * cos(phi) + random(-50, 50); // Adding random offset to x
      let y = radius * sin(phi) + random(-50, 50); // Adding random offset to y
      let z = radius * sin(theta) * cos(phi) + random(-50, 50); // Adding random offset to z

      sensorData[sensor].positions.push(createVector(x, y, z));
    }
  }

  // Set initial camera position
  camera(0, 50, 1000);

  // Add orbit control for easier navigation
  orbitControl();
}

function draw() {
  background(0); // Set background color to black

  // Drag to move the world.
  orbitControl();

  // Apply rotation to the entire scene
  rotateY(frameCount * rotationSpeed);

  let sensorIndex = 0;

  // Update and draw every 20th data point for each sensor
  for (let sensor in sensorData) {
    for (let i = 0; i < sensorData[sensor].values.length; i += 20) { // Increase the step size to reduce points
      let diameter = map(sensorData[sensor].values[i], sensorData[sensor].minValue, sensorData[sensor].maxValue, 1, 3); // Reduced size of the spheres

      push(); // Save the current transformation matrix
      translate(sensorData[sensor].positions[i].x, sensorData[sensor].positions[i].y, sensorData[sensor].positions[i].z);

      // Set color for each sensor
      if (sensor === 'EEG.AF3') {
        fill(255, 0, 0); // Red for EEG.AF3
      } else {
        // Use shades of gray for other sensors
        let grayShade = map(sensorIndex, 0, Object.keys(sensorData).length - 1, 50, 200);
        fill(grayShade);
      }

      noStroke(); // Remove stroke (outline)
      sphere(diameter); // Draw the sphere
      pop(); // Restore the previous transformation matrix
    }

    sensorIndex++;
  }
}


























