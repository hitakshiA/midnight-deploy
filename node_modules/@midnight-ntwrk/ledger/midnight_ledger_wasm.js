import * as wasm from "./midnight_ledger_wasm_bg.wasm";
export * from "./midnight_ledger_wasm_bg.js";
import { __wbg_set_wasm } from "./midnight_ledger_wasm_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
