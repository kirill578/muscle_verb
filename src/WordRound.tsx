import React from "react";
import { Box } from "@material-ui/core";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { WordRow, LetterType } from "./LetterRow";

const abc = "abcdefghijklmnopqrstuvwxyz".split("");

type WordRoundProps = {
  blind: boolean;
  targetWord: string;
  commonErrorWord?: string;
  onSuccess: () => void;
  onFail: (failWith: string) => void;
};

export const WordRound = ({
  blind,
  targetWord,
  commonErrorWord,
  onSuccess,
  onFail,
}: WordRoundProps) => {
  const ref = React.useRef<any>();
  
  const [buffer, setBuffer] = React.useState('');
  const position = buffer.length;

  React.useEffect(() => {
    if (position === 0) {
      var msg = new SpeechSynthesisUtterance(targetWord);
      window.speechSynthesis.speak(msg);
    }
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
  }, [position, targetWord]);

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
  }, [onFail, onSuccess, position, targetWord, setBuffer, buffer]);

  const highlightPosition = !commonErrorWord ? undefined : targetWord.split('').findIndex((targetChar, targetIndex) => commonErrorWord.split('')[targetIndex] !== targetChar);


  return (
    <Box
      position="absolute"
      width="100%"
      height="100%"
      p="10px"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box display="flex" flexDirection="row">
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
