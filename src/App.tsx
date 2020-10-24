import React from "react";
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import "react-simple-keyboard/build/css/index.css";
import { Box } from "@material-ui/core";
import { WordRound } from './WordRound';
import useSound from "use-sound";
const successFx = require('./sounds/success.mp3');
const failFx = require('./sounds/fail.mp3');

const words = [
  "beautiful",
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
  Play  = 'PLAY',
  Blind  = 'BLIND'
}

export interface StateSchema {
    states: {
        [State.Play]: {
          states: {
            [State.Fail]: {},
            [State.Blind]: {},
          }
        },
        [State.Blind]: {
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
                success: State.Blind,
                fail: State.Fail,
            },
        },
        [State.Blind]: {
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
                1000: State.Play,
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
  const [lastError, setLastError] = React.useState<string | undefined>(undefined);
  const word = wordsForGame[i % wordsForGame.length];
  if (state === State.Play) {
    return <WordRound 
      key='play'
      blind={false}
      targetWord={word}
      commonErrorWord={lastError}
      onSuccess={() => {
        send({
          type: 'success'
        });
        playSuccess();
      }}
      onFail={(failWith) => {
        setLastError(failWith)
        send({
          type: 'fail'
        })
        playFail();
      }}
    />
  } else if (state === State.Blind) {
    return <WordRound
      key='blind' 
      blind={true}
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
    return <Box position="fixed" width="100%" height="100%" style={{backgroundColor: 'green'}} />;
  } else {
    return <Box position="fixed" width="100%" height="100%" style={{backgroundColor: 'red'}} />;
  }
};
