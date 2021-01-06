import React, { useEffect } from "react";
import "react-simple-keyboard/build/css/index.css";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextareaAutosize,
} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import { Round } from "./Round";
import { DictateRound, WordType } from "./DictateRound";

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { SpeechContext } from "./speech";

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
  "shuffle",
].map((w) => w.toLocaleLowerCase());

const typeMap = {
  letters: WordType.Letters,
  numbers: WordType.Numbers,
  numbersDT: WordType.NumbersDoubleAndTriple,
  "alpha-numeric": WordType.AlphaNumeric,
  word: WordType.Word,
};

function getSpeech(): Promise<SpeechSynthesisVoice[]> {
  return new Promise(
      function (resolve, reject) {
          let synth = window.speechSynthesis;
          let id: NodeJS.Timeout;

          id = setInterval(() => {
              if (synth.getVoices().length !== 0) {
                  resolve(synth.getVoices());
                  clearInterval(id);
              }
          }, 10);
      }
  )
}

export const App = () => {
  const [dictateSet, setDictateSet] = React.useState<
    "letters" | "numbers" | "alpha-numeric"
  >("letters");
  const [playing, setPlaying] = React.useState(false);
  const [rate, setRate] = React.useState(1);
  const [length, setLength] = React.useState(6);
  const [dictate, setDictate] = React.useState(false);
  const [words, setWords] = React.useState(demoWords);
  const [results, setResults] = React.useState<
    undefined | { word: string; failedAttempts: number }[]
  >(undefined);


  const [voices, setVoices] = React.useState<string[]>([]);
  useEffect(() => {
    (async () =>  {
      setVoices((await getSpeech()).map(voice => voice.name).filter(x => x.includes("")))
    })();
  }, []);
  const [voice, setLang] = React.useState<string | undefined>('Default voice');


  if (dictate) {
    return (
      <SpeechContext.Provider value={voice}>
        <DictateRound length={length} rate={rate} type={typeMap[dictateSet]} />
      </SpeechContext.Provider>
    );
  }
  if (playing) {
    return (
      <SpeechContext.Provider value={voice}>
        <Round
          onResult={(result) => {
            console.log(result);
            const sorted = Object.entries(result)
              .sort((a, b) => b[1].failedAttempts - a[1].failedAttempts)
              .map((w) => ({ word: w[0], failedAttempts: w[1].failedAttempts }));
            setResults(sorted);
            const array = sorted.map((w) => w.word);
            setWords(array);
            setPlaying(false);
          }}
          multiply={3}
          words={words
            .filter((w) => w.length > 0)
            .map((w) => w.toLocaleLowerCase())
            .map((w) => w.trim())}
        />
      </SpeechContext.Provider>
    );
  } else {
    return (
      <Box
        position="absolute"
        top="10px"
        bottom="10px"
        left="10px"
        right="10px"
        display="flex"
        flexDirection="row"
        justifyContent="space-around"
      >
        <Box display="flex" flexDirection="column" alignItems="top">
          <Box m="10px" fontSize="25px">Practice spelling:</Box>
          {results &&
            results.map((r, i) => {
              return (
                <Box key={i}>
                  {r.failedAttempts} - {r.word}
                </Box>
              );
            })}
          <TextareaAutosize
            value={words.join("\n")}
            onChange={(e) => {
              if (e.target && e.target.value) {
                const value = e.target.value;
                setWords(value.toLocaleString().split("\n"));
                console.log(value);
              }
            }}
          />
          <Button onClick={() => setPlaying(true)}>Start</Button>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box m="10px" fontSize="25px">Practice writing down when dictated:</Box>
          <Box width="200px">
            Speech Rate: {rate}
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
            Length: {length}
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
          <FormControl component="fieldset">
            <FormLabel component="legend">Type</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={dictateSet}
              onChange={(e, value) => setDictateSet(() => value as any)}
            >
              <FormControlLabel
                value="letters"
                control={<Radio />}
                label="letters"
              />
              <FormControlLabel
                value="numbers"
                control={<Radio />}
                label="numbers"
              />
              <FormControlLabel
                value="numbersDT"
                control={<Radio />}
                label="numbers + double + triple"
              />
              <FormControlLabel
                value="alpha-numeric"
                control={<Radio />}
                label="alpha-numeric"
              />
              <FormControlLabel
                value="word"
                control={<Radio />}
                label="word (lorem ipsum)"
              />
            </RadioGroup>
          </FormControl>
          <Box>
            <Select
                value={voice || 'Default Voice'}
                onChange={(x) => setLang(x.target.value as any)}
              >
                <MenuItem disabled value={'Default voice'}>Default Voice</MenuItem>
                {voices.map((voice, i) => <MenuItem key={i} value={voice}>{voice}</MenuItem>)}
            </Select>
          </Box>
          <Button onClick={() => setDictate(true)}>Start</Button>
        </Box>
      </Box>
    );
  }
};
