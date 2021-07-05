import React from "react";
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import "react-simple-keyboard/build/css/index.css";
import { Box } from "@material-ui/core";
import { WordRound } from './WordRound';
import useSound from "use-sound";
// @ts-ignore
import Jabber from 'jabber';

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
                800: {
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

type Sentence = {
  original: string;
  target: string;
};

export type DictateRoundProps = {
  sentences: Sentence[];
  rate: number;
};

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

export const DictateRound = ({ rate, sentences: inputSentences }: DictateRoundProps) => {
  const [sentences] = React.useState<Sentence[]>(() => shuffleArray([
    ...inputSentences, 
    ...inputSentences, 
    ...inputSentences
  ]));

  const [i, setI] = React.useState(0);
  const sentance = sentences[i % sentences.length];

  const [playSuccess] = useSound(successFx);
  const [playFail] = useSound(failFx);

  const [{ value: state }, send] = useMachine(stateMachine);

  if (state === State.Play) {
    return <WordRound
      key={i} 
      blind={true}
      rate={rate}
      targetWord={sentance.target}
      sayWord={sentance.original}
      onSuccess={() => {
        send({
          type: 'success'
        });
        playSuccess();
        setI(i => i + 1);
      }}
      onFail={(failWith) => {
        if (failWith.length > 1)
          console.log(`${sentance.original} ${sentance.target}\n${failWith} <-- error`)
        send({
          type: 'fail'
        })
        playFail();
        // setI(i => i + 1);
      }}
    />
  } else if (state === State.Success) {
    return <Box position="fixed" width="100%" height="100%" style={{backgroundColor: 'green'}} />;
  } else {
    return <Box display="flex" alignItems="center" justifyContent="center" position="fixed" width="100%" height="100%" style={{backgroundColor: 'red'}}> 
      <Box color="white" fontSize="50px">{sentance.target}</Box>
    </Box>;
  }
};
