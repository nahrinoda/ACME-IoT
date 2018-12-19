import randomSeed from "./random";

const deviceTitle = [
  "Device-1",
  "Device-2",
  "Device-3",
  "Device-4",
  "Device-5",
  "Device-6",
  "Device-7",
  "Device-8",
  "Device-9"
];

const deviceType = [
  "Dishwasher",
  "Television",
  "Plane",
  "Car",
  "Washing Machine",
  "Ovan",
  "Air Conditioner",
  "Fridge",
  "Domestic Robot"
];

const location = [
  "Toronto, Ontario",
  "Vancouver, British Columbia",
  "Ottawa, Ontario",
  "Montereal, Quebec",
  "Calgary, Alberta",
  "Edmonton, Alberta",
  "Winnipeg, Manitoba",
  "Hamilton, Ontario",
  "Saskatoon, Saskatchewn"
];

const sensorName = [
  "Temperature Sensor",
  "Pressure Sensor",
  "Light Sensor",
  "velocity sensor",
  "Ultrasonic Sensor",
  "Pressure Sensor",
  "Light Sensor",
  "velocity sensor",
  "Ultrasonic Sensor"
];

const sensorValue = [40, 25, 50, 70, 82, 92, 10, 100, 68];

export const defaultColumnValues = {
  deviceTitle: deviceTitle,
  deviceType: deviceType,

  location: location,

  sensorName: sensorName,
  sensorValue: sensorValue,
  deviceStatus: ["ON", "OFF"],

  sensorNameB: sensorName,
  sensorValueB: sensorValue,
  deviceStatusB: ["ON", "OFF"],

  sensorNameC: sensorName,
  sensorValueC: sensorValue,
  deviceStatusC: ["ON", "OFF"]

};

export function generateRows({
  columnValues = defaultColumnValues,
  length,
  random = randomSeed(329972281)
}) {
  const data = [];
  const columns = Object.keys(columnValues);

  for (let i = 0; i < length; i += 1) {
    const record = {};

    columns.forEach(column => {
      let values = columnValues[column];

      if (typeof values === "function") {
        record[column] = values({ random, index: i, record });
        return;
      }

      while (values.length === 2 && typeof values[1] === "object") {
        values = values[1][record[values[0]]];
      }

      const value = values[Math.floor(random() * values.length)];
      if (typeof value === "object") {
        record[column] = Object.assign({}, value);
      } else {
        record[column] = value;
      }
    });

    data.push(record);
  }

  return data;
}
