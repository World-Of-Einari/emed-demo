import { EventEmitter } from "events";

// Simple event emitter to notify when a lead is saved, so we can update the UI in real time.
// Obviously wouldn't work with multiple server instances, but good enough for this demo.
export const leadEvents = new EventEmitter();
export const LEAD_SAVED_EVENT = "lead:saved";
