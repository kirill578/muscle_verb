import React from 'react';
import { Box, Button, Paper } from '@material-ui/core'
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const abc = 'abcdefghijklmnopqrstuvwxyz'.split('');

export const App = () => {
  const ref = React.useRef<any>();
  const [buffer, setBuffer] = React.useState('');
  React.useEffect(() => {
    const onKey = ({ key }: any) => {
      if (!abc.includes(key)) {
        return;
      }
      setBuffer(old => old + key);
      if (ref.current) {
        (window as any).keyboard = ref.current;
        abc.filter(char => char !== key).forEach(char =>
          ref.current.physicalKeyboard.handleHighlightKeyUp({
            key: char,
            code: 'key'
        }));
        ref.current.physicalKeyboard.handleHighlightKeyDown({
            key,
            code: 'key'
        });
      }
    }
    window.addEventListener('keyup', onKey);
    return () => {
      window.removeEventListener('keyup', onKey);
    };
  }, [setBuffer]);

  return (
    <Box position="absolute" width="100%" height="100%" p="10px">
      <Box display="flex" flexDirection="row">
        {buffer.split('').map((char, index) => {
          return (
            <Box key={index} paddingRight="20px">
              <Paper elevation={3}>
                <Box width="70px" height="90px" textAlign="center" fontSize="70px">{char}</Box>
              </Paper>
            </Box>
          )
        })}
      </Box>
      <Button variant="outlined">Button</Button>
      <Keyboard
        keyboardRef={r => {
          ref.current = r;
        }}
        syncInstanceInputs={true}
        onChange={() => {}}
        onKeyPress={() => {}}
      />
    </Box>
  );
}
