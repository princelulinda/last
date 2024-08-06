// import { Injectable } from '@angular/core';
// import { sleepModeModel } from './sleep-mode.models';
// import { ToggleSleepMode } from './sleep-mode.action';

// //import {
//  //   State,
//   //  StateToken,
//    // Selector,
//    // Action,
//    // StateContext,
//    // Store,
// //}

// const TOGGLE_SLEEP_MODE = new StateToken<sleepModeModel>('sleepMode');

// const defaultSleepMode: any = '';

// @State<sleepModeModel>({
//     // The state's name, this is used to let ngxs identify this state so that it access to its variables
//     name: TOGGLE_SLEEP_MODE,
//     defaults: {
//         sleepMode: false,
//     },
// })
// @Injectable()
// export class SleepModestate {
//     @Selector()
//     static sleepMode(state: sleepModeModel): any {
//         return state.sleepMode;
//     }

//     @Action(ToggleSleepMode)
//     switchSleepMode(
//         ctx: StateContext<sleepModeModel>,
//         action: ToggleSleepMode
//     ) {
//         ctx.patchState({
//             sleepMode: action.payload.sleepMode,
//         });
//     }
// }
