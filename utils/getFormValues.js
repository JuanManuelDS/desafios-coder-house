function getFormValues(document) {
  const name = document.getElementById("form-chat-name").value;
  const surname = document.getElementById("form-chat-surname").value;
  const age = document.getElementById("form-chat-age").value;
  const alias = document.getElementById("form-chat-alias").value;
  const email = document.getElementById("form-chat-email").value;
  const message = document.getElementById("form-chat-message").value;

  return { name, surname, age, alias, email, message };
}
