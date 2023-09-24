
# PUMIS-CLI

A CLI tool for getting your attendance right from your Terminal.
> Saves time of going through tedious steps to see your attendance

⚠ Note : This Repository is only for education purpose-only. Don't use any method which may harm the site


## Installation 🤖
Make sure you have nodejs installed.

run:
```bash
npx pumis-cli
 ```

## Usage 🔎


The first argument is your Username and second is your password.

#### 📜 For Attendance Summary
```bash
pumis <username> <password>
# example
pumis 210305105xxx xxxxxx
```

#### 🛌   Getting Attendance of Absent days
pass `-a` flag to get only absent days
```bash
pumis -a 210305105xxx xxxxxx
```

####  📅 Get Attendance Of A Specific Date
pass `-d` flag to pass a specific date
```bash
pumis -d 210305105xxx xxxxxx
```

<div align="center">  ⭐ this repo if you it has helped you in anyway <div/>

> Note: Run this command in full window, tabular structure may break in small window.

<hr>

###  About this...

+ Thanks to [Saicharan](https://github.com/SaicharanKandukuri) for reverse-engineering the login process and other page automation.

<details>
<summary> To do 📝 </summary>
implement a Login for default user, so don't have to enter username and password everytime
