import React from "react";
import { Box, Button, Paper } from "@material-ui/core";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const abc = "abcdefghijklmnopqrstuvwxyz".split("");

type WordRoundProps = {
  targetWord: string;
  onSuccess: () => void;
  onFail: () => void;
}

export const WordRound = ({targetWord, onSuccess, onFail}: WordRoundProps) => {
  const ref = React.useRef<any>();
  const [position, setPosition] = React.useState(0);

  React.useEffect(() => {
    if (ref.current) {
      const key = targetWord.split('')[position];
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
        const targetKey = targetWord.split('')[position];
        if (targetKey === key) {
          if (position === targetWord.length - 1) {
            onSuccess();
          } else {
            setPosition(p => p + 1);
          }
        } else {
          onFail();
        }
      }
    };
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keyup", onKey);
    };
  }, [onFail, onSuccess, position, targetWord, setPosition]);

  return (
    <Box position="absolute" width="100%" height="100%" p="10px" display="flex" flexDirection="column" alignItems="center" >
      <Box display="flex" flexDirection="row">
        {targetWord.split("").map((char, index) => {
          return (
            <Box key={index} paddingRight="20px">
              <Paper elevation={3}>
                <Box
                  width="70px"
                  height="90px"
                  textAlign="center"
                  fontSize="70px"
                  color={index < position ? 'green' : '#eee'}
                >
                  {char}
                </Box>
              </Paper>
            </Box>
          );
        })}
      </Box>
      <Box paddingTop="80px" paddingX="80px" alignSelf="stretch">
        <Keyboard
          keyboardRef={(r) => {
            ref.current = r;
          }}
          syncInstanceInputs={true}
          onChange={() => {}}
          onKeyPress={() => {}}
        />
      </Box>
    </Box>
  );
};
