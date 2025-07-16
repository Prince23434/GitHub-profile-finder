const modeChange = document.querySelector("#btn-mode");
const modeText = document.querySelector("#mode-text");
const modeIcon = document.querySelector("#mode-icon");
const root = document.documentElement.style;

let darkMode = true;

// This code checks if the user's device has a preference for dark mode
const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

// Check if there is a value for "dark-mode" in the user's localStorage
// You get the value from localStorage so that your theme choice (light or dark) is remembered even after:
// the user refreshes the page, or
// closes and reopens the browser, or
// visits again tomorrow, next week, etc.
if (localStorage.getItem("dark-mode") === null) {
    // If there is no value for "dark-mode" in localStorage, check the device preference
    if (prefersDarkMode) {
        // If the device preference is for dark mode, apply dark mode properties
        darkModeProperties();
    } 
    else {
        // If the device preference is not for dark mode, apply light mode properties
        lightModeProperties();
    }
} 
else {
    // If there is a value for "dark-mode" in localStorage, use that value instead of device preference
    if (localStorage.getItem("dark-mode") === "true") {
        // If the value is "true", apply dark mode properties
        darkModeProperties();
    } 
    else {
        // If the value is not "true", apply light mode properties
        lightModeProperties();
    }
}

modeChange.addEventListener("click", () => {
    if (darkMode) {
        lightModeProperties();
    }
    else{
        darkModeProperties();
    }
})

function darkModeProperties() {
    root.setProperty("--lm-bg", "#141D2F");
    root.setProperty("--lm-bg-content", "#1E2A47");
    root.setProperty("--lm-text", "white");
    root.setProperty("--lm-text-alt", "white");
    root.setProperty("--lm-shadow-xl", "rgba(70,88,109,0.15)");
    modeText.innerText = "LIGHT";
    modeIcon.src = "Images/sun-icon.svg";
    root.setProperty("--lm-icon-bg", "brightness(1000%)");
    darkMode = true;
    localStorage.setItem("dark-mode", true);
}
function lightModeProperties() {
    root.setProperty("--lm-bg", "#F6F8FF");
    root.setProperty("--lm-bg-content", "#FEFEFE");
    root.setProperty("--lm-text", "#4B6A9B");
    root.setProperty("--lm-text-alt", "#2B3442");
    root.setProperty("--lm-shadow-xl", "rgba(70, 88, 109, 0.25)");
    modeText.innerText = "DARK";
    modeIcon.src = "Images/moon-icon.svg";
    root.setProperty("--lm-icon-bg", "brightness(100%)");
    darkMode = false;
    localStorage.setItem("dark-mode", false);
}


const avatar = document.querySelector("#avatar");
const userName = document.querySelector("#name");
const userId = document.querySelector("#user");
const joinDate = document.querySelector("#date");

let dateSegments = [];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const userBio = document.querySelector("#bio");
const userRepos = document.querySelector("#repos");
const userFollowers = document.querySelector("#followers");
const userFollowing = document.querySelector("#following");
const userLocation = document.querySelector("#location");
const userPage = document.querySelector("#page");
const userTwitterid = document.querySelector("#twitter");
const userCompany = document.querySelector("#company");

const searchForm = document.querySelector(".searchbar-container");
const searchInput = document.querySelector("#input");
const submitBtn = document.querySelector("#submit"); 

const errorMsg = document.querySelector("#no-results");

const profileCotent = document.querySelector(".profile-content");

let searchedName = "";

searchInput.addEventListener("input", () => {
    errorMsg.textContent = "";
    profileCotent.classList.remove("active");
});

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!searchInput.value.trim()) {
        return;
    }
    searchedName = searchInput.value;
    fetchUserInfo();
})

async function fetchUserInfo() {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span>`;
    try {
        let response = await fetch(`https://api.github.com/users/${searchedName}`);
        let data = await response.json();
        if (response.status === 404) {
            throw new Error("User not found (404)");
        }
        else if (response.status === 403 || response.status === 429) {
            throw new Error("API rate limit exceeded error(403) or (429)");
            
        }
        console.log(data);
        renderUserInfo(data);
        searchInput.value = "";
    } 
    catch (error) {
        if (error.message.includes("404")){
            errorMsg.textContent = "no search results";
        }
        else{
            errorMsg.innerHTML = ` <p> API rate limit exceeded</p> <p> Please try again later</p>`;
            errorMsg.style.width = "230px";
            errorMsg.style.paddingLeft = "5px";
        }
    }
    finally{
        submitBtn.disabled = false;
        submitBtn.textContent = "Search";
    }
}


function renderUserInfo(data){

    profileCotent.classList.add("active");


    dateSegments = data?.created_at.slice(0,10).split("-");
    date.textContent = `Joined ${dateSegments[2]} ${months[dateSegments[1]-1]} ${dateSegments[0]}`;

    avatar.src = data?.avatar_url;

    userName.textContent = data?.name || data?.login;

    userId.textContent = `@${data?.login}`;
    userId.href = data?.html_url;

    userBio.textContent = data?.bio || "This profile has no bio";
    
    userRepos.textContent = data?.public_repos;
    userFollowers.textContent = data?.followers;
    userFollowing.textContent = data?.following;

    //location
    handleField(data?.location, userLocation);

    //blog
    handleField(data?.blog, userPage, "");

    //twitter
    handleField(data?.twitter_username, userTwitterid, "https://twitter.com/");

    //company
    handleField(data?.company, userCompany);
}

function handleField(value, element, linkPrefix = null) {
    if (value) {
        element.textContent = value;
        element.style.opacity = 1;
        element.previousElementSibling.style.opacity = 1;
        if (linkPrefix !== null) {
            element.href = `${linkPrefix}${value}`;
            element.target = "_blank"
        }
    } else {
        element.textContent = "Not Available";
        element.style.opacity = 0.5;
        element.previousElementSibling.style.opacity = 0.5;
        if (linkPrefix !== null) {
            element.href = "#";
            element.target = "_self"
        }
    }
}