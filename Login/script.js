let mouseData = [];
let touchData = [];
let prevTime, prevX, prevY, prevVelocity = 0, prevAcceleration = 0;
let prevTouchTime, prevTouchX, prevTouchY, prevTouchVelocity = 0, prevTouchAcceleration = 0;
let detectionDone = false;

// clustering on the basis of the traveled_distance_pixel,elapsed_time,straightness,direction_of_movement,acceleration
/// centroids of the testing data 
// const centroids = [
// { cluster: 0, traveled_distance_pixel: 2789.760416, elapsed_time: 14.321, straightness: 0.161122, direction_of_movement: 4.00, acceleration: 2919.638703, jerk: 160309.077550 },
// { cluster: 1, traveled_distance_pixel: 262.851759, elapsed_time: 1.092, straightness: 0.902790, direction_of_movement: 7.00, acceleration: 540.789971, jerk: 2921.849949 },
// { cluster: 2, traveled_distance_pixel: 214.241362, elapsed_time: 1.108, straightness: 0.903825, direction_of_movement: 1.00, acceleration: 483.263222, jerk: 2563.312079 },
// { cluster: 3, traveled_distance_pixel: 720.473979, elapsed_time: 3.042, straightness: 0.317795, direction_of_movement: 5.00, acceleration: 1067.830396, jerk: 12428.142185 },
// { cluster: 4, traveled_distance_pixel: 2261.731086, elapsed_time: 1.3495, straightness: 0.365378, direction_of_movement: 4.00, acceleration: 1016027.895050, jerk: 101438887.500000 },
// { cluster: 5, traveled_distance_pixel: 3244.632114, elapsed_time: 5.085, straightness: 0.180913, direction_of_movement: 3.00, acceleration: 195170.013600, jerk: -3804152.198000 },
// { cluster: 6, traveled_distance_pixel: 1635.123958, elapsed_time: 1.7865, straightness: 0.477574, direction_of_movement: 3.50, acceleration: 441328.745200, jerk: 43745998.625000 },
// { cluster: 7, traveled_distance_pixel: 895.051491, elapsed_time: 1.482, straightness: 0.721539, direction_of_movement: 4.00, acceleration: 94177.817450, jerk: 9264619.492000 },
// { cluster: 8, traveled_distance_pixel: 301.700031, elapsed_time: 1.186, straightness: 0.880857, direction_of_movement: 4.00, acceleration: 499.728658, jerk: 3201.885854 },
// { cluster: 9, traveled_distance_pixel: 596.258656, elapsed_time: 2.886, straightness: 0.336354, direction_of_movement: 1.00, acceleration: 807.729061, jerk: 7294.727523 }
// ];
// centroids from the training data 
const centroids = [
 { cluster: 0, traveled_distance_pixel: 2757.831864, elapsed_time: 14.960, straightness: 0.149552, direction_of_movement: 4.00, acceleration: 2221.657300, jerk: 132237.463172 },
 // { cluster: 1, traveled_distance_pixel: 249.196954, elapsed_time: 1.107, straightness: 0.909675, direction_of_movement: 7.00, acceleration: 665.800251, jerk: 3786.425741 },
 // { cluster: 2, traveled_distance_pixel: 224.008118, elapsed_time: 1.139, straightness: 0.908532, direction_of_movement: 1.00, acceleration: 593.091908, jerk: 3175.268548 },
 { cluster: 3, traveled_distance_pixel: 739.260796, elapsed_time: 3.229, straightness: 0.307046, direction_of_movement: 5.00, acceleration: 945.449569, jerk: 11213.965416 },
 { cluster: 4, traveled_distance_pixel: 2075.196621, elapsed_time: 1.716, straightness: 0.621955, direction_of_movement: 4.00, acceleration: 955441.616671, jerk: 94258561.885890 },
 { cluster: 5, traveled_distance_pixel: 5145.405089, elapsed_time: 9.196, straightness: 0.054372, direction_of_movement: 4.00, acceleration: 327621.402652, jerk: 81827.185556 },
 { cluster: 6, traveled_distance_pixel: 2620.900785, elapsed_time: 5.9515, straightness: 0.285307, direction_of_movement: 3.00, acceleration: 392157.239512, jerk: 38237851.397451 },
 { cluster: 7, traveled_distance_pixel: 927.264586, elapsed_time: 1.513, straightness: 0.683015, direction_of_movement: 4.00, acceleration: 89592.054746, jerk: 8998660.156081 },
 // { cluster: 8, traveled_distance_pixel: 308.150131, elapsed_time: 1.201, straightness: 0.892458, direction_of_movement: 4.00, acceleration: 509.943077, jerk: 2968.520786 },
 { cluster: 9, traveled_distance_pixel: 635.195400, elapsed_time: 2.996, straightness: 0.329099, direction_of_movement: 1.00, acceleration: 819.367317, jerk: 8951.972479 }
];


// Mouse event listeners
window.addEventListener('mousemove', (e) => {
 if (detectionDone) return;

 let currentTime = performance.now();
 let x = e.clientX;
 let y = e.clientY;

 if (prevTime !== undefined) {
 let deltaTime = (currentTime - prevTime) / 1000;
 let deltaX = x - prevX;
 let deltaY = y - prevY;

 let traveledDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
 let direction = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
 let velocity = traveledDistance / deltaTime;
 let acceleration = (velocity - prevVelocity) / deltaTime;
 let jerk = Math.abs(deltaTime) > 0.001 ? (acceleration - prevAcceleration) / deltaTime : 0;

 // Add data point to mouseData array
 console.log(traveledDistance,deltaTime,direction,x,y,acceleration,jerk)
 mouseData.push({ traveledDistance, deltaTime, direction, x, y, acceleration, jerk });

 prevVelocity = velocity;
 prevAcceleration = acceleration;

 if (mouseData.length > 100) {
 detectUserOrBot();
 }
 }

 prevTime = currentTime;
 prevX = x;
 prevY = y;
});

// Touch event listeners
window.addEventListener('touchstart', (e) => {
 if (detectionDone) return;

 prevTouchTime = performance.now();
 prevTouchX = e.touches[0].clientX;
 prevTouchY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
 if (detectionDone) return;

 let currentTime = performance.now();
 let x = e.touches[0].clientX;
 let y = e.touches[0].clientY;

 if (prevTouchTime !== undefined) {
 let deltaTime = (currentTime - prevTouchTime) / 1000;
 let deltaX = x - prevTouchX;
 let deltaY = y - prevTouchY;

 let traveledDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
 let direction = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
 let velocity = traveledDistance / deltaTime;
 let acceleration = (velocity - prevTouchVelocity) / deltaTime;
 let jerk = Math.abs(deltaTime) > 0.001 ? (acceleration - prevTouchAcceleration) / deltaTime : 0;

 // Add data point to touchData array
 touchData.push({ traveledDistance, deltaTime, direction, x, y, acceleration, jerk });

 prevTouchVelocity = velocity;
 prevTouchAcceleration = acceleration;

 if (touchData.length > 50) {
 detectUserOrBot();
 }
 }

 prevTouchTime = currentTime;
 prevTouchX = x;
 prevTouchY = y;
});

window.addEventListener('touchend', () => {
 if (touchData.length > 0) {
 detectUserOrBot();
 }
});

function calculateRealTimeFeatures(data) {
 let sumDistance = data.reduce((acc, val) => acc + val.traveledDistance, 0);
 let totalTime = data.reduce((acc, val) => acc + val.deltaTime, 0);
 let avgStraightness = calculateStraightness(data);
 let avgDirection = data.reduce((acc, val) => acc + val.direction, 0) / data.length;
 let avgAcceleration = data.reduce((acc, val) => acc + val.acceleration, 0) / data.length;
 let avgJerk = data.reduce((acc, val) => acc + val.jerk, 0) / data.length;
 console.log("Traveled_distance_pixel"+sumDistance)
 console.log("elapsed_timr"+totalTime)
 console.log("straightness"+avgStraightness)
 console.log("direction_of_movement" + avgDirection)
 console.log("avgDirection"+avgStraightness)
 console.log("jerk"+avgJerk)

 return { traveled_distance_pixel: sumDistance, elapsed_time: totalTime, straightness: avgStraightness, direction_of_movement: avgDirection, acceleration: avgAcceleration, jerk: avgJerk };
}

// Calculate straightness for the full path
function calculateStraightness(data) {
 if (data.length === 0) return 0;
 let startX = data[0].x;
 let startY = data[0].y;
 let endX = data[data.length - 1].x;
 let endY = data[data.length - 1].y;

 let straightLineDistance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
 let totalDistance = data.reduce((acc, val) => acc + val.traveledDistance, 0);

 return straightLineDistance / totalDistance;
}

function calculateEuclideanDistance(realTimeFeatures, centroid) {
 let distance = Math.sqrt(
 (realTimeFeatures.traveled_distance_pixel - centroid.traveled_distance_pixel) ** 2 +
 (realTimeFeatures.elapsed_time - centroid.elapsed_time) ** 2 +
 (realTimeFeatures.straightness - centroid.straightness) ** 2 +
 (realTimeFeatures.direction_of_movement - centroid.direction_of_movement) ** 2 +
 (realTimeFeatures.acceleration - centroid.acceleration) ** 2 +
 (realTimeFeatures.jerk - centroid.jerk) ** 2
 );
 return distance;
}

const DISTANCE_THRESHOLD = 1000; // Euclidean distance threshold
const ANOMALY_THRESHOLD = 0.8; // Anomaly detection threshold (80%+ means bot)
const STRAIGHTNESS_THRESHOLD = 0.5; // Threshold for straight-line movement
const STRAIGHTNESS_PENALTY = 0.7; // Increase penalty for straightness

function calculateAnomalyScore(realTimeFeatures) {
 let distances = centroids.map((centroid) => calculateEuclideanDistance(realTimeFeatures, centroid));
 let minDistance = Math.min(...distances);

 // Normalize the minimum distance to create an anomaly probability
 let anomalyProbability = minDistance / DISTANCE_THRESHOLD;

 // Apply penalty for straight-line movement
 if (realTimeFeatures.straightness > STRAIGHTNESS_THRESHOLD) {
 anomalyProbability += STRAIGHTNESS_PENALTY; // Increase probability if straight-line movement is detected
 }

 // Cap the probability at 1 (i.e., 100%)
 anomalyProbability = Math.min(anomalyProbability, 1);

 return { anomalyProbability, minDistance };
}

function detectUserOrBot() {
 const checkbox = document.getElementById('verified');
 const statusLabel = document.getElementById('verification-status');
 const submitButton = document.getElementById('submit-btn');
 let realTimeFeatures = calculateRealTimeFeatures(mouseData.length > 0 ? mouseData : touchData);
 let { anomalyProbability, minDistance } = calculateAnomalyScore(realTimeFeatures);

 if (anomalyProbability >= ANOMALY_THRESHOLD || minDistance >= DISTANCE_THRESHOLD) {
 checkbox.checked = true;
 statusLabel.textContent = "Verified User";
 statusLabel.style.color = "green";
 submitButton.disabled = false; // Enable submit button
 detectionDone = true;
 } else {
 statusLabel.textContent = "Bot Detected";
 statusLabel.style.color = "red";
 submitButton.disabled = true; // Disable submit button
 detectionDone = true;
 }
}

