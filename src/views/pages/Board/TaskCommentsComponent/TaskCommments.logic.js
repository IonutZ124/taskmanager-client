const generateMessage = (message) => {
  return message.replaceAll(/@([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g, (text) => {
    /*@[a-zA-Z_]+?\.[a-zA-Z]{2,3}*/
    let tmpText = text.replace(/@([a-zA-Z0-9._-]+?\.[a-zA-Z]{2,3}$)/g, "");
    tmpText = tmpText.replace(/@([^\s]+)/g, (matcher) => `<b>${matcher}</b>`);
    return tmpText;
  });
};

export { generateMessage };
