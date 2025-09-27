/*
  File: Hw1.js
  Purpose: Client-side behaviors & validation for Patient Registration Form.
  - Populates state dropdown (50 states + DC + PR).
  - Dynamic date in header.
  - Input masks/validation for DOB, SSN, ZIP, phone.
  - On submit: validate, show errors as popup alerts, then go to thankyou.html.
*/
(function(){
  const STATES = [
    "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC","PR"
  ];

  function setToday(){
    const el = document.getElementById('todayDate');
    if(el){
      const d = new Date();
      el.textContent = 'today is: ' + d.toLocaleDateString(undefined, {year:'numeric',month:'long',day:'numeric'});
    }
  }

  function populateStates(){
    const sel = document.getElementById('state');
    if(!sel) return;
    STATES.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      sel.appendChild(opt);
    });
  }

  function loadFooter(){
    const slot = document.getElementById('footer');
    if(slot){
      fetch('footer.html').then(r => r.text()).then(html => { slot.innerHTML = html; }).catch(()=>{});
    }
  }

  function onlyDigits(s){ return (s||'').replace(/\D+/g,''); }

  function validateForm(e){
    e.preventDefault();
    const f = document.getElementById('patientForm');
    const errs = [];

    // Required checks
    if(!f.first_name.value.trim()) errs.push("First Name is required (max 30).");
    if(!f.last_name.value.trim()) errs.push("Last Name is required (max 30).");
    if(!f.user_id.value.trim()) errs.push("User ID is required (max 20).");
    if(!f.email.value.trim()) errs.push("Email is required.");
    if(!f.address1.value.trim()) errs.push("Address 1 is required.");
    if(!f.city.value.trim()) errs.push("City is required.");
    if(!f.state.value.trim()) errs.push("State is required.");
    if(!f.zip_code.value.trim()) errs.push("ZIP is required.");
    if(!f.dob.value.trim()) errs.push("DOB is required.");
    if(!f.ssn.value.trim()) errs.push("SSN is required.");
    if(!f.password.value) errs.push("Password is required.");
    if(!f.confirm_password.value) errs.push("Please confirm your password.");
    if(!f.gender.value) errs.push("Select a Gender.");
    if(!f.vaccinated.value) errs.push("Select Vaccinated (Yes/No).");
    if(!f.insurance.value) errs.push("Select Insurance (Yes/No).");

    // Field length/format
    if(f.first_name.value.length > 30) errs.push("First Name cannot exceed 30 characters.");
    if(f.last_name.value.length > 30) errs.push("Last Name cannot exceed 30 characters.");
    if(f.middle_initial.value && !/^[A-Za-z]$/.test(f.middle_initial.value)) errs.push("Middle Initial must be one letter (A–Z).");

    // DOB check
    if(f.dob.value){
      if(!/^\d{2}\/\d{2}\/\d{4}$/.test(f.dob.value)) {
        errs.push("DOB must be in MM/DD/YYYY format.");
      } else {
        const [mm,dd,yyyy] = f.dob.value.split('/').map(n=>parseInt(n,10));
        const d = new Date(yyyy, mm-1, dd);
        if(d.getMonth()+1 !== mm || d.getDate() !== dd || d.getFullYear() !== yyyy){
          errs.push("DOB is not a valid calendar date.");
        }
      }
    }

    // SSN check
    if(f.ssn.value){
      const digits = onlyDigits(f.ssn.value);
      if(digits.length < 9 || digits.length > 11){
        errs.push("SSN must be 9 to 11 digits (dashes optional).");
      }
    }

    // ZIP check
    if(f.zip_code.value && !/^\d{5}(-\d{4})?$/.test(f.zip_code.value)){
      errs.push("ZIP must be ##### or #####-####.");
    }

    // Phone optional check
    if(f.phone_number.value && !/^\d{3}-\d{3}-\d{4}$/.test(f.phone_number.value)){
      errs.push("Phone must be ###-###-####.");
    }

    // Email format
    if(f.email.value && !f.email.checkValidity()){
      errs.push("Email format looks invalid.");
    }

    // Passwords
    if(f.password.value !== f.confirm_password.value){
      errs.push("Passwords do not match.");
    }
    if(f.password.value && f.password.value.length < 8){
      errs.push("Password must be at least 8 characters.");
    }

    if(errs.length){
      alert("Please fix the following:\n\n" + errs.join("\n"));
      return;
    }

    // Save summary
    const checked = Array.from(document.querySelectorAll('input[name="medical_history"]:checked')).map(i=>i.value);
    const summary = {
      first_name: f.first_name.value.trim(),
      last_name: f.last_name.value.trim(),
      user_id: f.user_id.value.trim(),
      email: f.email.value.trim(),
      phone_number: f.phone_number.value.trim(),
      state: f.state.value,
      zip_code: f.zip_code.value.trim(),
      gender: f.gender.value,
      vaccinated: f.vaccinated.value,
      insurance: f.insurance.value,
      health_scale: f.health_scale.value,
      medical_history: checked.join(', ')
    };
    sessionStorage.setItem('patientSummary', JSON.stringify(summary));

    // Redirect
    window.location.href = 'thankyou.html';
  }

  function maskers(){
    const phone = document.getElementById('phone_number');
    if(phone){
      phone.addEventListener('input', (e)=>{
        const digits = e.target.value.replace(/\D+/g,'');
        if(digits.length <= 3) e.target.value = digits;
        else if(digits.length <= 6) e.target.value = digits.slice(0,3) + '-' + digits.slice(3);
        else e.target.value = digits.slice(0,3) + '-' + digits.slice(3,6) + '-' + digits.slice(6,10);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    setToday();
    populateStates();
    loadFooter();
    maskers();

    const form = document.getElementById('patientForm');
    if(form){
      form.addEventListener('submit', validateForm);
    }
  });
})();