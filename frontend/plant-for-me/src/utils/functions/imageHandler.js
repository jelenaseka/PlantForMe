const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const handleFileUpload = async (e, setFunc) => {
  const file = e.target.files[0];
  const base64 = await convertToBase64(file);
  
  setFunc(base64);
  e.target.value = null;
};