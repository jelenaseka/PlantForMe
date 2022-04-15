export default function getHeaders() {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    myHeaders.append('Authorization', user.token)
  }
  return myHeaders
}