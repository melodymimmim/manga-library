const supabaseClient = supabase.createClient(
  "https://xtttlmnmyyjfwnnixdjg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dHRsbW5teXlqZndubml4ZGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTA5NjQsImV4cCI6MjA5OTA4Njk2NH0.IPR_xKQrNKw99mto0lbGL-SBMlNUKM3d_hvKrwGYLfU"
);


const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");


document.getElementById("loginBtn").addEventListener("click", async () => {

  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "library.html";

});


document.getElementById("signupBtn").addEventListener("click", async () => {

  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Account created!");

  window.location.href = "library.html";

});