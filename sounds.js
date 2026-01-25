// Audio context (shared)
let audioContext = null;

// Initialize audio context on first user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

// Create a tone with envelope
function createTone(freq, startTime, envelope) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Apply envelope
    gain.gain.setValueAtTime(0, startTime);
    for (const point of envelope) {
        if (point.type === 'linear') {
            gain.gain.linearRampToValueAtTime(point.value, startTime + point.time);
        } else if (point.type === 'exponential') {
            gain.gain.exponentialRampToValueAtTime(point.value, startTime + point.time);
        }
    }

    return { osc, gain };
}

// Play soothing "dum-da" for end of work phase
function playWorkEndSound() {
    initAudio();
    const now = audioContext.currentTime;

    // "Dum" - lower tone
    const tone1 = createTone(220, now, [
        { type: 'linear', value: 0.4, time: 0.05 },
        { type: 'linear', value: 0.3, time: 0.2 },
        { type: 'linear', value: 0, time: 0.5 }
    ]);
    tone1.osc.start(now);
    tone1.osc.stop(now + 0.5);

    // "Da" - slightly higher, softer
    const tone2 = createTone(330, now + 0.35, [
        { type: 'linear', value: 0.3, time: 0.05 },
        { type: 'linear', value: 0.2, time: 0.2 },
        { type: 'linear', value: 0, time: 0.55 }
    ]);
    tone2.osc.start(now + 0.35);
    tone2.osc.stop(now + 0.9);
}

// Play uplifting "da-ding" for end of rest phase
function playRestEndSound() {
    initAudio();
    const now = audioContext.currentTime;

    // "Da" - starting tone (C4)
    const tone1 = createTone(262, now, [
        { type: 'linear', value: 0.3, time: 0.04 },
        { type: 'linear', value: 0.15, time: 0.2 },
        { type: 'linear', value: 0, time: 0.4 }
    ]);
    tone1.osc.start(now);
    tone1.osc.stop(now + 0.4);

    // "Ding" - warm, gentle rise (G4)
    const tone2 = createTone(392, now + 0.25, [
        { type: 'linear', value: 0.3, time: 0.04 },
        { type: 'linear', value: 0.2, time: 0.35 },
        { type: 'exponential', value: 0.01, time: 0.95 }
    ]);
    tone2.osc.start(now + 0.25);
    tone2.osc.stop(now + 1.2);
}
