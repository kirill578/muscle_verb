import React from "react";
import { Box } from "@material-ui/core";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { WordRow, LetterType } from "./LetterRow";
import { SpeechContext } from "./speech";

const abc = "abcdefghijklmnopqrstuvwxyz ".split("");

type WordRoundProps = {
  rate?: number;
  blind: boolean;
  targetWord: string;
  sayWord?: string;
  commonErrorWord?: string;
  onSuccess: () => void;
  onFail: (failWith: string) => void;
};

export const WordRound = ({
  rate,
  blind,
  targetWord,
  sayWord,
  commonErrorWord,
  onSuccess,
  onFail,
}: WordRoundProps) => {
  const ref = React.useRef<any>();
  
  const [buffer, setBuffer] = React.useState('');
  const position = buffer.length;

  const speechLang = React.useContext(SpeechContext);
  React.useEffect(() => {
    const msg = new SpeechSynthesisUtterance(sayWord || targetWord);
    msg.voice = speechSynthesis.getVoices().find(voice => voice.lang === 'tr-TR')!;
    if (rate) {
      msg.rate = rate;
    }
    msg.lang = 'en-UK';
    window.speechSynthesis.speak(msg);
    return () => window.speechSynthesis.cancel();
  }, [rate, sayWord, targetWord, speechLang]);

  React.useEffect(() => {
    const key = targetWord.split("")[position];
    if (ref.current) {
      abc
        .filter((char) => char !== key)
        .forEach((char) =>
          ref.current.physicalKeyboard.handleHighlightKeyUp({
            key: char,
            code: "key",
          })
        );
      ref.current.physicalKeyboard.handleHighlightKeyDown({
        key,
        code: "key",
      });
    }
  }, [position, targetWord, sayWord, rate]);

  React.useEffect(() => {
    const onKey = ({ key }: any) => {
      if (abc.includes(key)) {
        const targetKey = targetWord.split("")[position];
        if (targetKey === key) {
          if (position === targetWord.length - 1) {
            onSuccess();
          } else {
            setBuffer((p) => p + key);
          }
        } else {
          onFail(buffer + key);
        }
      }
    };
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keyup", onKey);
    };
  }, [onFail, onSuccess, position, targetWord, setBuffer, buffer, sayWord]);

  const highlightPosition = !commonErrorWord ? undefined : targetWord.split('').findIndex((targetChar, targetIndex) => commonErrorWord.split('')[targetIndex] !== targetChar);


  return (
    <Box
      position="absolute"
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box display="flex" flexDirection="row" margin="10px">
        <WordRow
          word={targetWord.split("").map((char, index) => {
            if (!blind && highlightPosition !== undefined && index === highlightPosition && index >= position) {
              return {
                char,
                type: LetterType.Highlight,
              };
            } else if (blind && !(index < position)) {
              return undefined;
            } else {
              return {
                char,
                type: (index < position ? LetterType.Correct : LetterType.Faded),
              };
            }
          })}
        />
      </Box>      
      <Box display="flex" flexDirection="row" margin="10px">
        <WordRow
          word={sayWord!.split("").map((char, index) => {
              return {
                char,
                type: LetterType.Correct,
              };
          })}
        />
      </Box>
      {!blind && (
        <Box paddingTop="80px" paddingX="80px" alignSelf="stretch">
          <Keyboard
            keyboardRef={(r) => {
              ref.current = r;
            }}
            onChange={() => {}}
            onKeyPress={() => {}}
          />
        </Box>
      )}
    </Box>
  );
};
