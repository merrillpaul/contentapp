# The Ionic Super Starter 🎮

<img src="https://user-images.githubusercontent.com/236501/32385619-bddac0ac-c08c-11e7-9ee4-9c892197191f.png" width="400" />

The Ionic Super Starter is a batteries-included starter project for Ionic apps
complete with pre-built pages, providers, and best practices for Ionic
development.

The goal of the Super Starter is to get you from zero to app store faster than
before, with a set of opinions from the Ionic team around page layout,
data/user management, and project structure.

The way to use this starter is to pick and choose the various page types you
want use, and remove the ones you don't. If you want a blank slate, this
starter isn't for you (use the `blank` type instead).

One of the big advances in Ionic was moving from a rigid route-based navigation
system to a flexible push/pop navigation system modeled off common native SDKs.
We've embraced this pattern to provide a set of reusable pages that can be
navigated to anywhere in the app. Take a look at the [Settings
page](https://github.com/ionic-team/starters/blob/master/ionic-angular/official/super/src/pages/settings/settings.html)
for a cool example of a page navigating to itself to provide a different UI
without duplicating code.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Pages](#pages)
3. [Providers](#providers)
4. [i18n](#i18n) (adding languages)
5. [Content Update](#content-update)

## <a name="getting-started"></a>Getting Started

To test this starter out, install the latest version of the Ionic CLI and run:

```bash
ionic start mySuperApp super
```

## Pages

The Super Starter comes with a variety of ready-made pages. These pages help
you assemble common building blocks for your app so you can focus on your
unique features and branding.

The app loads with the `FirstRunPage` set to `TutorialPage` as the default. If
the user has already gone through this page once, it will be skipped the next
time they load the app.

If the tutorial is skipped but the user hasn't logged in yet, the Welcome page
will be displayed which is a "splash" prompting the user to log in or create an
account.

Once the user is authenticated, the app will load with the `MainPage` which is
set to be the `TabsPage` as the default.

The entry and main pages can be configured easily by updating the corresponding
variables in
[src/pages/pages.ts](https://github.com/ionic-team/starters/blob/master/ionic-angular/official/super/src/pages/pages.ts).

Please read the
[Pages](https://github.com/ionic-team/starters/tree/master/ionic-angular/official/super/src/pages)
readme, and the readme for each page in the source for more documentation on
each.

## Providers

The Super Starter comes with some basic implementations of common providers.

### User

The `User` provider is used to authenticate users through its
`login(accountInfo)` and `signup(accountInfo)` methods, which perform `POST`
requests to an API endpoint that you will need to configure.

### Api

The `Api` provider is a simple CRUD frontend to an API. Simply put the root of
your API url in the Api class and call get/post/put/patch/delete 

## i18n

Ionic Super Starter comes with internationalization (i18n) out of the box with
[ngx-translate](https://github.com/ngx-translate/core). This makes it easy to
change the text used in the app by modifying only one file. 

### Adding Languages

To add new languages, add new files to the `src/assets/i18n` directory,
following the pattern of LANGCODE.json where LANGCODE is the language/locale
code (ex: en/gb/de/es/etc.).

### Changing the Language

To change the language of the app, edit `src/app/app.component.ts` and modify
`translate.use('en')` to use the LANGCODE from `src/assets/i18n/`

## <a name="content-update"></a>Update content
Content update refers to updating the battery folder.
Non content update is for the app ( typescript/ng src).

### Content update using sibling channels  
For each branch/channel we will setup a sibling channel.
For eg `prod` and `Production` branch and channel will have `prod_content` and `Production_Content` branch and channel.

#### Initial setup 
- Initial app is built from `prod` and deployed to `Production` channel. This does not contain the battery folder
- The app is configured to update automatically (`auto`) using the `Production` channel. These assets are downloaded and extracted when app starts up for the first time and subsequently
- The `prod_content` and `Production_Content` channel is a copy of the `prod` , only additionally with the `battery` folder within the `assets`.
- The app on login does a manual check and extract from the `Production_Channel` and extracts the battery folder.


#### Content only change
This is if there is change only in the battery folder. 
- No need to deploy the `prod` and `Production` channel
- Add the change into the `prod_content` branch and then `git` commit using `git push origin prod_content`
- Start an ionic build on the `Production_Channel` using `git push ionic prod_content`. Wait for the build to complete.
- Deploy these changes to the `Production_Channel`.
- Next login on the app downloads the latest battery folder from the `Production_Channel` manually as before.

#### App change
This is if there is change in the Ionic APP ( TS, local assets etc)
- Make these changes in the `prod` branch and `git push origin prod`
- Merge these changes into the `prod_content` branch and `git push origin prod_content`
- Start an Ionic build for both using `git push ionic prod` and `git push ionic prod_content`. Wait for them to complete
- Deploy changes respectively to `Production` and `Production_Content` channel
- Next login pulls in app changes from `Production` and latest content  from `Production_Channel`

Note: The reason to keep app changes in sync with both sibling branches is that, during the manual content update after login, even though the extraction process extracts to a different location, the Ionic app only loads the new extracted app folder.

#### Both App and Content change.
- Make app changes in both `prod` and `prod_content` branch.
- Add content change only in `prod_content` branch,
- Commit these changes: ``git push origin prod` and `git push ionic prod_content`
- Start an Ionic build for both using `git push ionic prod` and `git push ionic prod_content`. Wait for them to complete
- Deploy changes respectively to `Production` and `Production_Content` channel
- Next login pulls in app changes from `Production` and updated content  from `Production_Channel`

```bash
ionic start mySuperApp super