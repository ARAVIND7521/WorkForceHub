import { useState, useCallback } from 'react';

function useToken() {
  const getToken = useCallback(() => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token || userToken
  }, []);

  const getSecretID = useCallback(() => {
    const SecretIDString = localStorage.getItem('secretID');
    const adminSecretID = JSON.parse(SecretIDString);
    return adminSecretID?.secretID || adminSecretID
  }, []);

  const getOtpToken = useCallback(() => {
    const OtpTokenString = localStorage.getItem('OtpToken');
    const OtpTokenNO = JSON.parse(OtpTokenString);
    return OtpTokenNO?.OtpToken || OtpTokenNO
  }, []);

  const [otpToken, setOtpToken] = useState(getOtpToken());
  const [token, setToken] = useState(getToken());
  const [secretID, setSecretID] = useState(getSecretID());

  const saveToken = useCallback(userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  }, []);

  const saveSecretID = useCallback(adminSecretID => {
    localStorage.setItem('secretID', JSON.stringify(adminSecretID));
    setSecretID(adminSecretID);
  }, []);

  const saveOtpToken = useCallback(userOtpToken => {
    localStorage.setItem('OtpToken', JSON.stringify(userOtpToken));
    setOtpToken(userOtpToken);
  }, []);

  return {
    setToken: saveToken,
    token,
    setSecretID: saveSecretID,
    secretID,
    setOtpToken: saveOtpToken,
    otpToken,
  }
}

export default useToken