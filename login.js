const supabaseUrl = "https://xtttlmnmyyjfwnnixdjg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dHRsbW5teXlqZndubml4ZGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTA5NjQsImV4cCI6MjA5OTA4Njk2NH0.IPR_xKQrNKw99mto0lbGL-SBMlNUKM3d_hvKrwGYLfU";

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);


const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");


// LOGIN
loginBtn.addEventListener("click", async () => {

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }


  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });


  if (error) {
    alert(error.message);
    console.log(error);
    return;
  }


  alert("Login successful!");

  window.location.href = "library.html";

});



// CREATE ACCOUNT
signupBtn.addEventListener("click", async () => {

  const email = emailInput.value.trim();
  const password = passwordInput.value;


  if (!email || !password) {
    alert("Enter email and password");
    return;
  }


 const { data, error } = await supabaseClient.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      username: email.split("@")[0]
    }
  }
});


  if (error) {
    alert(error.message);
    console.log(error);
    return;
  }

const { error: profileError } = await supabaseClient
  .from("profiles")
  .insert({
    user_id: data.user.id,
    username: email.split("@")[0]
  });

if (profileError) {
  console.log(profileError);
  alert(profileError.message);
  return;
}
  });
  alert("Account created!");