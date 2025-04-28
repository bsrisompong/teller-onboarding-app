import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

interface CurrentTime {
  date: string;
  time: string;
}

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState<CurrentTime>({
    date: '',
    time: '',
  });

  useEffect(() => {
    setCurrentTime({
      date: dayjs().format('DD/MM/YYYY'),
      time: dayjs().format('HH:mm:ss'),
    });

    const timer = setInterval(() => {
      setCurrentTime({
        date: dayjs().format('DD/MM/YYYY'),
        time: dayjs().format('HH:mm:ss'),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return currentTime;
};
