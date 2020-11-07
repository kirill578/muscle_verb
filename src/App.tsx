import React from "react";
import "react-simple-keyboard/build/css/index.css";
import { Box, Button, TextareaAutosize } from "@material-ui/core";
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
  const [dictate, setDictate] =  React.useState(false);
  const [words, setWords] = React.useState(demoWords);
  const [results, setResults] = React.useState<undefined | ({ word: string; failedAttempts: number}[])>(undefined);
  if (dictate) {
    return <DictateRound />;
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
      width="100%"
      height="100%"
      p="10px"
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
      <Button onClick={() => setDictate(true)}>Start Dictate</Button>
    </Box>);
  }
};
