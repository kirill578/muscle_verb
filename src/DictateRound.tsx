import React from "react";
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import "react-simple-keyboard/build/css/index.css";
import { Box } from "@material-ui/core";
import { WordRound } from './WordRound';
import useSound from "use-sound";
const successFx = require('./sounds/success.mp3');
const failFx = require('./sounds/fail.mp3');

enum State {
  Success = 'SUCCESS',
  Fail = 'FAIL',
  Play  = 'PLAY',
}

interface StateSchema {
    states: {
        [State.Play]: {
          states: {
            [State.Fail]: {},
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
                success: State.Play,
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



const createRandomNumber = (length: number) => [...new Array(length)].map(i => (Math.floor(Math.random() * 10)) ).map(n => `${n}`).join(' ');
const createSetOfNumbers = (length: number, count: number)  => [...new Array(count)].map(_ => createRandomNumber(length));

export type DictateRoundProps = {
  length: number;
  rate: number;
}

export const DictateRound = ({ length, rate }: DictateRoundProps) => {
  const [words] = React.useState(createSetOfNumbers(length, 100));
  const [i, setI] = React.useState(0);
  const word = words[i % words.length];

  const [playSuccess] = useSound(successFx);
  const [playFail] = useSound(failFx);

  const [{ value: state }, send] = useMachine(stateMachine);

  if (state === State.Play) {
    return <WordRound
      key={i} 
      blind={true}
      rate={rate}
      targetWord={word.replace(/\s/g, "")}
      sayWord={word}
      onSuccess={() => {
        send({
          type: 'success'
        });
        playSuccess();
        setI(i => i + 1);
      }}
      onFail={(failWith) => {
        if (failWith.length > 1)
          console.log(`${word}\n${failWith} <-- error`)
        send({
          type: 'fail'
        })
        playFail();
        setI(i => i + 1);
      }}
    />
  } else if (state === State.Success) {
    return <Box position="fixed" width="100%" height="100%" style={{backgroundColor: 'green'}} />;
  } else {
    return <Box position="fixed" width="100%" height="100%" style={{backgroundColor: 'red'}} />;
  }
};
