import React from "react";
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import "react-simple-keyboard/build/css/index.css";
import { WordRound } from './WordRound';
import useSound from "use-sound";
const successFx = require('./sounds/success.mp3');
const failFx = require('./sounds/fail.mp3');

const words = [
  "didactic",
  "esteem",
  "Unfortunately",
  "curiosity",
  "believe",
  "Unfortunately",
  "Interesting",
  "quickly",
  "processor",
  "Rabbit",
  "cancelled",
  "inspiration",
  "Possibly",
  "especially",
  "improvement",
  "existing",
  "happening",
  "allowed",
  "behavior",
  "crucial",
  "Existing",
  "stretch",
  'shuffle'
].map(w => w.toLocaleLowerCase());


enum State {
  Success = 'SUCCESS',
  Fail = 'FAIL',
  Play  = 'PLAY'
}

export interface StateSchema {
    states: {
        [State.Play]: {
          states: {
            [State.Fail]: {},
            [State.Success]: {},
          }
        },
        [State.Fail]: {
          states: {
            [State.Play]: {},
          }
        };
        [State.Success]: {
          states: {
            [State.Play]: {},
          }
        };
    };
}

export type StateEvent =
    | { type: 'success' }
    | { type: 'fail' };

export const stateMachine = Machine<
    {},
    StateSchema,
    StateEvent
>({
    id: 'success',
    initial: State.Play,
    context: {
    },
    states: {
        [State.Play]: {
            on: {
                success: State.Success,
                fail: State.Fail,
            },
        },
        [State.Fail]: {
            after: {
                200: {
                    target: State.Play,
                    actions: [],
                },
            },
        },
        [State.Success]: {
            after: {
                2000: State.Play,
            },
        },
    },
});

function shuffleArray<T>(originalArray: T[]): T[] {
  const array = originalArray;
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}

const wordsForGame = shuffleArray(words);

export const App = () => {
  const [playSuccess] = useSound(successFx);
  const [playFail] = useSound(failFx);

  const [{ value: state }, send] = useMachine(stateMachine);
  const [i, setI] = React.useState(0);
  const word = wordsForGame[i];
  if (state === State.Play) {
    return <WordRound 
      targetWord={word}
      onSuccess={() => {
        send({
          type: 'success'
        });
        playSuccess();
        setI(i => i + 1);
      }}
      onFail={() => {
        send({
          type: 'fail'
        })
        playFail();
      }}
    />
  } else if (state === State.Success) {
    return <>success</>;
  } else {
    return <>fail</>;
  }
};
