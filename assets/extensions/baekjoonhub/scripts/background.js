/**
 * solvedac 문제 데이터를 파싱해오는 함수.
 * @param {int} problemId
 */
async function SolvedApiCall(problemId) {
  return fetch(`https://solved.ac/api/v3/problem/show?problemId=${problemId}`, { method: 'GET' }).then((query) =>
    query.json(),
  );
}

function handleMessage(request, sender, sendResponse) {
  if (request && request.closeWebPage === true && request.isSuccess === true) {
    /* Set username */
    chrome.storage.local.set(
      { BaekjoonHub_username: request.username } /* , () => {
      window.localStorage.BaekjoonHub_username = request.username;
    } */,
    );

    /* Set token */
    chrome.storage.local.set(
      { BaekjoonHub_token: request.token } /* , () => {
      window.localStorage[request.KEY] = request.token;
    } */,
    );

    /* Close pipe */
    chrome.storage.local.set({ pipe_BaekjoonHub: false }, () => {
      console.log('Closed pipe.');
    });

    /* Go to onboarding for UX */
    const urlOnboarding = `chrome-extension://${chrome.runtime.id}/welcome.html`;
  } else if (request && request.closeWebPage === true && request.isSuccess === false) {
    alert('Something went wrong while trying to authenticate your profile!');
  } else if (request && request.sender == 'baekjoon' && request.task == 'SolvedApiCall') {
    SolvedApiCall(request.problemId).then((res) => sendResponse(res));
  }
  return true;
}

chrome.runtime.onMessage.addListener(handleMessage);
