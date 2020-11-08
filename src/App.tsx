import React from "react";
import "react-simple-keyboard/build/css/index.css";
import { Box, Button, TextareaAutosize, Input } from "@material-ui/core";
import Slider from '@material-ui/core/Slider';
import { Round } from './Round';
import { DictateRound } from './DictateRound';

const demoWords = [
  "beautiful",
  "didactic",
  "esteem",
  "Unfortunately",
  "curiosity",
  "believe",
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



export const App = () => {
  const [playing, setPlaying] =  React.useState(false);
  const [rate, setRate] =  React.useState(1);
  const [length, setLength] =  React.useState(6);
  const [dictate, setDictate] =  React.useState(false);
  const [words, setWords] = React.useState(demoWords);
  const [results, setResults] = React.useState<undefined | ({ word: string; failedAttempts: number}[])>(undefined);
  if (dictate) {
    return <DictateRound length={length} rate={rate} />;
  }
  if (playing) {
    return (<Round 
      onResult={(result) => {
        console.log(result);
        const sorted = Object.entries(result).sort((a, b) => b[1].failedAttempts - a[1].failedAttempts).map(w => ({ word: w[0], failedAttempts: w[1].failedAttempts}));
        setResults(sorted);
        const array = sorted.map(w => w.word);
        setWords(array);
        setPlaying(false);
      }}
      multiply={3}
      words={words.filter(w => w.length > 0).map(w => w.toLocaleLowerCase()).map(w => w.trim())}
    />);
  } else {
    return (<Box
      position="absolute"
      top="10px"
      bottom="10px"
      left="10px"
      right="10px"
      display="flex"
      flexDirection="column"
      alignItems="center"
    > 
      {results && results.map((r, i) => {
        return <Box key={i}>{r.failedAttempts} - {r.word}</Box>
      })}
      <TextareaAutosize value={words.join('\n')} onChange={(e) => {
        if (e.target && e.target.value) {
          const value = e.target.value;
          setWords(value.toLocaleString().split('\n'));
          console.log(value)
        }
      }} />
      <Button onClick={() => setPlaying(true)}>Start</Button>
      <Box width="200px">
        Speech Rate:
        <Slider
          value={rate}
          onChange={(event, newValue) => setRate(newValue as number)}
          defaultValue={1}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={0.1}
          min={0.3}
          max={2}
        />
      </Box>
      <Box width="200px">
        Length:
        <Slider
          value={length}
          onChange={(event, newValue) => setLength(newValue as number)}
          defaultValue={6}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          min={3}
          max={15}
        />
      </Box>
      <Button onClick={() => setDictate(true)}>Start Dictate</Button>
    </Box>);
  }
};
