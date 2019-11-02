let textarea = document.createElement("textarea");
textarea.className = "textarea--input";
textarea.cols = 100;
textarea.rows = 10;
document.body.appendChild(textarea);

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    }, 
    eventHandlers: {
        oninput: null,
        onclose: null
    },
    properties: {
        value: "",
        capsLock: false,
    },
    init() {
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        this.elements.main.className = "keyboard";
        this.elements.keysContainer.className = "keys";
        this.elements.keysContainer.appendChild(this.createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".key");
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
        document.querySelectorAll(".textarea--input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    createKeys() {
        let fragment = document.createDocumentFragment();
        let keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "tab","q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?","shift-r",
            "ctrl", "space", "ctr"
        ];
        let localStorage = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "tab","й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
            "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д","ж", "э", "enter",
            "shift", "я", "ч", "c", "м", "и", "т", "ь", "б", "ю", ".","shift-r",
            "ctrl", "space", "ctrl"
        ];
        let eventcode = [
            "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "0", "Delete",
            "Tab","Keyq", "Keyw", "Keye", "Keyr", "Keyt", "Keyy", "Keyu", "Keyi", "Keyo", "Keyp",
            "CapsLock", "Keya", "Keys", "Keyd", "Keyf", "Keyg", "Keyh", "Keyj", "Keyk", "Keyl", "Enter",
            "ShiftLeft", "Keyz", "Keyx", "Keyc", "Keyv", "Keyb", "Keyn", "Keym", ",", "Period", "Slash",
            "ctrl", "Space", "ctrl"
        ];
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };
        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "enter", "shift-r"].indexOf(key) !== -1;

            keyElement.setAttribute("type", "button");
            keyElement.classList.add("key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this.triggerEvent("oninput");
                    });

                    break;
                    
                case "tab":
                        keyElement.classList.add("key--wide");
                        keyElement.innerHTML = createIconHTML("keyboard_tab");
    
                        keyElement.addEventListener("click", () => {
                            this.properties.value += "    ";
                            this.triggerEvent("oninput");
                        });
    
                        break;
                
                case "caps":
                    keyElement.classList.add("key--wide", "key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this.toggleCapsLock();
                        keyElement.classList.toggle("key--active", this.properties.capsLock);
                    });

                    break;

                case "shift":
                        keyElement.classList.add("key--wide");
                        keyElement.innerHTML = createIconHTML("keyboard_arrow_up");
    
                        keyElement.addEventListener("click", () => {
                            this.toggleShift();
                        });
    
                        break;
                        case "shift-r":
                        
                        keyElement.innerHTML = createIconHTML("keyboard_arrow_up");
    
                        keyElement.addEventListener("click", () => {
                            this.toggleShift();
                        });
    
                        break;

                case "enter":
                    keyElement.classList.add("key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this.triggerEvent("oninput");
                    });

                    break;

                    case "ctrl":
                        keyElement.classList.add("key--wide");
                        keyElement.textContent = key.toLowerCase();
    
                        keyElement.addEventListener("click", () => {
                            this.toggleCtrl();
                        });
    
                        break;

                case "space":
                    keyElement.classList.add("key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this.triggerEvent("oninput");
                    });

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this.triggerEvent("oninput")
                    });

                    break;
            }
            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
           
        });
        return fragment;
    },

    triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    toggleShift() {
        this.properties.shift = !this.properties.shift;

    },

    toggleCtrl() {
        this.properties.ctrl = !this.properties.ctrl;

    },
    
    toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
    },
};
window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});

