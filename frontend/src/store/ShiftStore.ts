import { create } from "zustand";

type ShiftState = {
    shiftList: Shift[];
};

type ShiftAction = {
  updateShiftList: (name: ShiftState["shiftList"]) => void;
};

export const useShiftStore = create<
  ShiftState & ShiftAction
>()((set) => ({
  shiftList: [],

  updateShiftList: (shiftList: Shift[]) => {
    set(() => ({ shiftList: shiftList }));
  },
}));
