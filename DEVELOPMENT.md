# Development Guideline

We recommend everyone to take a look at the "CONTRIBUTING.md" document before starting to work on a contribution.

## Project Structure

#### XOMNI.CMS.Backend

* Contains navigation and license APIs consumed by the FrontEnd project.

#### XOMNI.CMS.Backend.Test

* Contains Backend project unit tests.

#### XOMNI.CMS.FrontEnd

  * Contains CMS vNext UI.
  * The FrontEnd project depends on the Backend project to show the license cap and navigation data (Backend API Url configuration can be found in **src/appSettings.json**).
  * Requires Bower packages defined in **bower.json**.
  * You can find UI components in **src/components** and **src/pages**.
    * **src/components**
      * This folder contains reusable UI components.
      * Can not be called directly by uri.
      * A component must be contained within a page.
    * **src/pages**
      * This folder contains pages which can be called by their Uri.
      * Must follow folder structure conventions shown below to match the url routing.
        * {private/management}/{page name}-page
          * {private/management}/{page-name}-page/{page-name}.html
          * {private/management}/{page-name}-page/{page-name}.ts
        * The pages examplified above can be accessed by using a Uri like **'#/src/{private/management}/{page-name}'**

## Requirements
*  Install **Typescript 1.4**.
*  Install [**Git SCM**](http://git-scm.com/) as a part of the requirement set for **Bower**.
*  Install [**NodeJS**](https://nodejs.org/) as a part of the requirement set for **Bower**
*  Install [**bower package manager**](http://bower.io) to your development environment.
*  Install **SQL Server 2012 or higher**. **XOMNI.CMS.Backend** project needs **MSSQL** Database to provide navigation tree. Database generation and sample data script can be found in the **scripts** folder.
*  You need to have an appropriate version of .NET Framework to compile the back-end project in the platform of your choice.
*  **XOMNI.CMS.Backend** project's web config file has **Master API** fields. If you want to access to Master API's, you can send us an email at  [support@xomni.com](mailto:support@xomni.com)
*  **XOMNI.CMS.FrontEnd** project needs access to the APIs of a XOMNI Cloud Platform Tenant hosted by XOMNI. You can imagine the XOMNI.CMS being a CMS on top of the XOMNI Cloud Platform APIs. With this picture in mind the XOMNI.CMS.Backend project might look confusing. The XOMNI.CMS.Backend project is related to the functionailty explicitly related to the CMS UI. The referred functionalities are not part of the XOMNI Cloud Platform APIs. In order to fully run the XOMNI.CMS you will need a XOMNI Cloud Platform Tenant. You can always get a tenant from [http://xomni.com/](http://xomni.com/). **dev** branch could contain newly added features that aren't currently in production. You can request a staging tenant by sending an email to [support@xomni.com](mailto:support@xomni.com) .

### On Windows
These are additional steps you would like to take specificly for Windows based development environments.
*  Activate **Internet Information Service (IIS)** from **"Turn windows features on off"**.

## Configuring Project Settings

#### XOMNI.CMS.Backend

* Add the connection string of the database you have created earlier into the Web.config file.
* Enter XOMNI Master APIs credentials to **masterAPIUserName**, **masterAPIPassword**, **masterAPIUri** fields in web.config file. XOMNI.CMS.Backend needs these credentials for get license details.
* Restore nuget packages.

#### XOMNI.CMS.FrontEnd

* This project needs some bower packages. You need to restore bower packages before starting to work.
	* Open **Git Shell** or your preferred command line tool.
	* Navigate to the solution folder on shell.

			C:\~\Documents\GitHub> cd .\xomni-cms-vnext
			C:\~\Documents\GitHub\xomni-cms-vnext [dev]> cd .\src
			C:\~\Documents\GitHub\xomni-cms-vnext\src [dev]> cd .\XOMNI.CMS.FrontEnd
	* Run **bower install** command. Packages needed by XOMNI.CMS.FrontEnd will be automatically downloaded.

			C:\~\Documents\GitHub\xomni-cms-vnext\src\XOMNI.CMS.FrontEnd [dev]> bower install
* Enter XOMNI Api credentials and backend url to **appsettings.json**.
* While we migrate the old CMS into the new CMS vNext environment there is a cookie based authentication in place to transition the authentication from old to the new CMS. In order to have a running local dev environment just for the CMS vNext you can simply disable cookie based authentication (Set IsDebug to true) and enter XOMNI API credentials (ApiUserName, ApiUserPassword) in **src/appSettings.json** to have a workaround in place.

## Running CMS VNext

* Run XOMNI.CMS.Backend and XOMNI.CMS.FrontEnd projects.
* Open your browser. You can access any page using a url like: **http://localhost/XOMNI.CMS.FrontEnd/src/#{management|private}/{page-name}**

## Adding a New Page

* Create a new folder named **"{pagename}-page"** under **XOMNI.CMS.FrontEnd/src/pages/{management | private}/**
* The new folder you created should contain two files. **"{pagename}.html"** and **"{pagename}.ts"**. Make sure both files have the **same name**.
* Your ts file should contain a **viewmodel** and a **reference to your html file**. We're using amd dependency and requirejs with text plugin to reference the html files.

Example:

	/// <amd-dependency path="text!./trending-action-settings.html" />

	export var template: string = require("text!./your-page-name.html");
	export class viewModel{
		constructor() {
        	foo();
    	}
	}

* Pages should be registered as Knockout components. In order to register your page, head to **XOMNI.CMS.FrontEnd/src/app/startup.ts** and register your page just above **//[[XO-SCAFFOLDER]]** line.

Format:

	ko.components.register('{management | private}-pagename-page',{require: '{path to your files without file format}'}

Example:

	ko.components.register(
	'management-trending-action-settings-page', { require: 'pages/management/trending-action-settings-page/trending-action-settings' });

**We highly recommend you to take look at other pages before creating a new page.**


##Practices

- You should not use any magic numbers. For example, using .dropdown-nav li:hover ul { top: 37px; } to move a dropdown to the bottom of the nav on hover is bad, as 37px is a magic number. 37px only works here because in this particular scenario the .dropdown-nav happens to be 37px tall. Instead you should use .dropdown-nav li:hover ul { top: 100%; } which means no matter how tall the .dropdown-nav gets, the dropdown will always sit 100% from the top. Every hard-coded measurement you set is a commitment you might not necessarily want to keep.
- Pay attention to "seperation of concept". It means you should seperate your UI codes and backend codes. Instead of using logic in your bindings or small script snippets in your html file, create a new function in your js file and call it from the html file. Having small script snippets or logic in your bindings might seem like a quick way to do easy things but it's not maintainable and not readable in long term.
- Do not use observables/computed observables everytime just because you can. Knockout is an amazing framework that helps alot with binding handlers,observables and also computed observables doing the hard work for you. However you should keep an eye on your variables to make sure you're not overdoing it. Think of an example page that represents a profile page for a particular customer. If that "firstName" of your customer won't change after loading the page, which means there's no need for it to be dynamic, you should be using "var firstName : string;" instead of "ko.observable()". Don't forget every observable,binding handler etc. costs a piece of your resources.