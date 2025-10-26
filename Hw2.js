(function(){
  const STATES = [
    "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC","PR"
  ];

  function populateStates(){
    const sel = document.getElementById('state');
    STATES.forEach(s=>{
      const opt=document.createElement('option');
      opt.value=s; opt.textContent=s;
      sel.appendChild(opt);
    });
  }

  function setToday(){
    const today=new Date();
    document.getElementById('todayDate').textContent=
      'today is: ' + today.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
    // set DOB range
    const dob=document.getElementById('dob');
    if(dob){
      const max=new Date().toISOString().split('T')[0];
      const min=new Date();
      min.setFullYear(min.getFullYear()-120);
      dob.max=max;
      dob.min=min.toISOString().split('T')[0];
    }
  }

  function validatePasswords(){
    const pass=document.getElementById('password');
    const conf=document.getElementById('confirm_password');
    if(pass.value!==conf.value){
      alert("Passwords do not match!");
      conf.focus();
      return false;
    }
    return true;
  }

  function reviewForm(){
    const f=document.getElementById('patientForm');
    const area=document.getElementById('reviewArea');
    if(!f.checkValidity()){
      alert("Please correct the highlighted errors before reviewing.");
      f.reportValidity();
      return;
    }
    if(!validatePasswords()) return;

    const checked=[...f.querySelectorAll('input[name="medical_history"]:checked')].map(i=>i.value).join(', ');
    const data={
      "First Name":f.first_name.value.trim(),
      "Middle Initial":f.middle_initial.value.trim(),
      "Last Name":f.last_name.value.trim(),
      "DOB":f.dob.value,
      "Email":f.email.value,
      "Phone":f.phone_number.value,
      "Address 1":f.address1.value,
      "Address 2":f.address2.value,
      "City":f.city.value,
      "State":f.state.value,
      "ZIP":f.zip_code.value,
      "Gender":f.gender.value,
      "Vaccinated":f.vaccinated.value,
      "Insurance":f.insurance.value,
      "Health Scale":f.health_scale.value,
      "Medical History":checked,
      "Symptoms":f.symptoms.value,
      "User ID":f.user_id.value.toLowerCase(),
      "Password":f.password.value
    };

    let html="<h2>PLEASE REVIEW THIS INFORMATION</h2><table>";
    for(const [k,v] of Object.entries(data)){
      html+=`<tr><td><strong>${k}</strong></td><td>${v||'<em>—</em>'}</td></tr>`;
    }
    html+="</table>";
    area.innerHTML=html;
  }

  function submitForm(e){
    e.preventDefault();
    const f=document.getElementById('patientForm');
    if(!f.checkValidity()){ f.reportValidity(); return; }
    if(!validatePasswords()) return;

    const summary={
      first_name:f.first_name.value,
      last_name:f.last_name.value,
      user_id:f.user_id.value.toLowerCase(),
      email:f.email.value,
      phone_number:f.phone_number.value,
      state:f.state.value,
      zip_code:f.zip_code.value,
      gender:f.gender.value,
      vaccinated:f.vaccinated.value,
      insurance:f.insurance.value,
      health_scale:f.health_scale.value
    };
    sessionStorage.setItem('patientSummary',JSON.stringify(summary));
    window.location.href='thankyou.html';
  }

  document.addEventListener('DOMContentLoaded',()=>{
    populateStates();
    setToday();
    document.getElementById('reviewBtn').addEventListener('click',reviewForm);
    document.getElementById('patientForm').addEventListener('submit',submitForm);
  });
})();