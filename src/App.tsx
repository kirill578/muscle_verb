import React from "react";
import "react-simple-keyboard/build/css/index.css";
import { Box, Button, TextareaAutosize } from "@material-ui/core";
import { Round } from './Round';

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
  const [playing, setPlaying] = React.useState(false);
  const [words, setWords] = React.useState(demoWords);
  if (playing) {
    return (<Round 
      onResult={(result) => {
        console.log(result);
        const array = Object.entries(result).sort((a, b) => a[1].failedAttempts - b[1].failedAttempts).map(w => w[0]);
        setWords(array);
      }}
      multiply={3}
      words={words.filter(w => w.length > 0)}
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
      <TextareaAutosize value={words.join('\n')} onChange={(e) => {
        if (e.target && e.target.value) {
          const value = e.target.value;
          setWords(value.toLocaleString().split('\n'));
          console.log(value)
        }
      }} />
      <Button onClick={() => setPlaying(true)}>Start</Button>
    </Box>);
  }
};
