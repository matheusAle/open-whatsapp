import React, {useEffect, useRef, useState} from 'react';
import {Linking, StyleSheet, View, Button, Text, Pressable} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {usePhoneURL} from './common/hooks/usePhoneUrl';
import parsePhoneNumber from 'libphonenumber-js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  button: {marginTop: 24},
  input: {
    width: '100%',
  },
  alert: {
    padding: 8,
    alignItems: 'flex-start',
    backgroundColor: 'gold',
    marginBottom: 24,
    color: '#fff',
    borderRadius: 8,
    width: '96%',
  },
  alertText: {
    color: '#fff',
    fontSize: 16,
  },
  alertButton: {
    backgroundColor: '#d1b51f',
    padding: 6,
    color: '#fff',
    flex: 0,
    borderRadius: 4,
    marginTop: 4,
  },
});

const App = () => {
  const {number: initialNumber} = usePhoneURL();
  const [value, setValue] = useState('');
  const [isInvalid, setInvalid] = useState(false);
  const [code, setCode] = useState(55);
  const [country, setCountry] = useState('BR');
  const phoneInput = useRef(null);
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    if (!initialNumber) {
      return;
    }
    const phoneNumber = parsePhoneNumber(initialNumber);
    if (phoneNumber) {
      setCode(phoneNumber.countryCallingCode);
      setCountry(phoneNumber.country);
      setValue(phoneNumber.nationalNumber);
      setKey(Date.now());
    } else {
      setInvalid(true);
    }
  }, [initialNumber]);

  const open = () => {
    Linking.openURL(`whatsapp://send?phone=${code + value}`);
  };

  return (
    <View style={styles.container}>
      {isInvalid && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            Telefone {initialNumber} inválido
          </Text>
          <Pressable
            onPress={() => {
              setValue(value + initialNumber);
              setKey(Date.now());
              setInvalid(false);
            }}>
            <Text style={styles.alertButton}>Toque para prencher</Text>
          </Pressable>
        </View>
      )}
      <PhoneInput
        style={styles.input}
        ref={phoneInput}
        key={key}
        defaultValue={value}
        defaultCode={country}
        layout="first"
        withDarkTheme
        onChangeCountry={c => {
          setCode(c.callingCode);
          setCountry(c.name);
        }}
        onChangeText={text => {
          setValue(text);
        }}
        autoFocus
      />
      <View style={styles.button}>
        <Button onPress={open} title="Abrir Conversa" />
      </View>
    </View>
  );
};

export default App;
