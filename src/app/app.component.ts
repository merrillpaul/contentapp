import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';

import { FirstRunPage } from '../pages/pages';
import { Settings } from '../providers/providers';

import { Pro, DeployConfig } from '@ionic/pro';
import { HttpClient } from '@angular/common/http';

const TESTS = [
  'cms',
  'gfta2',
  'wiat3'
];

@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages For here</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Welcome', component: 'WelcomePage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Cards', component: 'CardsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Login', component: 'LoginPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Master Detail', component: 'ListMasterPage' },
    { title: 'Menu', component: 'MenuPage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Search', component: 'SearchPage' }
  ]

  constructor(private translate: TranslateService, platform: Platform, settings: Settings, 
    private http: HttpClient,
    private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
     
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();
    //this.updateContentIfAny();
    this.logTestJson();
  }


  async updateContentIfAny() {
    try {
      this.checkChannel();
      const initialConfig: DeployConfig =  await Pro.deploy.info();
      debugger;
      try {
      await Pro.deploy.init({
        channel: 'Master',
        appId: initialConfig.appId
      });
      await this.performManualUpdate();
      await this.checkChannel();
      } catch (e) {
        
      } 

      // resetting to original config
      await Pro.deploy.init(initialConfig);
    } catch(e) {

    } 
    this.logTestJson();
    
    
  }

  async checkChannel() {
    try {
      const res = await Pro.deploy.info();
      console.log(`check channel ${res.channel}`);
      Pro.monitoring.log(`A new change came in with ${res.binary_version}`, {level: 'info'} );
      Pro.monitoring.log(`check channel ${res.channel}`, {level: 'info'} );
    } catch (err) {
      // We encountered an error.
      // Here's how we would log it to Ionic Pro Monitoring while also catching:

      // Pro.monitoring.exception(err);
    }    
  }

  async performManualUpdate() {

    /*
      Here we are going through each manual step of the update process:
      Check, Download, Extract, and Redirect.
      This code is currently exactly the same as performAutomaticUpdate,
      but you could split it out to customize the flow.

      Ex: Check, Download, Extract when a user logs into your app,
        but Redirect when they logout for an app that is always running
        but used with multiple users (like at a doctors office).
    */

    try {
      const haveUpdate = await Pro.deploy.check();

      if (haveUpdate){
        

        await Pro.deploy.download((progress) => {
          // this.downloadProgress = progress;
        })
        await Pro.deploy.extract();
        await Pro.deploy.redirect();
      }
    } catch (err) {
      // We encountered an error.
      // Here's how we would log it to Ionic Pro Monitoring while also catching:

      // Pro.monitoring.exception(err);
    }

  }




  async logTestJson() {
    for (let test of TESTS) {
      try {
        let json = await this.http.get(`assets/battery/${test}/${test}.json`).toPromise();
        console.log(` Got JSON for ${test} is ${JSON.stringify(json, null, 5)}`);
        Pro.monitoring.log(`Got JSON for ${test} with ${JSON.stringify(json, null, 5)}`, {level: 'info'} );
      } catch (e) {
        console.log(`didnt get json for ${test}`);
        Pro.monitoring.log(`didnt get json for ${test}`, { level: 'warn'});
      }
    }
  }

  
  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
