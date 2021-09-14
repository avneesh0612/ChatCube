We are going to create a pr. You need to know basic git and github commands to make a pr. If you don't know about it, check my [Git and Github crash course](https://avneesh0612.hashnode.dev/git-and-github-crash-course "Git and Github crash course")

Click on fork in the top left corner of your screen. Clone the repo you have been redirected to

```bash
git clone url_redirected_to
```

### Installing dependencies

If you use yarn then run

```bash
yarn install
```
This project is using yarn so stick to yarn

### Creating a new branch

```bash
git checkout -b new-feature
```

### Starting server

```bash
yarn dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_CLERK_FRONTEND_API`

`FIREBASE_CONFIG_API_KEY`

`FIREBASE_AUTH_DOMAIN`

`FIREBASE_PROJECT_ID`

`FIREBASE_STORAGE_BUCKET`

`FIREBASE_MESSAGEING_SENDER_ID`

`FIREBASE_APP_ID`

`FIREBASE_MEASUREMENT_ID`

## 1. You can use these development credentials for new features

```
NEXT_PUBLIC_CLERK_FRONTEND_API=clerk.vws38.ep6hq.lcl.dev
FIREBASE_CONFIG_API_KEY=AIzaSyDWsDYYrSxJ8xcH_DZPRZp7zIk1Hlgr-tE 
FIREBASE_AUTH_DOMAIN=chat-app-489ee.firebaseapp.com
FIREBASE_PROJECT_ID=chat-app-489ee
FIREBASE_STORAGE_BUCKET=chat-app-489ee.appspot.com
FIREBASE_MESSAGEING_SENDER_ID=620872866119
FIREBASE_APP_ID=1:620872866119:web:a02c63f5db95893b9f5462
FIREBASE_MEASUREMENT_ID=G-10TQ6211LD
```

## 2. If you want to configure the credentials follow the steps given below 

  
### Configuring Clerk

Checkout [this](https://avneesh0612.hashnode.dev/mastering-clerk-authentication-with-the-nextjs-standard-setup) article to configure Clerk

### Setting up firebase

#### Creating a project

Go to [Firebase](https://console.firebase.google.com/ "Firebase")

- Sign up/in and click on create a project. You can name it anything I will name it chat app.

![Firebase](https://res.cloudinary.com/dssvrf9oz/image/upload/v1624362415/Screenshot_2021-06-22_171606_wari7g.png)

- Leave everything as default and click continue

### Creating a web app

- After the project has been created. Click on the web icon.
  ![Icon](https://res.cloudinary.com/dssvrf9oz/image/upload/v1624362820/Screenshot_2021-06-22_171920_ytnanr.png)

Give it the same name as your project and you can leave everything as default.

![web app](https://res.cloudinary.com/dssvrf9oz/image/upload/v1624362415/Screenshot_2021-06-22_171606_wari7g.png)

### Getting the config

After this is done click on the web app with the name you gave and then click on settings.
![web app icon](https://res.cloudinary.com/dssvrf9oz/image/upload/v1624363121/Screenshot_2021-06-22_172829_sizvew.png)

- Create a file .env.local and add this
  ![Env](https://res.cloudinary.com/dssvrf9oz/image/upload/v1624364193/carbon_1_h0keul.png)
```FIREBASE_CONFIG_API_KEY=AIzaSyDWsDYYrSxJ8xcH_DZPRZp7zIk1Hlgr-tE
FIREBASE_AUTH_DOMAIN=chat-app-489ee.firebaseapp.com
FIREBASE_PROJECT_ID=chat-app-489ee
FIREBASE_STORAGE_BUCKET=chat-app-489ee.appspot.com
FIREBASE_MESSAGEING_SENDER_ID=620872866119
FIREBASE_APP_ID=1:620872866119:web:a02c63f5db95893b9f5462
```
- Scroll down to config and

- Replace the env variables with your keys as named.


### Setting up db

- Go to firestore db tab in the sidebar
- Click on create database and then click on test mode.
  ![db](https://res.cloudinary.com/dssvrf9oz/image/upload/v1624366539/Screenshot_2021-06-22_175144_gcfvyi.png)

### Setting up storage
- Go to stiarge tab in the sidebar
- and change the rules to allow read and write
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write;
    }
  }
}
```


## Restart the server

- Kill the current server and start a new server

```bash
yarn dev
```
## 🛡️ License

This project is licensed under the MIT License - see the [`LICENSE`](LICENSE) file for details.

## Adding features

Now if you login then the recipients and users list will be empty.

You can use some accounts to test your features.

## Creating a PR

Checkout [this](https://avneesh0612.hashnode.dev/how-to-contribute-to-an-open-source-project) article to make a PR

You have successfully created a pull request and I will review and merge it soon.

[
![Contributors](https://contrib.rocks/image?repo=avneesh0612/ChatCube)
](https://github.com/avneesh0612/ChatCube/graphs/contributors)
