
const default_func = () => {};

var default_sound = null;
var sounds = [];

var buzz_sound = null;

setup();

function setup() {
    loadSounds();
    startRandomPopupTimer();
}

function loadSounds() {
    default_sound = createSound('default.mp3');
    default_sound.volume = 0.5;
    const sound_filenames = [
        'computer1.wav',
        'computer2.mp3',
        'tts_error.mp3',
        'tts_oh_no.mp3',
        'tts_warning.mp3',
    ];
    sound_filenames.forEach(filename => {
        sounds.push(createSound(filename));
    });

    buzz_sound = createSound('buzz.mp3');
}


/*=============================================
=            generic helpers                  =
=============================================*/

// return random element in arr
function getRandomElement(arr) {
    if (!Array.isArray(arr))
        throw 'Invalid Argument Exception: getRandomElement expected argument Array';
    return arr[Math.floor(Math.random()*arr.length)];
}

function configureDefaults(options, default_vals, overwrite_vals) {
    Object.keys(default_vals).forEach(key => {
        options[key] = overwriteDefault(options[key], default_vals[key], overwrite_vals);
    })
    return options;
}

function overwriteDefault(param_val, default_val, overwrite_vals=[]) {
    return [undefined, ...overwrite_vals].includes(param_val) ? default_val : param_val;
}

function getImageUrl(filename) {
    return chrome.runtime.getURL(`images/${filename}`);
}

function getSoundUrl(filename) {
    return chrome.runtime.getURL(`sounds/${filename}`);
}

function createImg(filename) {
    const img = document.createElement('img');
    img.src = getImageUrl(filename);
    return img;
}

function createSound(filename) {
    const sound = document.createElement('audio');
    sound.src = getSoundUrl(filename);
    document.body.append(sound);
    return sound;
}

function setTextColor(color) {
    if (!color) {
        color = 'rgba(0,0,0,0)';
    }
    styleAll({text: `color: ${color} !important;`});
}

function styleAll(options={}) {
    configureDefaults(options, {
        id: '',
        text: '',
    });
    let style;
    if (options.id && document.getElementById(options.id)) {
        style = document.getElementById(options.id);
    } else {
        style = document.createElement('style');
        style.id = options.id;
    }
    document.head.append(style);
    if (options.text) {
    style.innerText = `
        * {
            ${options.text}
        }`;
    }
    return style;
}

function deleteDocumentBody() {
    document.body.remove();
    document.body = document.createElement('body');
}

function getDistSq(x1, y1, x2, y2) {
    return (y2-y1)**2+(x2-x1)**2;
}

function setCursor(cursor_name) {
    styleAll({text: `cursor: ${cursor_name} !important;`});
} 

function deleteCursor() {
    setCursor('none');
}

function setCursorUrl(cursor_url) {
    setCursor(`url(${cursor_url}), auto`);
}

function setCursorImage(cursor_img_filename) {
    setCursorUrl(getImageUrl(cursor_img_filename));
}