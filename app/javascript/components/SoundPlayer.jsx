import React, { useState } from 'react';
import useSound from 'use-sound';

import offlineAlarm from '../../assets/sounds/device_offline_alarm.mp3';
import perimeterAlarm from '../../assets/sounds/perimeter_alarm.mp3';

export default function SoundPlayer(props) {
    // const soundUrl = '/sounds/rising-pops.mp3';
    // const [sound, setSound] = React.useState(offlineAlarm);
    const [sound, setSound] = React.useState(perimeterAlarm);

    const setSoundToUse = (soundName) => {
        if (soundName == "offline") {
            setSound(offlineAlarm);
        }
        else if (soundName == "perimeter") {
            setSound(perimeterAlarm);
        }
    }

    const playSound = () => {
        play();

        setTimeout(() => {
            stop();
        }, 2000);
    }
  
    const [play, { stop }] = useSound(
        sound,
        { volume: 100.0 }
    );
  
    return (
        <div></div>
    );
  }