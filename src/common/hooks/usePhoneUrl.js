import {useEffect, useState} from 'react';
import {Linking} from 'react-native';

export const usePhoneURL = () => {
  const [number, setNumber] = useState(null);

  useEffect(() => {
    const process = data => {
      const [, urlNumber] = data.split('://');
      setNumber(urlNumber);
    };
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      process(initialUrl);
    };

    Linking.addEventListener('url', data => {
      process(data.url);
    });

    getUrlAsync();
  }, []);

  return {number};
};
