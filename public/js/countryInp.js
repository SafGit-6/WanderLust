const wrapper = document.querySelector(".wrapper"),
    selectBtn = wrapper.querySelector(".select-btn"),
    searchInp = wrapper.querySelector("input"),
    options = wrapper.querySelector(".options");

    //array of countries
    let countries = [
            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", 
            "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
            "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
            "Belgium", "Belize", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
            "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
            "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad",
            "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia",
            "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
            "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
            "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
            "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
            "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
            "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
            "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
            "Korea", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", 
            "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
            "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mexico", 
            "Moldova", "Monaco", "Mongolia", "Morocco", "Mozambique", "Myanmar", 
            "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", 
            "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palestine", 
            "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
            "Qatar", "Romania", "Russia", "Rwanda", "Saudi Arabia", "Senegal", 
            "Serbia", "Seychelles", "Singapore", "Slovakia", "Slovenia", "Somalia", 
            "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Suriname",
            "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand",
            "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
            "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
            "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia",
            "Zimbabwe"
        ];

    function addCountry(selectedCountry){
        options.innerHTML = "";
        countries.forEach(country => {
            let isSelected = country == selectedCountry ? "selected" : "";
            // adding each country inside li and inserting all li inside options tag
            let li = `<li onclick="updateName(this)" class="${isSelected}">${country}</li>`;
            options.insertAdjacentHTML("beforeend", li);
        })
    }

    addCountry();

    function updateName(selectedLi){
        searchInp.value = ""; 
        addCountry(selectedLi.innerText);
        wrapper.classList.remove("active");
        selectBtn.firstElementChild.innerText = selectedLi.innerText;
    }

    searchInp.addEventListener("keyup", ()=>{
        let arr = [];
        let searchedVal = searchInp.value.toLowerCase();
        // returning all countries from array which are start with user searched value
        arr = countries.filter(data=> {
            return data.toLowerCase().startsWith(searchedVal);
        }).map(data => `<li onclick="updateName(this)">${data}</li>`).join("");
        options.innerHTML = arr ? arr : `<p>Oops! Country not found</p>`;
        
    })


    selectBtn.addEventListener("click",()=>{
        wrapper.classList.toggle("active");
    });
