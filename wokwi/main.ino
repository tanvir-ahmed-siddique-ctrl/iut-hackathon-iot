const int LIGHT_PINS[3] = {16, 17, 18};
const int FAN_PINS[2] = {19, 21};

const int LIGHT_BUTTON_PINS[3] = {4, 5, 13};
const int FAN_BUTTON_PINS[2] = {14, 27};

const int CURRENT_SENSOR_PIN = 34; 

const int RELAY_IN_PIN = 26;      
const int MASTER_BUTTON_PIN = 25; // btn_master_kill

bool lightState[3] = {true, false, true};
bool fanState[2] = {true, false};
bool masterPowerOn = true; 

const int NUM_BUTTONS = 6;
const int MASTER_BUTTON_INDEX = 5;
const unsigned long DEBOUNCE_MS = 200;
bool lastButtonReading[NUM_BUTTONS] = {HIGH, HIGH, HIGH, HIGH, HIGH, HIGH};
unsigned long lastDebounceMs[NUM_BUTTONS] = {0, 0, 0, 0, 0, 0};

unsigned long lastSampleMs = 0;
const unsigned long SAMPLE_INTERVAL_MS = 4000; 

void setup() {
  Serial.begin(115200);

  for (int i = 0; i < 3; i++) {
    pinMode(LIGHT_PINS[i], OUTPUT);
    digitalWrite(LIGHT_PINS[i], lightState[i] ? HIGH : LOW);
    pinMode(LIGHT_BUTTON_PINS[i], INPUT_PULLUP);
  }
  for (int i = 0; i < 2; i++) {
    pinMode(FAN_PINS[i], OUTPUT);
    digitalWrite(FAN_PINS[i], fanState[i] ? HIGH : LOW);
    pinMode(FAN_BUTTON_PINS[i], INPUT_PULLUP);
  }

  pinMode(CURRENT_SENSOR_PIN, INPUT);

  pinMode(RELAY_IN_PIN, OUTPUT);
  digitalWrite(RELAY_IN_PIN, masterPowerOn ? HIGH : LOW);
  pinMode(MASTER_BUTTON_PIN, INPUT_PULLUP);

  Serial.println("Work Room 1 controller online.");
}

void loop() {
  pollButtons();

  unsigned long now = millis();
  if (now - lastSampleMs >= SAMPLE_INTERVAL_MS) {
    lastSampleMs = now;
    sampleAndReport();
  }
}

void pollButtons() {
  for (int i = 0; i < 3; i++) {
    handleButton(i, LIGHT_BUTTON_PINS[i], lightState[i], LIGHT_PINS[i]);
  }
  for (int i = 0; i < 2; i++) {
    handleButton(3 + i, FAN_BUTTON_PINS[i], fanState[i], FAN_PINS[i]);
  }

  handleButton(MASTER_BUTTON_INDEX, MASTER_BUTTON_PIN, masterPowerOn, RELAY_IN_PIN);
}

void handleButton(int debounceIndex, int buttonPin, bool &stateRef, int outputPin) {
  bool reading = digitalRead(buttonPin);
  unsigned long now = millis();

  if (reading != lastButtonReading[debounceIndex]) {
    lastDebounceMs[debounceIndex] = now;
  }

  if ((now - lastDebounceMs[debounceIndex]) > DEBOUNCE_MS) {
    static bool committedLow[NUM_BUTTONS] = {false, false, false, false, false, false};
    if (reading == LOW && !committedLow[debounceIndex]) {
      stateRef = !stateRef;
      digitalWrite(outputPin, stateRef ? HIGH : LOW);
      committedLow[debounceIndex] = true;
      if (debounceIndex == MASTER_BUTTON_INDEX) {
        Serial.println(stateRef ? "MASTER POWER: ON (relay closed)" : "MASTER POWER: OFF (relay open — all devices killed)");
      }
    } else if (reading == HIGH) {
      committedLow[debounceIndex] = false;
    }
  }

  lastButtonReading[debounceIndex] = reading;
}

void sampleAndReport() {

  int raw = analogRead(CURRENT_SENSOR_PIN); 
  float voltage = (raw / 4095.0) * 3.3;
  float amps = (voltage / 3.3) * 15.0; 
  float estimatedWatts = amps * 230.0; 

  int lightsOn = 0, fansOn = 0;
  for (int i = 0; i < 3; i++) if (lightState[i]) lightsOn++;
  for (int i = 0; i < 2; i++) if (fanState[i]) fansOn++;


  int effectiveLightsOn = masterPowerOn ? lightsOn : 0;
  int effectiveFansOn = masterPowerOn ? fansOn : 0;
  float effectiveWatts = masterPowerOn ? estimatedWatts : 0.0;

  Serial.print("{\"room\":\"work1\",\"masterPowerOn\":");
  Serial.print(masterPowerOn ? "true" : "false");
  Serial.print(",\"lightsOn\":");
  Serial.print(effectiveLightsOn);
  Serial.print(",\"fansOn\":");
  Serial.print(effectiveFansOn);
  Serial.print(",\"sensedWatts\":");
  Serial.print(effectiveWatts, 1);
  Serial.println("}");

}
