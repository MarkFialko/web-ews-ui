export type CallPanelFocusField =
  | "call-internal"
  | "call-city"
  | "call-mobile"
  | "call-self"
  | "call-custom-phone"
  | "call-outcome-message"
  | "call-callback-datetime";

export type CallPanelDraftState = {
  activeView: "call" | "callHistory";
  selectedTarget: "internal" | "city" | "mobile" | "self" | null;
  userChangedTarget: boolean;
  dialCustomPhoneActive: boolean;
  dialCustomPhone: string;
  selectedOutcome: "connected" | "busy" | "callback" | null;
  messageDraft: string;
  messageDirty: boolean;
  callbackPreset: string;
  callbackDateText: string;
  callbackTimeText: string;
  callbackDateTimeText: string;
  lastFocusedField: CallPanelFocusField | null;
};
