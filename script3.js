let sensorData = {}; // Object to store EEG sensor data
let rotationSpeed = 0.005; // Adjust the rotation speed as needed
let sensorVisibility = {}; // Object to manage the visibility of each sensor's data points
let table; // Variable to hold the CSV data

function preload() {
  // Load the CSV file
  table = loadTable(
    'data.csv',
    'csv',
    'header',
    data => console.log('CSV data loaded successfully:', data),
    error => console.error('Error loading CSV file:', error)
  );
}

function setup() {
  createCanvas(390, 400, WEBGL);

  if (!table) {
    console.error('CSV data not loaded. Check the console for preload errors.');
    return;
  }

  const sensorColumns = ['EEG.AF3', 'EEG.T7', 'EEG.Pz', 'EEG.T8', 'EEG.AF4'];
  initializeSensorData(sensorColumns);

  // Create toggle buttons for each sensor
  createToggleButtons(sensorColumns);

  camera(0, 50, 1000);
  orbitControl();
}

function initializeSensorData(sensorColumns) {
  sensorColumns.forEach((sensor, index) => {
    sensorData[sensor] = { minValue: Infinity, maxValue: -Infinity, values: [], positions: [] };
    sensorVisibility[sensor] = true; // Initially all sensors are visible

    // Process each row of the table
    for (let i = 0; i < table.getRowCount(); i++) {
      let sensorValue = table.getNum(i, sensor);
      if (!isNaN(sensorValue)) {
        updateSensorData(sensor, sensorValue, i);
      } else {
        console.warn(`Undefined or NaN value found in ${sensor} at row ${i}`);
      }
    }
  });
}

function updateSensorData(sensor, sensorValue, rowIndex) {
  sensorData[sensor].minValue = Math.min(sensorData[sensor].minValue, sensorValue);
  sensorData[sensor].maxValue = Math.max(sensorData[sensor].maxValue, sensorValue);
  sensorData[sensor].values.push(sensorValue);

  // Calculate and store positions
  let { x, y, z } = calculatePosition(sensor, sensorValue, rowIndex);
  sensorData[sensor].positions.push(createVector(x, y, z));
}

function calculatePosition(sensor, value, index) {
  let radius = map(value, sensorData[sensor].minValue, sensorData[sensor].maxValue, 200, 400);
  let theta = map(index, 0, table.getRowCount(), 0, TWO_PI);
  let phi = map(value, sensorData[sensor].minValue, sensorData[sensor].maxValue, -PI / 2, PI / 2);

  return {
    x: radius * cos(theta) * cos(phi) + random(-50, 50),
    y: radius * sin(phi) + random(-50, 50),
    z: radius * sin(theta) * cos(phi) + random(-50, 50)
  };
}

function createToggleButtons(sensorColumns) {
  let container = select('#toggle-buttons'); // Select the container using its ID

  sensorColumns.forEach((sensor, index) => {
    let button = createButton(`Toggle ${sensor}`);
    button.parent(container); // Append the button to the container
    button.mousePressed(() => sensorVisibility[sensor] = !sensorVisibility[sensor]);
  });
}

function draw() {
  background(0);
  orbitControl();
  rotateY(frameCount * rotationSpeed);

  for (let sensor in sensorData) {
    if (sensorVisibility[sensor]) {
      drawSensorData(sensor);
    }
  }
}

function drawSensorData(sensor) {
  for (let i = 0; i < sensorData[sensor].values.length; i += 20) {
    let diameter = map(sensorData[sensor].values[i], sensorData[sensor].minValue, sensorData[sensor].maxValue, 1, 3);
    let position = sensorData[sensor].positions[i];

    push();
    translate(position.x, position.y, position.z);
    fill(sensor === 'EEG.AF3' ? color(255, 0, 0) : color(100));
    noStroke();
    sphere(diameter);
    pop();
  }
}




























