import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

let myUserName = process.env.user_name;

console.log(myUserName);
console.log("Start of an awesome project");
