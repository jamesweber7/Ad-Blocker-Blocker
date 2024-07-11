
/*=============================================
=            Default Values                   =
=============================================*/
const popup_tagname = 'FAKEVIRUSPOPUP';

/*=============================================
=            POP-UPS!                         =
=============================================*/

// higher weight = more likely
const popups = [
    {
        weight: 10,
        func: random_text_popup,
    },
    {
        weight: 2,
        func: change_color_popup,
    },
    {
        weight: 0.5,
        func: delete_everything,
    },
    {
        weight: 1,
        func: cant_delete,
    },
    {
        weight: 1,
        func: eat_cursor
    },
    {
        weight: 0.5,
        func: bees
    }
]

// chooses between random messages and sometimes buttons
function random_text_popup() {
    const title = getRandomPopupTitle();
    const template = createPopupDivTemplate({title: title, content_float: 'left', max_width: '400px'});
    
    template.content.innerText = getRandomPopupBodyText();

    if (Math.random() < 2/3)
        return;

    // buttons

    template.content.style.display = 'flex';
    template.content.style.flexDirection = 'column';
    const num_buttons = Math.floor(Math.random()*3)+1;

    const button_row = document.createElement('buttonrow');
    template.content.append(button_row);
    for (let i = 0; i < num_buttons; i++) {
        const btn = document.createElement('button');
        btn.innerText = getRandomPopupButtonText();
        if (Math.random() < 0.8)
            btn.addEventListener('click', () => {closePopup(template.container)});
        button_row.append(btn);
    }
}

// gives user option between 2 colors to change text color to
function change_color_popup() {
    const template = createPopupDivTemplate({title: getRandomPopupTitle(), max_width: '400px', no_close_btn: true});

    template.content.style.display = 'flex';
    template.content.style.flexDirection = 'column';

    template.content.innerText = 'select a color';
    
    const button_row = document.createElement('buttonrow');
    template.content.append(button_row);

    const colors = [
        'blue',
        'lime',
        'red',
        'yellow',
        'cyan',
        'pink',
        'green',
        'white'
    ]
    for (let i = 0; i < 2; i++) {
        const btn = document.createElement('button');
        const color = getRandomElement(colors)
        btn.innerText = color;
        btn.addEventListener('click', () => {
            setTextColor(color);
            closePopup(template.container)
        });
        button_row.append(btn);
    }
}

// sets 5 second counter then deletes whole page
function delete_everything() {
    const template = createPopupDivTemplate({title: getRandomPopupTitle(), close_btn_disabled: true});

    let countdown = 5;
    do_countdown();
    function do_countdown() {
        template.content.innerText = `Goodbye! ${countdown}`;
        if (countdown > 0) {
            countdown --;
            setTimeout(do_countdown, 1000);
        } else {
            deleteDocumentBody();
        }
    }
}

function cant_delete() {
    const oh_no_sound = createSound('tts_oh_no.mp3');
    const template = createPopupDivTemplate({title: 'Oh no!', popup_sound: null});
    template.content.innerText = 'oh no!';
    setTimeout(()=>{
        playSound(oh_no_sound);
    },1000)
    template.close_btn.addEventListener('mouseenter', () => {
        randomlyRepositionElement(template.container);
        playSound(oh_no_sound);
        cant_delete();
    })
}

function eat_cursor() {
    const template = createPopupDivTemplate({title: 'Warning!'});
    template.content.innerText = 'The piranha is gonna get ya';
    const img = document.createElement('img');
    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAgCAYAAABQISshAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFYSURBVFhH3ZZtDoIwEEQpiV5Kj6+X0kTsFEpq3ZZ+7C7oSxqIP2BeZwWMuZymwTLdnwZHbvz1uUjlHJcj+w2B5jVXEcB5YwmJHB8iQDtACXac3PJQGb9EQK+M1GaEMjGkCDhiM8DLxPmSIqBFRmID7DWXsxlKJisCJILV8Lo93JqmfIzR2rG9P6SlQ5m4lc1GQElACQk0kSP88xeJgL1HzBjjFjViyFYsAlIy2pKUTJUI2KsZhA8FbA63PNUiIJSRFBuv5+VsGyfS8uTSagYyJUKrgFYwKZpG64j8jYgbrV8fK9DVCB4SnJ84PTQ3EgpwN7r1aULR1EjcwhFaqRbZIzT1Hol/qxLJSWgKxhL2Y9KMpfNdEpRLpqSBmM1GEE5zt1vJirQIcLbiVwqMFJjPE6PVE0jjBRvnIxvp3VWuVmr4EtkjRC1Uxg8RTgntDVlFJG6sd81heAMJQrDUpitLJAAAAABJRU5ErkJggg==';
    img.style.position = 'absolute';
    document.body.append(img);
    let cursor_x, cursor_y;
    document.body.addEventListener('mousemove', (e) => {
        cursor_x = e.pageX;
        cursor_y = e.pageY;
    })
    const fish_width = 50;
    const fish_height = 32;
    let x = 50, y = 50;
    let speed = 10;
    update_piranha();
    function update_piranha() {
        if (getDistSq(x, y, cursor_x, cursor_y) < 50 || (speed**2)/2 > ((cursor_y - y)**2 + (cursor_x - x)**2)) {
            deleteCursor();
            img.classList.add('exit-canvas-left');
            img.addEventListener('animationend', ()=>{img.remove()});
            template.content.innerText = 'Ur cursor has been eaten';
            return;
        }
        const theta = Math.atan2(cursor_y - y, cursor_x - x);
        
        if (!isNaN(theta)) {
            x += speed*Math.cos(theta);
            y += speed*Math.sin(theta);
        }
        speed *= 1.005;
        img.style.left = `${x-fish_width/2}px`;
        img.style.top = `${y-fish_height/2}px`;
        img.style.transform = `rotate(${theta}rad)`;
        setTimeout(update_piranha, 1000/60);
    }
}

// send a bunch of bees out from the cursor
function bees() {
    const template = createPopupDivTemplate({title: 'He stole the honey!', no_close_btn: true});

    let bees_valid = false;

    const him = document.createElement('img');
    him.src = getImageUrl('him.jpg');
    document.body.append(him);
    let him_rect;
    him.addEventListener('load', () => {
        randomlyRepositionElement(him);
        him_rect = him.getBoundingClientRect();
        bees_valid = true;
    });

    let cursor_x, cursor_y;
    document.body.addEventListener('mousemove', (e) => {
        cursor_x = e.pageX;
        cursor_y = e.pageY;
    })

    const btn = document.createElement('button');
    btn.innerText = 'Get Him!';
    btn.addEventListener('click', () => {
        launch_bees();
    }, {once: true});
    template.content.append(btn);

    const bee_els = document.getElementsByClassName('bee');

    const max_bees = 50;
    let num_bees = 0;
    function launch_bees() {
        if (!bees_valid)
            return;
        setCursorImage('beehive.png');
        
        control_bee_launches();
        control_bee_updates();
        control_buzzing();
    }

    function control_bee_launches() {
        if (num_bees > max_bees)
            return;
        if (!bees_valid)
            return;
        launch_bee();
        const max_time_s = Math.min(2.5/max_bees, 0.2);
        const rand_timeout = Math.random()*max_time_s*1000;
        setTimeout(control_bee_launches, rand_timeout);
    }

    function control_bee_updates() {
        if (!bees_valid)
            return;
        update_bees();
        setTimeout(control_bee_updates, 1000/60);
    }

    function control_buzzing() {
        if (!bees_valid)
            return;
        playSound(buzz_sound);
        setTimeout(control_buzzing, 1000/(4+Math.random()*2));
    }

    function launch_bee() {
        num_bees ++;
        playSound(default_sound);

        const bee = document.createElement('img');
        bee.className = 'bee';
        bee.setAttribute('bee-num', num_bees);
        bee.setAttribute('goal-x', him_rect.left + Math.random()*him_rect.width);
        bee.setAttribute('goal-y', him_rect.top + Math.random()*him_rect.height);
        bee.src = getImageUrl('bee.png');
        bee.style.position = 'absolute';
        bee.style.left = cursor_x + 'px';
        bee.style.top = cursor_y + 'px';
        document.body.append(bee);
    }

    function update_bees() {
        [...bee_els].forEach(bee => {
            const bee_rect = bee.getBoundingClientRect();
            const goal_x = Number.parseInt(bee.getAttribute('goal-x'));
            const goal_y = Number.parseInt(bee.getAttribute('goal-y'));
            const speed = 3;
            let theta = Math.atan2(goal_y - bee_rect.y, goal_x - bee_rect.x);
            theta += (Date.now()/2000*Number.parseFloat(bee.getAttribute('bee-num')))% Math.PI/5;
            if (!isNaN(theta)) {
                bee.style.left = bee_rect.left + speed*Math.cos(theta) + 'px';
                bee.style.top = bee_rect.top + speed*Math.sin(theta) + 'px';
                if (goal_x > bee_rect.x) {
                    bee.style.transform = 'scale(1,1)';
                } else {
                    bee.style.transform = 'scale(-1,1)';
                }
            }
        })
        if (!him.classList.contains('bee-shake')) {
            if (bee_els.length > max_bees/2) {
                const half_bee = bee_els[Math.floor(max_bees/2)];
                const half_bee_rect = half_bee.getBoundingClientRect();
                // are >≈ half the bees over him
                if (half_bee_rect.x > him_rect.right)
                    return;
                if (half_bee_rect.x < him_rect.left)
                    return;
                if (half_bee_rect.y > him_rect.bottom)
                    return;
                if (half_bee_rect.y < him_rect.top)
                    return;
                // >≈ half the bees are over him
                him.classList.add('bee-shake');
                him.addEventListener('animationend', () => {
                    deleteDocumentBody();
                    document.body.innerText = 'bee.'
                    bees_valid = false;
                    setCursorImage('bee.png');
                });
            }
        }
    }
}

/*=============================================
=            pop-up helpers                   =
=============================================*/

function createRandomPopup() {
    const popup_func = getRandomPopup();
    popup_func();
    randomlyRepositionElement(getLastPopup());
}

function getRandomPopup() {
    let total_weight = 0;
    popups.forEach(popup => {
        total_weight += popup.weight;
    })
    const key_weight = Math.random()*total_weight;
    let current_weight = 0;
    for (let i = 0; i < popups.length-1; i++) {
        current_weight += popups[i].weight;
        if (current_weight > key_weight)
            return popups[i].func;
    }
    return popups[popups.length-1].func;
}

function startRandomPopupTimer() {
    setRandomPopupTimer();
}

function setRandomPopupTimer() {
    setTimeout(() => {
        createRandomPopup();
        setRandomPopupTimer();
    }, randomTimer());
}

function randomTimer(max_time_s = 10) {
    return Math.random()*max_time_s*1000;
}

function closePopup(popup=getFirstPopup()) {
    if (!popup)
        return;
    popup.remove();
}

function getPopups() {
    return [...document.getElementsByTagName(popup_tagname)];
}

function getFirstPopup() {
    return getPopups()[0];
}

function getLastPopup() {
    const popups = getPopups();
    return popups[popups.length - 1];
}

function createPopupDivTemplate(options={}) {
    configureDefaults(options, {
        title: "",
        no_close_popup_on_close_click: false,
        no_close_btn: false,
        close_btn_disabled: false,
        content_float: null,
        max_width: null,
        max_height: null,
        popup_sound: getRandomSoundEffect(),
    })
    const popup = document.createElement(popup_tagname);
    if (options.max_width)
        popup.style.maxWidth = options.max_width;
    if (options.max_height)
        popup.style.maxHeight = options.max_height;    

    const header = document.createElement('header');
    header.innerText = options.title;

    const close_btn = document.createElement('button');
    if (!options.no_close_btn) {
        close_btn.className = 'close';
        if (options.close_btn_disabled)
            close_btn.classList.add('disabled');
        if (!options.no_close_popup_on_click && !options.close_btn_disabled)
            close_btn.addEventListener('click', ()=>{closePopup(popup)});
        close_btn.innerText = '×'
        header.append(close_btn);
    }

    const content = document.createElement('content');
    if (options.content_float)
        content.style.float = options.content_float;


    popup.prepend(header);
    popup.append(content);

    document.body.append(popup);
    playSound(options.popup_sound);

    randomlyRepositionElement(popup);

    return {
        container: popup,
        header: header,
        content: content,
        close_btn: close_btn,
    }
}

function randomlyRepositionElement(el) {
    const el_rect = el.getBoundingClientRect();
    el.style.top = `${Math.random() * (window.innerHeight - el_rect.height)}px`;
    el.style.left = `${Math.random() * (window.innerWidth - el_rect.width)}px`;
}

function playRandomSoundEffect() {
    playSound(getRandomSoundEffect());
}

function getRandomSoundEffect() {
    if (Math.random() < 0.75) {
        return default_sound;
    }
    return getRandomElement(sounds);
}

function playSound(sound) {
    if (!sound || !sound.cloneNode)
        return;
    try {
        const audio_clone = sound.cloneNode();
        audio_clone.play();
    } catch {
        // unable to play audio yet
    }
}

function getRandomPopupTitle() {
    const titles = [
        'Warning',
        'Error',
        'Uh Oh',
        "Something went wrong (it's the virus)",
        'ナイトメア ナイトメア ナイトメア ナイトメア'
    ]
    let title = getRandomElement(titles);
    if (Math.random() < 0.25)
        title = title.toUpperCase();
    return title;
}

function getRandomPopupBodyText() {
    const content_texts = [
        'What',
        'Bruh',
        'Meme',
        'You have virus',
        'the hat man will arrive in 0',
        'your computer will blow up now',
        'I am nigerian prince. I need USD 20000 dollar  You give.',
        'あなたはウイルスを持っています、私はウイルスです、そして私はあなたを殺しますウイルスウイルスウイルス私はあなたを食べます仲間'
    ];
    return getRandomElement(content_texts);
}

function getRandomPopupButtonText() {
    const button_texts = [
        'ok',
        'dont',
        'stop',
        'cancel',
        'ナイトメア',
        'go'
    ];
    return getRandomElement(button_texts);
}