// Enhanced fridge simulation with all new features
class SolarFridge {
    constructor() {
        this.data = {
            temperature: 4.5,
            setpoint: 4,
            batteryLevel: 87.32,
            powerSource: "solar",
            compressor: false,
            doorOpen: false,
            lastUpdate: new Date().toISOString(),
            online: true,
            overrideMode: false,
            energySaver: false,
            error: null,
            batteryHealth: "Good",
            chargeRate: 0,
            tempTrend: "steady",
            solarIntensity: this.calculateSolarIntensity(),
            history: this.generateInitialHistory(),
            compressorCycles: 42
        };
        
        this.dataLog = [];
        this.maxLogEntries = 100;
        this.currentLanguage = 'en';
        this.translations = {
            en: {
                title: "Solar Fridge Control",
                appName: "Solar Fridge",
                connecting: "Connecting...",
                online: "Online",
                offline: "Offline",
                error: "Error",
                temperature: "Temperature",
                setpoint: "Setpoint",
                power: "Power",
                battery: "Battery",
                chargeRate: "Charge Rate",
                powerOff: "Power OFF",
                powerOn: "Power ON",
                override: "Override",
                eco: "Eco",
                systemStatus: "System Status",
                compressor: "Compressor",
                cyclesToday: "Cycles Today",
                door: "Door",
                batteryHealth: "Battery Health",
                lastUpdate: "Last Update",
                batteryTemp: "Battery Temp",
                open: "Open",
                closed: "Closed",
                running: "Running",
                off: "Off",
                good: "Good",
                low: "Low",
                critical: "Critical",
                full: "Full",
                tempChart: "Temperature (7 Days)",
                actual: "Actual",
                powerChart: "Power Flow (7 Days)",
                solar: "Solar",
                battery: "Battery",
                recentActivity: "Recent Activity",
                exportData: "Export Data",
                login: "Login",
                username: "Username",
                password: "Password",
                toggleDoor: "Toggle Door",
                freshGuide: "Fresh Storage Guide",
                freshGuideDesc: "Discover optimal temperatures for fruits & vegetables to maximize freshness",
                viewGuide: "View Guide"
            },
            hi: {
                title: "सोलर फ्रिज नियंत्रण",
                appName: "सोलर फ्रिज",
                connecting: "कनेक्ट हो रहा है...",
                online: "ऑनलाइन",
                offline: "ऑफलाइन",
                error: "त्रुटि",
                temperature: "तापमान",
                setpoint: "सेटपॉइंट",
                power: "पावर",
                battery: "बैटरी",
                chargeRate: "चार्ज दर",
                powerOff: "पावर बंद",
                powerOn: "पावर चालू",
                override: "ओवरराइड",
                eco: "इको",
                systemStatus: "सिस्टम स्थिति",
                compressor: "कंप्रेसर",
                cyclesToday: "आज के चक्र",
                door: "दरवाजा",
                batteryHealth: "बैटरी स्वास्थ्य",
                lastUpdate: "अंतिम अपडेट",
                batteryTemp: "बैटरी तापमान",
                open: "खुला",
                closed: "बंद",
                running: "चल रहा",
                off: "बंद",
                good: "अच्छा",
                low: "कम",
                critical: "गंभीर",
                full: "पूर्ण",
                tempChart: "तापमान (7 दिन)",
                actual: "वास्तविक",
                powerChart: "पावर प्रवाह (7 दिन)",
                solar: "सौर",
                battery: "बैटरी",
                recentActivity: "हाल की गतिविधि",
                exportData: "डेटा निर्यात",
                login: "लॉगिन",
                username: "उपयोगकर्ता नाम",
                password: "पासवर्ड",
                toggleDoor: "दरवाजा टॉगल करें",
                freshGuide: "ताजा भंडारण गाइड",
                freshGuideDesc: "फलों और सब्जियों के लिए इष्टतम तापमान की खोज करें ताकि ताजगी बनी रहे",
                viewGuide: "गाइड देखें"
            }
        };
        
        this.initDOM();
        this.initCharts();
        this.initEventListeners();
        this.setupExportButtons();
        this.updateUI();
        this.startSimulation();
    }

    initDOM() {
        this.elements = {
            // Status Elements
            statusIndicator: document.getElementById('status-indicator'),
            statusText: document.getElementById('status-text'),
            currentTime: document.getElementById('current-time'),
            
            // Temperature Elements
            tempDisplay: document.getElementById('temperature'),
            setpointValue: document.getElementById('setpoint-value'),
            tempSetpoint: document.getElementById('temp-setpoint'),
            tempTrend: document.getElementById('temp-trend'),
            
            // Power Elements
            batteryLevel: document.getElementById('battery-level'),
            chargeRate: document.getElementById('charge-rate'),
            powerSourceBadge: document.getElementById('power-source-badge'),
            powerBtn: document.getElementById('power-btn'),
            overrideBtn: document.getElementById('override-btn'),
            energySaverBtn: document.getElementById('energy-saver-btn'),
            doorControlBtn: document.getElementById('door-control-btn'),
            
            // Status Elements
            compressorStatus: document.getElementById('compressor-status'),
            doorStatus: document.getElementById('door-status'),
            batteryHealth: document.getElementById('battery-health'),
            lastUpdate: document.getElementById('last-update'),
            batteryTime: document.getElementById('battery-time'),
            compressorCycles: document.getElementById('compressor-cycles'),
            
            // Theme Toggle
            themeToggle: document.getElementById('theme-toggle'),
            
            // Alerts Container
            alertsContainer: document.getElementById('alerts-container'),
            
            // Data Log
            logContainer: document.getElementById('log-container'),
            refreshLogBtn: document.getElementById('refresh-log'),
            
            // Language Switcher
            langButtons: document.querySelectorAll('.lang-btn')
        };
    }

    initCharts() {
        // Temperature Chart (7-day history)
        this.tempChart = new Chart(
            document.getElementById('temp-chart').getContext('2d'),
            {
                type: 'line',
                data: {
                    labels: this.generateDayLabels(7),
                    datasets: [
                        {
                            label: this.translate('temperature') + ' (°C)',
                            data: this.data.history.temperature,
                            borderColor: '#3498db',
                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: this.translate('setpoint') + ' (°C)',
                            data: Array(7).fill(this.data.setpoint),
                            borderColor: '#e74c3c',
                            borderDash: [5, 5],
                            borderWidth: 1,
                            pointRadius: 0
                        }
                    ]
                },
                options: this.getChartOptions(this.translate('tempChart'))
            }
        );

        // Power Chart (7-day history)
        this.powerChart = new Chart(
            document.getElementById('power-chart').getContext('2d'),
            {
                type: 'bar',
                data: {
                    labels: this.generateDayLabels(7),
                    datasets: [
                        {
                            label: this.translate('solar') + ' (Wh)',
                            data: this.data.history.solarInput,
                            backgroundColor: '#2ecc71'
                        },
                        {
                            label: this.translate('battery') + ' (Wh)',
                            data: this.data.history.batteryUsage,
                            backgroundColor: '#f39c12'
                        }
                    ]
                },
                options: this.getChartOptions(this.translate('powerChart'), true)
            }
        );
    }

    getChartOptions(title, stacked = false) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12
                    }
                },
                tooltip: {
                    mode: stacked ? 'index' : 'nearest',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: stacked,
                    stacked: stacked
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        };
    }

    initEventListeners() {
        // Temperature Setpoint
        this.elements.tempSetpoint.addEventListener('input', () => {
            this.data.setpoint = parseFloat(this.elements.tempSetpoint.value);
            this.addAlert(this.translate('setpoint') + ' ' + this.translate('changedTo') + ' ' + this.data.setpoint + '°C', 'success');
            this.simulateUpdate();
        });

        // Power Button
        this.elements.powerBtn.addEventListener('click', () => {
            if (!this.data.overrideMode) {
                this.data.compressor = !this.data.compressor;
                const action = this.data.compressor ? this.translate('powerOn') : this.translate('powerOff');
                this.addAlert(this.translate('power') + ' ' + this.translate('turned') + ' ' + action, 'success');
                if (this.data.compressor) this.data.compressorCycles++;
                this.simulateUpdate();
            }
        });

        // Override Button
        this.elements.overrideBtn.addEventListener('click', () => {
            this.data.overrideMode = true;
            this.data.compressor = true;
            this.data.compressorCycles++;
            this.addAlert(this.translate('overrideModeActivated'), 'warning');
            
            setTimeout(() => {
                this.data.overrideMode = false;
                this.addAlert(this.translate('overrideModeEnded'), 'success');
                this.simulateUpdate();
            }, 20000); // 20s for demo (2hrs = 7200000ms)
            
            this.simulateUpdate();
        });

        // Energy Saver Button
        this.elements.energySaverBtn.addEventListener('click', () => {
            this.data.energySaver = !this.data.energySaver;
            this.elements.energySaverBtn.classList.toggle('active', this.data.energySaver);
            this.addAlert(this.translate('energySaverMode') + ' ' + 
                         (this.data.energySaver ? this.translate('activated') : this.translate('deactivated')), 
                         this.data.energySaver ? 'success' : 'info');
            
            if (this.data.energySaver) {
                // Adjust setpoint slightly higher to save energy
                this.data.setpoint = Math.min(8, this.data.setpoint + 1);
                this.elements.tempSetpoint.value = this.data.setpoint;
            }
            this.simulateUpdate();
        });

        // Theme Toggle
        this.elements.themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            this.elements.themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', newTheme);
        });

        // Refresh Log Button
        this.elements.refreshLogBtn.addEventListener('click', () => {
            this.updateLogDisplay();
            this.addAlert(this.translate('activityLogRefreshed'), 'success');
        });

        // Door Control Button
        this.elements.doorControlBtn.addEventListener('click', () => {
            this.data.doorOpen = !this.data.doorOpen;
            const action = this.data.doorOpen ? this.translate('opened') : this.translate('closed');
            this.addAlert(this.translate('door') + ' ' + action, this.data.doorOpen ? 'warning' : 'success');
            
            // If door is open, simulate alarm after 2 minutes
            if (this.data.doorOpen) {
                setTimeout(() => {
                    if (this.data.doorOpen) {
                        this.addAlert(this.translate('doorOpenTooLong'), 'warning');
                    }
                }, 120000); // 2 minutes in ms
            }
            
            this.simulateUpdate();
        });

        // Language Switcher
        this.elements.langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.elements.langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLanguage = btn.dataset.lang;
                this.translatePage();
            });
        });

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 
                           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.elements.themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    setupExportButtons() {
        // JSON Export
        document.getElementById('export-json').addEventListener('click', () => {
            const exportData = {
                systemStatus: {
                    temperature: this.data.temperature,
                    setpoint: this.data.setpoint,
                    batteryLevel: this.data.batteryLevel,
                    powerSource: this.data.powerSource,
                    compressor: this.data.compressor,
                    energySaver: this.data.energySaver,
                    overrideMode: this.data.overrideMode,
                    doorOpen: this.data.doorOpen
                },
                summary: {
                    avgTemperature: this.calculateAverage(this.data.history.temperature),
                    totalSolarInput: this.data.history.solarInput.reduce((a, b) => a + b, 0),
                    totalBatteryUsage: this.data.history.batteryUsage.reduce((a, b) => a + b, 0),
                    compressorCycles: this.data.compressorCycles
                },
                timestamp: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `solar-fridge-export-${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            this.addAlert(this.translate('jsonExportDownloaded'), 'success');
        });

        // CSV Export
        document.getElementById('export-csv').addEventListener('click', () => {
            // Create CSV header
            let csv = 'Timestamp,Temperature,Setpoint,Battery Level,Power Source,Compressor,Door Open\n';
            
            // Add current status
            const now = new Date();
            csv += `${now.toISOString()},${this.data.temperature},${this.data.setpoint},${this.data.batteryLevel},`;
            csv += `${this.data.powerSource},${this.data.compressor},${this.data.doorOpen}\n`;
            
            // Add log entries
            this.dataLog.forEach(entry => {
                csv += `${entry.timestamp.toISOString()},${entry.temperature},${this.data.setpoint},`;
                csv += `${entry.batteryLevel},${entry.powerSource},${entry.compressor},${this.data.doorOpen}\n`;
            });
            
            const blob = new Blob([csv], {type: 'text/csv'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `solar-fridge-export-${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
            this.addAlert(this.translate('csvExportDownloaded'), 'success');
        });

        // PDF Export
        document.getElementById('export-pdf').addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(18);
            doc.text(this.translate('solarFridgeReport'), 105, 15, { align: 'center' });
            
            // Add current date
            doc.setFontSize(12);
            doc.text(this.translate('generatedOn') + ': ' + new Date().toLocaleString(), 105, 25, { align: 'center' });
            
            // Add system status
            doc.setFontSize(14);
            doc.text(this.translate('systemStatus'), 14, 35);
            doc.setFontSize(12);
            
            const statusData = [
                [this.translate('temperature'), `${this.data.temperature.toFixed(1)}°C`],
                [this.translate('setpoint'), `${this.data.setpoint}°C`],
                [this.translate('battery'), `${this.data.batteryLevel.toFixed(1)}%`],
                [this.translate('powerSource'), this.data.powerSource],
                [this.translate('compressor'), this.data.compressor ? this.translate('running') : this.translate('off')],
                [this.translate('door'), this.data.doorOpen ? this.translate('open') : this.translate('closed')]
            ];
            
            doc.autoTable({
                startY: 40,
                head: [[this.translate('parameter'), this.translate('value')]],
                body: statusData,
                theme: 'grid',
                headStyles: { fillColor: [52, 152, 219] }
            });
            
            // Save the PDF
            doc.save(`solar-fridge-export-${new Date().toISOString().slice(0,10)}.pdf`);
            this.addAlert(this.translate('pdfExportDownloaded'), 'success');
        });
    }

    translate(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[this.currentLanguage][key]) {
                el.textContent = this.translations[this.currentLanguage][key];
            }
        });

        // Update chart labels
        if (this.tempChart) {
            this.tempChart.data.datasets[0].label = this.translate('temperature') + ' (°C)';
            this.tempChart.data.datasets[1].label = this.translate('setpoint') + ' (°C)';
            this.tempChart.options.plugins.title.text = this.translate('tempChart');
            this.tempChart.update();
        }

        if (this.powerChart) {
            this.powerChart.data.datasets[0].label = this.translate('solar') + ' (Wh)';
            this.powerChart.data.datasets[1].label = this.translate('battery') + ' (Wh)';
            this.powerChart.options.plugins.title.text = this.translate('powerChart');
            this.powerChart.update();
        }

        // Update UI elements that may have changed
        this.updateUI();
    }

    updateUI() {
        const d = this.data;
        
        // Update timestamp
        this.elements.currentTime.textContent = new Date().toLocaleTimeString();
        
        // Temperature
        this.elements.tempDisplay.textContent = `${d.temperature.toFixed(1)}°C`;
        this.elements.setpointValue.textContent = d.setpoint;
        this.elements.tempSetpoint.value = d.setpoint;
        
        // Power
        this.elements.batteryLevel.textContent = `${d.batteryLevel.toFixed(2)}%`;
        this.elements.chargeRate.textContent = `${d.chargeRate.toFixed(1)}W`;
        this.elements.powerSourceBadge.textContent = this.translate(d.powerSource);
        
        // Status
        this.elements.compressorStatus.textContent = this.translate(d.compressor ? 'running' : 'off');
        this.elements.doorStatus.textContent = this.translate(d.doorOpen ? 'open' : 'closed');
        this.elements.batteryHealth.textContent = this.translate(d.batteryHealth.toLowerCase());
        this.elements.lastUpdate.textContent = new Date(d.lastUpdate).toLocaleTimeString();
        this.elements.compressorCycles.textContent = d.compressorCycles;
        
        // Battery time estimation
        this.elements.batteryTime.textContent = this.calculateBatteryTime();
        
        // Connection status
        if (d.error) {
            this.elements.statusIndicator.className = "error";
            this.elements.statusText.textContent = this.translate('error');
        } else if (d.online) {
            this.elements.statusIndicator.className = "online";
            this.elements.statusText.textContent = this.translate('online');
        } else {
            this.elements.statusIndicator.className = "offline";
            this.elements.statusText.textContent = this.translate('offline');
        }
        
        // Power button state
        if (d.overrideMode) {
            this.elements.powerBtn.className = "btn override";
            this.elements.powerBtn.innerHTML = `<span class="btn-icon"><i class="fas fa-fire"></i></span><span class="btn-text">${this.translate('override')}</span>`;
        } else if (d.compressor) {
            this.elements.powerBtn.className = "btn on";
            this.elements.powerBtn.innerHTML = `<span class="btn-icon"><i class="fas fa-power-off"></i></span><span class="btn-text">${this.translate('powerOn')}</span>`;
        } else {
            this.elements.powerBtn.className = "btn off";
            this.elements.powerBtn.innerHTML = `<span class="btn-icon"><i class="fas fa-power-off"></i></span><span class="btn-text">${this.translate('powerOff')}</span>`;
        }
        
        // Temperature trend indicator
        const trendIcon = {
            rising: "fa-arrow-up",
            falling: "fa-arrow-down",
            steady: "fa-arrow-right"
        }[d.tempTrend];
        this.elements.tempTrend.innerHTML = `<i class="fas ${trendIcon}"></i>`;
        
        // Visual feedback
        this.elements.batteryLevel.classList.toggle('critical', d.batteryLevel < 20);
        this.elements.tempDisplay.classList.toggle('warning', 
            d.temperature > d.setpoint + 3 || d.temperature < d.setpoint - 3);
        this.elements.doorStatus.classList.toggle('warning', d.doorOpen);
        
        // Update charts
        this.updateCharts();
        
        // Update log
        this.updateLogDisplay();
    }

    calculateBatteryTime() {
        if (this.data.compressor) {
            const consumptionRate = 5; // Watts when compressor is running
            const remainingEnergy = (this.data.batteryLevel / 100) * 100; // Assuming 100Wh battery
            const hoursLeft = remainingEnergy / consumptionRate;
            return `${this.translate('battery')}: ${Math.floor(hoursLeft)}h ${Math.floor((hoursLeft % 1) * 60)}m ${this.translate('remaining')}`;
        }
        return `${this.translate('battery')}: >24h ${this.translate('remaining')}`;
    }

    updateLogDisplay() {
        this.elements.logContainer.innerHTML = '';
        this.dataLog.slice().reverse().forEach(entry => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.innerHTML = `
                <span>${entry.timestamp.toLocaleTimeString()}</span>
                <span>${this.translate('temperature')}: ${entry.temperature.toFixed(1)}°C</span>
                <span>${this.translate('battery')}: ${entry.batteryLevel.toFixed(1)}%</span>
                <span>${this.translate('compressor')}: ${entry.compressor ? this.translate('running') : this.translate('off')}</span>
                <span>${this.translate('powerSource')}: ${entry.powerSource}</span>
            `;
            this.elements.logContainer.appendChild(logEntry);
        });
    }

    updateCharts() {
        // Update temperature chart with latest data point
        this.tempChart.data.datasets[0].data = this.data.history.temperature;
        this.tempChart.data.datasets[1].data = Array(7).fill(this.data.setpoint);
        this.tempChart.update();
        
        // Update power chart
        this.powerChart.data.datasets[0].data = this.data.history.solarInput;
        this.powerChart.data.datasets[1].data = this.data.history.batteryUsage;
        this.powerChart.update();
    }

    simulateUpdate() {
        const d = this.data;
        d.lastUpdate = new Date().toISOString();

        // Update solar intensity (varies by time of day)
        d.solarIntensity = this.calculateSolarIntensity();

        // Determine power source
        d.powerSource = d.solarIntensity > 0.3 ? "solar" : "battery";

        // Simulate temperature changes
        const tempChange = this.calculateTempChange();
        d.temperature = Math.max(-20, Math.min(20, d.temperature + tempChange));

        // Simulate battery changes
        this.simulateBattery();

        // Simulate random events
        this.simulateRandomEvents();

        // Update history
        this.updateHistory();

        // Log this update
        this.dataLog.push({
            timestamp: new Date(),
            temperature: d.temperature,
            batteryLevel: d.batteryLevel,
            compressor: d.compressor,
            powerSource: d.powerSource
        });

        // Keep log size manageable
        if (this.dataLog.length > this.maxLogEntries) {
            this.dataLog.shift();
        }

        // Update UI
        this.updateUI();
    }

    calculateTempChange() {
        const d = this.data;
        let change = 0;

        // Gradual adjustment towards the setpoint
        const diff = d.setpoint - d.temperature;
        if (Math.abs(diff) > 0.1) {
            change += diff > 0 ? 0.2 : -0.2; // Adjust temperature gradually
        }

        // Compressor effect
        if (d.compressor || d.overrideMode) {
            change += diff > 0 ? 0.1 : -0.3; // Faster cooling when compressor is active
        }

        // Door open effect
        if (d.doorOpen) {
            change += 0.5; // Increase temperature when the door is open
        }

        // Energy saver effect (less aggressive cooling)
        if (d.energySaver && d.compressor) {
            change *= 0.5; // Reduce cooling effect in energy saver mode
        }

        // Determine trend
        if (change > 0.1) {
            d.tempTrend = "rising";
        } else if (change < -0.1) {
            d.tempTrend = "falling";
        } else {
            d.tempTrend = "steady";
        }

        return change;
    }

    simulateBattery() {
        const d = this.data;
        
        if (d.powerSource === "solar") {
            // Solar charging - more intense at midday
            const chargeAmount = d.solarIntensity * (10 + Math.random() * 5);
            d.chargeRate = chargeAmount;
            
            // If compressor is running, solar first powers it
            if (d.compressor) {
                const powerNeeded = 5 + Math.random() * 3;
                const solarAvailable = chargeAmount;
                
                if (solarAvailable >= powerNeeded) {
                    // Solar covers all needs
                    d.batteryLevel = Math.min(100, d.batteryLevel + (solarAvailable - powerNeeded) / 20);
                } else {
                    // Use battery for remaining power
                    d.batteryLevel = Math.max(0, d.batteryLevel - (powerNeeded - solarAvailable) / 10);
                }
            } else {
                // No compressor - full charge
                d.batteryLevel = Math.min(100, d.batteryLevel + chargeAmount / 15);
            }
        } else {
            // Battery only mode
            d.chargeRate = 0;
            if (d.compressor) {
                d.batteryLevel = Math.max(0, d.batteryLevel - (2 + Math.random()));
            }
        }
        
        // Update battery health
        if (d.batteryLevel < 10) {
            d.batteryHealth = "Critical";
            this.addAlert(this.translate('batteryCriticallyLow'), 'error');
        } else if (d.batteryLevel < 30) {
            d.batteryHealth = "Low";
        } else if (d.batteryLevel > 90) {
            d.batteryHealth = "Full";
        } else {
            d.batteryHealth = "Good";
        }
    }

    simulateRandomEvents() {
        const d = this.data;
        
        // Random door openings (5% chance per update)
        if (Math.random() < 0.05) {
            d.doorOpen = !d.doorOpen;
            const action = d.doorOpen ? this.translate('opened') : this.translate('closed');
            this.addAlert(this.translate('door') + ' ' + action, d.doorOpen ? 'warning' : 'success');
            
            // If door is open, simulate alarm after 2 minutes
            if (d.doorOpen) {
                setTimeout(() => {
                    if (d.doorOpen) {
                        this.addAlert(this.translate('doorOpenTooLong'), 'warning');
                    }
                }, 120000); // 2 minutes in ms
            }
        }
        
        // Connection issues (3% chance)
        if (Math.random() < 0.03) {
            d.online = !d.online;
            this.addAlert(d.online ? this.translate('connectionRestored') : this.translate('connectionLost'), 
                         d.online ? 'success' : 'error');
        }
        
        // System errors (2% chance)
        if (!d.error && Math.random() < 0.02) {
            const errors = [
                this.translate('tempSensorFault'),
                this.translate('compressorOverload'),
                this.translate('batteryCommError'),
                this.translate('solarRegulatorOffline')
            ];
            d.error = errors[Math.floor(Math.random() * errors.length)];
            this.addAlert(this.translate('error') + ': ' + d.error, 'error');
        } else if (d.error && Math.random() < 0.3) {
            this.addAlert(this.translate('errorCleared') + ': ' + d.error, 'success');
            d.error = null;
        }
    }

    calculateSolarIntensity() {
        // Simulate solar intensity throughout the day (0-1 scale)
        const now = new Date();
        const hours = now.getHours() + now.getMinutes() / 60;
        
        // Solar curve (peaks at noon)
        const intensity = Math.sin((hours - 6) * Math.PI / 12);
        return Math.max(0, intensity);
    }

    generateInitialHistory() {
        // Generate 7 days of realistic historical data
        const history = {
            temperature: [],
            solarInput: [],
            batteryUsage: []
        };
        
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Temperature follows a daily pattern
            const baseTemp = 4 + Math.sin(i * 0.5) * 2;
            history.temperature.push(baseTemp + (Math.random() * 1.5 - 0.75));
            
            // Solar input varies by day
            const solarMultiplier = 0.8 + Math.random() * 0.4;
            history.solarInput.push(Math.round(300 * solarMultiplier));
            
            // Battery usage depends on solar and compressor activity
            history.batteryUsage.push(Math.round(150 * (1 - solarMultiplier * 0.7)));
        }
        
        return history;
    }

    updateHistory() {
        // Shift all history arrays and add current day's data
        const h = this.data.history;
        
        // Temperature (average of last 24 readings)
        h.temperature.shift();
        h.temperature.push(this.data.temperature);
        
        // Solar input (simulated daily total)
        h.solarInput.shift();
        h.solarInput.push(Math.round(300 * (0.8 + Math.random() * 0.4)));
        
        // Battery usage
        h.batteryUsage.shift();
        const usage = this.data.powerSource === "battery" ? 
            150 + Math.random() * 100 : 
            50 + Math.random() * 50;
        h.batteryUsage.push(Math.round(usage));
    }

    generateDayLabels(days) {
        const labels = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString(undefined, { weekday: 'short' }));
        }
        
        return labels;
    }

    calculateAverage(arr) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    addAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.innerHTML = `
            <i class="fas fa-${this.getAlertIcon(type)}"></i>
            <div class="alert-content">${message}</div>
            <button class="alert-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to container
        this.elements.alertsContainer.appendChild(alert);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            alert.style.animation = 'slideIn 0.3s reverse';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
        
        // Close button
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.style.animation = 'slideIn 0.3s reverse';
            setTimeout(() => alert.remove(), 300);
        });
    }

    getAlertIcon(type) {
        return {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        }[type];
    }

    startSimulation() {
        // Initial update
        this.simulateUpdate();
        
        // Regular updates every 3 seconds
        this.simulationInterval = setInterval(() => {
            this.simulateUpdate();
        }, 3000);
        
        // Update clock every second
        this.clockInterval = setInterval(() => {
            this.elements.currentTime.textContent = new Date().toLocaleTimeString();
        }, 1000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const fridge = new SolarFridge();
});
