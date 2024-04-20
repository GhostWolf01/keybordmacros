use once_cell::sync::Lazy;
pub use std::{
    collections::hash_map::HashMap,
    sync::atomic::Ordering,
    sync::{Arc, Mutex},
    thread, time,
};

use inputbot::{KeySequence, KeybdKey, MouseButton};
use winapi::{
    // um::winuser::mouse_event, um::winuser::MOUSEEVENTF_LEFTDOWN, um::winuser::MOUSEEVENTF_LEFTUP,
    um::winuser::MOUSEEVENTF_MOVE,
};

type F = Arc<dyn Fn() + Send + Sync + 'static>;

type KeybdBindMap = HashMap<KeybdKey, F>;
type MouseBindMap = HashMap<MouseButton, F>;

type TKeybdBinds = Lazy<Mutex<KeybdBindMap>>;
type TMouseBinds = Lazy<Mutex<MouseBindMap>>;
static KEYBD_BINDS: TKeybdBinds = Lazy::new(|| Mutex::new(KeybdBindMap::new()));
static MOUSE_BINDS: TMouseBinds = Lazy::new(|| Mutex::new(MouseBindMap::new()));

fn get_keybd_key(key: &str) -> Option<KeybdKey> {
    match key {
        "Backquote" => Some(KeybdKey::BackquoteKey),
        "Numpad0" => Some(KeybdKey::Numpad0Key),
        "Numpad1" => Some(KeybdKey::Numpad1Key),
        "Numpad2" => Some(KeybdKey::Numpad2Key),
        "Numpad3" => Some(KeybdKey::Numpad3Key),
        "Numpad4" => Some(KeybdKey::Numpad4Key),
        "Numpad5" => Some(KeybdKey::Numpad5Key),
        "Numpad6" => Some(KeybdKey::Numpad6Key),
        "Numpad7" => Some(KeybdKey::Numpad7Key),
        "Numpad8" => Some(KeybdKey::Numpad8Key),
        "Numpad9" => Some(KeybdKey::Numpad9Key),
        "NumpadAdd" => Some(KeybdKey::AddKey),
        "Equal" => Some(KeybdKey::EqualKey),
        "Minus" => Some(KeybdKey::MinusKey),
        "NumpadSubtract" => Some(KeybdKey::SubtractKey),
        "NumpadDivide" => Some(KeybdKey::DivideKey),
        "Shift" => Some(KeybdKey::ShiftKey),
        "ShiftLeft" => Some(KeybdKey::LShiftKey),
        "ShiftRight" => Some(KeybdKey::RShiftKey),
        "Control" => Some(KeybdKey::ControlKey),
        "ControlLeft" => Some(KeybdKey::LControlKey),
        "ControlRight" => Some(KeybdKey::RControlKey),
        "Alt" => Some(KeybdKey::AltKey),
        "AltLeft" => Some(KeybdKey::LAltKey),
        "AltRight" => Some(KeybdKey::RAltKey),
        "KeyA" => Some(KeybdKey::AKey),
        "KeyB" => Some(KeybdKey::BKey),
        "KeyC" => Some(KeybdKey::CKey),
        "KeyD" => Some(KeybdKey::DKey),
        "KeyE" => Some(KeybdKey::EKey),
        "KeyF" => Some(KeybdKey::FKey),
        "KeyG" => Some(KeybdKey::GKey),
        "KeyH" => Some(KeybdKey::HKey),
        "KeyI" => Some(KeybdKey::IKey),
        "KeyJ" => Some(KeybdKey::JKey),
        "KeyK" => Some(KeybdKey::KKey),
        "KeyL" => Some(KeybdKey::LKey),
        "KeyM" => Some(KeybdKey::MKey),
        "KeyN" => Some(KeybdKey::NKey),
        "KeyO" => Some(KeybdKey::OKey),
        "KeyP" => Some(KeybdKey::PKey),
        "KeyQ" => Some(KeybdKey::QKey),
        "KeyR" => Some(KeybdKey::RKey),
        "KeyS" => Some(KeybdKey::SKey),
        "KeyT" => Some(KeybdKey::TKey),
        "KeyU" => Some(KeybdKey::UKey),
        "KeyV" => Some(KeybdKey::VKey),
        "KeyW" => Some(KeybdKey::WKey),
        "KeyX" => Some(KeybdKey::XKey),
        "KeyY" => Some(KeybdKey::YKey),
        "KeyZ" => Some(KeybdKey::ZKey),
        "F1" => Some(KeybdKey::F1Key),
        "F2" => Some(KeybdKey::F2Key),
        "F3" => Some(KeybdKey::F3Key),
        "F4" => Some(KeybdKey::F4Key),
        "F5" => Some(KeybdKey::F5Key),
        "F6" => Some(KeybdKey::F6Key),
        "F7" => Some(KeybdKey::F7Key),
        "F8" => Some(KeybdKey::F8Key),
        "F9" => Some(KeybdKey::F9Key),
        "F10" => Some(KeybdKey::F10Key),
        "F11" => Some(KeybdKey::F11Key),
        "F12" => Some(KeybdKey::F12Key),
        "VKey" => Some(KeybdKey::VKey),
        "CapsLock" => Some(KeybdKey::CapsLockKey),
        "Comma" => Some(KeybdKey::CommaKey),
        "Period" => Some(KeybdKey::PeriodKey),
        "Quote" => Some(KeybdKey::QuoteKey),
        "Slash" => Some(KeybdKey::SlashKey),
        "Backslash" => Some(KeybdKey::BackslashKey),
        "Semicolon" => Some(KeybdKey::SemicolonKey),
        "BracketLeft" => Some(KeybdKey::LBracketKey),
        "BracketRight" => Some(KeybdKey::RBracketKey),
        "Backspace" => Some(KeybdKey::BackspaceKey),
        "Enter" => Some(KeybdKey::EnterKey),
        "Tab" => Some(KeybdKey::TabKey),
        "Escape" => Some(KeybdKey::EscapeKey),
        "Space" => Some(KeybdKey::SpaceKey),
        "ArrowLeft" => Some(KeybdKey::LeftKey),
        "ArrowUp" => Some(KeybdKey::UpKey),
        "ArrowRight" => Some(KeybdKey::RightKey),
        "ArrowDown" => Some(KeybdKey::DownKey),
        "BrowserForward" => Some(KeybdKey::BrowserForwardKey),
        "BrowserBack" => Some(KeybdKey::BrowserBackKey),
        _ => None,
    }
}

// fn get_event_key(key: KeybdKey) -> &'static str {
//     match key {
//         KeybdKey::BackquoteKey => "BackquoteKey",
//         KeybdKey::F1Key => "F1Key",
//         KeybdKey::Numpad0Key => "Numpad0Key",
//         KeybdKey::Numpad1Key => "Numpad1Key",
//         KeybdKey::Numpad2Key => "Numpad2Key",
//         KeybdKey::Numpad3Key => "Numpad3Key",
//         KeybdKey::Numpad4Key => "Numpad4Key",
//         KeybdKey::Numpad5Key => "Numpad5Key",
//         KeybdKey::Numpad6Key => "Numpad6Key",
//         KeybdKey::Numpad7Key => "Numpad7Key",
//         KeybdKey::Numpad8Key => "Numpad8Key",
//         KeybdKey::Numpad9Key => "Numpad9Key",
//         KeybdKey::AddKey => "AddKey",
//         KeybdKey::EqualKey => "EqualKey",
//         KeybdKey::MinusKey => "MinusKey",
//         KeybdKey::SubtractKey => "SubtractKey",
//         KeybdKey::LShiftKey => "LShiftKey",
//         KeybdKey::RShiftKey => "RShiftKey",
//         KeybdKey::LControlKey => "LControlKey",
//         KeybdKey::RControlKey => "RControlKey",
//         KeybdKey::LAltKey => "LAltKey",
//         KeybdKey::RAltKey => "RAltKey",
//         _ => "none",
//     }
// }

fn get_mouse_key(key: &str) -> Option<MouseButton> {
    match key {
        "LeftButton" => Some(MouseButton::LeftButton),
        "RightButton" => Some(MouseButton::RightButton),
        "MiddleButton" => Some(MouseButton::MiddleButton),
        "X1Button" => Some(MouseButton::X1Button),
        "X2Button" => Some(MouseButton::X2Button),
        _ => None,
    }
}

fn add_callback(name_key: &str, ac_callback: F) {
    fn ac(odd_callback: &F, ac_callback: &F) -> F {
        let odd_callback = Arc::clone(odd_callback);
        let ac_callback = Arc::clone(ac_callback);
        return Arc::new(move || {
            odd_callback();
            ac_callback();
        });
    }

    if let Some(keybd_key) = { get_keybd_key(name_key) } {
        let mut keybd_binds = KEYBD_BINDS.lock().unwrap();

        let new_callback = match keybd_binds.get(&keybd_key) {
            Some(odd_callback) => ac(odd_callback, &ac_callback),
            None => Arc::clone(&ac_callback),
        };

        keybd_binds.insert(keybd_key, new_callback);
    } else if let Some(keybd_key) = { get_mouse_key(name_key) } {
        let mut keybd_binds = MOUSE_BINDS.lock().unwrap();

        let new_callback = match keybd_binds.get(&keybd_key) {
            Some(odd_callback) => ac(odd_callback, &ac_callback),
            None => Arc::clone(&ac_callback),
        };

        keybd_binds.insert(keybd_key, new_callback);
    }
}

pub fn bind_key(window: tauri::Window, name_key: String) {
    let parts = name_key.split("_");

    let count = parts.clone().count();

    let last = parts.clone().last().unwrap_or("");

    let e: String = format!("press{name_key}");

    match count {
        1 => {
            let ac = |event: String| -> F {
                return Arc::new(move || {
                    window.emit(&event, "").unwrap();
                });
            };

            add_callback(&name_key, ac(e));
        }
        2 => {
            let ac = |event: String, second_key: KeybdKey| -> F {
                return Arc::new(move || {
                    if second_key.is_pressed() {
                        window.emit(&event, "").unwrap();
                    }
                });
            };

            let second_key = get_keybd_key(parts.clone().nth(0).unwrap_or_default()).unwrap();

            add_callback(last, ac(e, second_key));
        }
        3 => {
            let ac = |event: String, second_key: KeybdKey, third_key: KeybdKey| -> F {
                return Arc::new(move || {
                    if second_key.is_pressed() && third_key.is_pressed() {
                        window.emit(&event, "").unwrap();
                    }
                });
            };

            let second_key = get_keybd_key(parts.clone().nth(0).unwrap_or_default()).unwrap();
            let third_key = get_keybd_key(parts.clone().nth(1).unwrap_or_default()).unwrap();

            add_callback(last, ac(e, second_key, third_key));
        }
        _ => (),
    }
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    pressed: u32,
}

pub fn bind_hold_key(window: tauri::Window, name_key: String) {
    let e: String = format!("hold{name_key}");

    if let Some(keybd_key) = { get_keybd_key(&name_key) } {
        let ac = |event: String, hold_key: KeybdKey| -> F {
            return Arc::new(move || {
                window.emit(&event, Payload { pressed: 1 }).unwrap();
                thread::sleep(time::Duration::from_millis(10));
                while hold_key.is_pressed() {
                    window.emit(&event, Payload { pressed: 1 }).unwrap();
                    thread::sleep(time::Duration::from_millis(10));
                }
            });
        };
        add_callback(&name_key, ac(e, keybd_key));
    } else if let Some(keybd_key) = { get_mouse_key(&name_key) } {
        let ac = |event: String, hold_key: MouseButton| -> F {
            return Arc::new(move || {
                window.emit(&event, Payload { pressed: 1 }).unwrap();
                thread::sleep(time::Duration::from_millis(10));
                while hold_key.is_pressed() {
                    window.emit(&event, Payload { pressed: 1 }).unwrap();
                    thread::sleep(time::Duration::from_millis(10));
                }
            });
        };
        add_callback(&name_key, ac(e, keybd_key));
    }
}

pub fn update_binds() {
    let mouse_binds = MOUSE_BINDS.lock().unwrap();
    if !mouse_binds.is_empty() {
        for (key, cl) in mouse_binds.iter() {
            let cl = Arc::clone(cl);
            key.bind(move || cl());
        }
    }
    let keybd_binds = KEYBD_BINDS.lock().unwrap();
    if !keybd_binds.is_empty() {
        for (key, cl) in keybd_binds.iter() {
            let cl = Arc::clone(cl);
            key.bind(move || cl());
        }
    }
}

pub fn update_handle() {
    inputbot::unset_input_events();
    active_handle();
}

pub fn active_handle() {
    update_binds();
    inputbot::handle_input_events();
}

pub fn mouse_move(sensitivity: i32, times: u64, rate: u64) -> bool {
    let mut index = 1;
    while index <= times {
        inputbot::send_mouse_input(MOUSEEVENTF_MOVE, 0, 0, sensitivity);
        thread::sleep(time::Duration::from_millis(rate));
        index += 1;
    }
    return true;
}

pub fn mouse_click(times: u64, rate: u64) -> bool {
    let mut index = 1;
    while index <= times {
        MouseButton::LeftButton.press();
        thread::sleep(time::Duration::from_millis(20));
        MouseButton::LeftButton.release();
        thread::sleep(time::Duration::from_millis(rate));
        index += 1;
    }
    return true;
}

pub fn active_keys(keys_array: Vec<String>) -> bool {
    for key in keys_array {
        let parts = key.split("_");
        let count = parts.clone().count();
        let last = parts.clone().last().unwrap_or("");
        if let Some(keybd_key) = { get_keybd_key(last) } {
            fn key_press(keybd_key: KeybdKey) {
                keybd_key.press();
                thread::sleep(time::Duration::from_millis(10));
                keybd_key.release();
            }
            if count == 1 {
                key_press(keybd_key);
            } else if count == 2 {
                let second_key = get_keybd_key(parts.clone().nth(0).unwrap_or_default()).unwrap();
                second_key.press();
                key_press(keybd_key);
                second_key.release()
            } else if count == 3 {
                let second_key = get_keybd_key(parts.clone().nth(0).unwrap_or_default()).unwrap();
                second_key.press();
                let third_key = get_keybd_key(parts.clone().nth(1).unwrap_or_default()).unwrap();
                third_key.press();
                key_press(keybd_key);
                second_key.release();
                third_key.release();
            }
        } else if let Some(keybd_key) = { get_mouse_key(last) } {
            fn key_press(keybd_key: MouseButton) {
                keybd_key.press();
                thread::sleep(time::Duration::from_millis(10));
                keybd_key.release();
            }
            if count == 1 {
                key_press(keybd_key);
            } else if count == 2 {
                let second_key = get_keybd_key(parts.clone().nth(0).unwrap_or_default()).unwrap();
                second_key.press();
                key_press(keybd_key);
                second_key.release()
            } else if count == 3 {
                let second_key = get_keybd_key(parts.clone().nth(0).unwrap_or_default()).unwrap();
                second_key.press();
                let third_key = get_keybd_key(parts.clone().nth(1).unwrap_or_default()).unwrap();
                third_key.press();
                key_press(keybd_key);
                second_key.release();
                third_key.release();
            }
        }
    }
    return true;
}

pub fn enter_text(text: String) -> bool {
    KeySequence(text).send();
    return true;
}
