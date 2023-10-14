import {
  emailInput, 
  passwordInput, 
  passwordCheckInput, 
  joinButton, 
  eyeButtonInPassword, 
  eyeButtonInPasswordCheck
} from './tags.js';

import {
  checkEmail, 
  checkPassword, 
  showErrorMessage, 
  removeErrorMessage
} from './validation.js';

import { togglePasswordInPassword, togglePasswordInPasswordCheck } from './togglePassword.js';

const errorMessageClass = 'border-red';

async function valiDateEmail() {
  const emailValue = emailInput.value;

  if (!emailValue) {
    showErrorMessage('email', '이메일을 입력해주세요.');
  } else if (!checkEmail(emailValue)) {
    showErrorMessage('email', '올바른 이메일 주소가 아닙니다.');
  } else {
    removeErrorMessage('email');
  }
  
  try {
    const response = await fetch('https://bootcamp-api.codeit.kr/api/check-email', {
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailValue
      })
    });
    const result = await response.json();

    if (response.status === 409) {
      showErrorMessage('email', '이미 사용 중인 이메일입니다.');
    } else if (response.status === 200) {
      removeErrorMessage('email');
    }
  } catch (error) {
    console.log(error);
  }
}

function valiDatePassword() {
  const passwordValue = passwordInput.value;

  if (!passwordValue || !checkPassword(passwordValue)) {
    showErrorMessage('password', '비밀번호는 영문, 숫자 조합 8자 이상 입력해 주세요.');
  } else {
    removeErrorMessage('password');
  }
}

function valiDatePasswordCheck() {
  const passwordValue = passwordInput.value;
  const passwordCheckValue = passwordCheckInput.value;

  if (passwordValue !== passwordCheckValue) {
    showErrorMessage('passwordCheck', '비밀번호가 일치하지 않아요.');
  } else {
    removeErrorMessage('passwordCheck');
  }
}

function hasErrorMessageClass(input) {
  return input.className.includes(errorMessageClass);
}

async function join(e) {
  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value;
  const passwordCheckValue = passwordCheckInput.value;

  e.preventDefault();

  try {
    const response = await fetch('https://bootcamp-api.codeit.kr/api/sign-up', {
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue
      })
    });
    const result = await response.json();

    if (response.status === 200 && passwordValue === passwordCheckValue) {
      localStorage.setItem('join-token', result.data.accessToken);
      setTimeout(() => {localStorage.removeItem('join-token');}, 5000)
      return location.href = '../pages/folder.html';
    } else if (response.status === 400) {
      showErrorMessage('email', '이메일을 확인해주세요.');
      showErrorMessage('password', '비밀번호를 확인해주세요.');
    }
  } catch (error) {
    console.log(error);
  }
}

if (localStorage.getItem('join-token')) {
  location.href = '../pages/folder.html';
}

emailInput.addEventListener('focusout', valiDateEmail);
passwordInput.addEventListener('focusout', valiDatePassword);
passwordCheckInput.addEventListener('focusout', valiDatePasswordCheck);
passwordCheckInput.addEventListener('keypress', (e) => e.code === 'Enter' && join());
joinButton.addEventListener('click', join);
eyeButtonInPassword.addEventListener('click', togglePasswordInPassword);
eyeButtonInPasswordCheck.addEventListener('click', togglePasswordInPasswordCheck);
