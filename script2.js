let table; // variable to hold the CSV data
let particles = [];
let sensorData = {}; // object to store EEG sensor data
let minValue, maxValue;

function preload() {
  // Load the CSV file
  table = loadTable('data.csv', 'csv', 'header', 
    (data) => {
      console.log('CSV data loaded successfully:', data);
    }, 
    (error) => {
      console.error('Error loading CSV file:', error);
    }
  );
}

function setup() {
  createCanvas(1400, 1000);
  
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
      color: color(random(255), random(255), random(255), 150) // Adding alpha (transparency)
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

      // Store sensor values and timestamps
      sensorData[sensor].values.push(sensorValue);
      sensorData[sensor].timestamps.push(timestamp);
    }
  }
  
  // Create particles for each EEG sensor
  for (let sensor of sensorColumns) {
    createParticles(sensorData[sensor].values, sensorData[sensor].minValue, sensorData[sensor].maxValue, sensorData[sensor].timestamps, sensorData[sensor].color);
  }
}

function createParticles(values, minValue, maxValue, timestamps, color) {
  for (let i = 0; i < values.length; i++) {
    let x = map(values[i], minValue, maxValue, 50, width - 50);
    let y = map(i, 0, values.length - 1, 50, height - 50);
    let radius = map(values[i], minValue, maxValue, 5, 20);
    
    let particle = {
      x: x,
      y: y,
      timestamp: timestamps[i],
      radius: radius,
      color: color,
      display: function() {
        noFill();
        strokeWeight(2);
        stroke(this.color);
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
      },
      move: function() {
        this.x += random(1, 3);
        if (this.x > width - 50) {
          this.x = 50; // Reset particle's position when it reaches the right side
        }
      }
    };

    particles.push(particle);
  }
}

function draw() {
  background(255);

  // Draw and move particles
  for (let particle of particles) {
    particle.display();
    particle.move();
  }
}


