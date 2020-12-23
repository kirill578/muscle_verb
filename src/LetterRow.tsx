import React from "react";
import { Box, Paper } from "@material-ui/core";

export enum LetterType {
  Faded,
  Correct,
  Highlight,
}

type Letter = {
  char: string;
  type: LetterType;
};

type WordRowProps = {
  word: (Letter | undefined)[];
};

const letterTypeToColor = (type: LetterType | undefined) => {
  switch (type) {
    case LetterType.Faded:
      return "#eee";
    case LetterType.Correct:
      return "green";
    case LetterType.Highlight:
      return "brown";
    default:
      return "#eee";
  }
};

export const WordRow = ({ word }: WordRowProps) => {
  return (
    <Box display="flex" flexDirection="row">
      {word.map((letter, index) => {
        return (
          <Box key={index} paddingRight="7px">
            <Paper elevation={3}>
              <Box
                width="35px"
                height="55px"
                textAlign="center"
                fontSize="45px"
                lineHeight="1"
                color={letterTypeToColor(letter ? letter.type : undefined)}
              >
                {letter ? letter.char : "_"}
              </Box>
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};
