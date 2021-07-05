import React, { useEffect } from "react";
import "react-simple-keyboard/build/css/index.css";
import {
  Box,
  Button,
  TextareaAutosize,
} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import { DictateRound } from "./DictateRound";

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { SpeechContext } from "./speech";


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

const demo = `derim;I say
dersin;you say
der;He says
deriz;We say
dersiniz;Yall say
derler;They say

diyorum; I am saying
diyorsun; You are saying
diyor; He is saying
diyoruz; We are saying
diyorsunuz; Yall are saying
diyorlar; They are saying

`;

export const App = () => {
  const [payload, setPayload] = React.useState<string>(demo);
  const [rate, setRate] = React.useState(1);
  const [dictate, setDictate] = React.useState(false);


  const [voices, setVoices] = React.useState<string[]>([]);
  useEffect(() => {
    (async () =>  {
      setVoices((await getSpeech()).map(voice => voice).filter(v => v.lang === 'tr-TR').map(v => v.name))
    })();
  }, []);
  const [voice, setLang] = React.useState<string | undefined>('Default voice');

  const sentences = payload.split("\n").filter(line => line).map(line => {
    console.log(line)
    const [first, second] = line.split(";").map(sen => sen.trim());
    return {
      original: first,
      target: second.toLocaleLowerCase(),
    }
  })

  if (dictate) {
    return (
      <SpeechContext.Provider value={voice}>
        <DictateRound rate={rate} sentences={sentences} />
      </SpeechContext.Provider>
    );
  }
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
          <TextareaAutosize
            value={payload}
            onChange={(e) => {
              if (e.target && e.target.value) {
                const value = e.target.value;
                setPayload(value);
              }
            }}
          />
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
          <a href="https://github.com/kirill578/muscle_verb">contribute on github</a>
        </Box>
      </Box>
    );
};
