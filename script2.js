// variable to hold the CSV data
let particles = [];
let sensorData = {}; // object to store EEG sensor data

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
      timestamps: [],
      positions: [], // Added positions array for random motion
    };
  }

  // Loop through the rows to find min and max values for each sensor
  for (let i = 0; i < table.getRowCount(); i++) {
    let timestamp = table.getString(i, 'Timestamp');
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

      // Store sensor values, timestamps, and initial positions
      sensorData[sensor].values.push(sensorValue);
      sensorData[sensor].timestamps.push(timestamp);
      sensorData[sensor].positions.push(createVector(random(-width / 2, width / 2), random(-height / 2, height / 2), random(-200, 200)));
    }
  }

  // Set initial camera position
  camera(0, 0, 1000);

  // Add orbit control for easier navigation
  orbitControl();
}

function draw() {
  background(0); // Set background color to black

  // Drag to move the world.
  orbitControl();

  translate(0, 0, -600);

  let sensorIndex = 0;

  // Update and draw every 40th data point for each sensor
  for (let sensor in sensorData) {
    for (let i = 0; i < sensorData[sensor].values.length; i += 40) { // Increase the step size to reduce lines
      let diameter = map(sensorData[sensor].values[i], sensorData[sensor].minValue, sensorData[sensor].maxValue, 1, 5); // Reduced size of the spheres

      // Update positions for random motion
      sensorData[sensor].positions[i].add(p5.Vector.random3D().mult(2));

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

      // Draw lines connecting spheres (excluding the last sphere)
      if (i < sensorData[sensor].values.length - 40) {
        let nextDiameter = map(sensorData[sensor].values[i + 40], sensorData[sensor].minValue, sensorData[sensor].maxValue, 1, 5);
        let nextPosition = sensorData[sensor].positions[i + 40];
        stroke(255, 50); // Adjust the alpha value (50) for transparency
        line(
          sensorData[sensor].positions[i].x,
          sensorData[sensor].positions[i].y,
          sensorData[sensor].positions[i].z,
          nextPosition.x,
          nextPosition.y,
          nextPosition.z
        );
      }
    }

    sensorIndex++;
  }

}















