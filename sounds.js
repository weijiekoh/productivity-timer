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

// Play soothing "dum-da" for end of work phase
function playWorkEndSound() {
    initAudio();
    const now = audioContext.currentTime;

    // "Dum" - lower tone
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.4, now + 0.05);
    gain1.gain.linearRampToValueAtTime(0.3, now + 0.2);
    gain1.gain.linearRampToValueAtTime(0, now + 0.5);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // "Da" - slightly higher, softer
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(330, now + 0.35);
    gain2.gain.setValueAtTime(0, now + 0.35);
    gain2.gain.linearRampToValueAtTime(0.3, now + 0.4);
    gain2.gain.linearRampToValueAtTime(0.2, now + 0.55);
    gain2.gain.linearRampToValueAtTime(0, now + 0.9);
    osc2.start(now + 0.35);
    osc2.stop(now + 0.9);
}

// Play uplifting "da-ding" for end of rest phase
function playRestEndSound() {
    initAudio();
    const now = audioContext.currentTime;

    // "Da" - starting tone (deeper)
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(262, now); // C4
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.3, now + 0.04);
    gain1.gain.linearRampToValueAtTime(0.15, now + 0.2);
    gain1.gain.linearRampToValueAtTime(0, now + 0.4);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // "Ding" - warm, gentle rise
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(392, now + 0.25); // G4
    gain2.gain.setValueAtTime(0, now + 0.25);
    gain2.gain.linearRampToValueAtTime(0.3, now + 0.29);
    gain2.gain.linearRampToValueAtTime(0.2, now + 0.6);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
    osc2.start(now + 0.25);
    osc2.stop(now + 1.2);
}
