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
*  You can use Visual Studio 2013 Update 2 or higher and Visual Studio Code on Windows or Visual Studio Code on MacOS and Linux platforms. 
*  Install **Typescript 1.4**.
*  Install [**Git SCM**](http://git-scm.com/) as a part of the requirement set for **Bower**.
*  Install [**NodeJS**](https://nodejs.org/) as a part of the requirement set for **Bower**
*  Install [**bower package manager**](http://bower.io) to your development environment. 
*  Install **SQL Server 2012 or higher**. **XOMNI.CMS.Backend** project needs **MSSQL** Database to provide navigation tree. Database generation and sample data script can be found in the **scripts** folder.
*  Activate **Internet Information Service (IIS)** from **"Turn windows features on off"**.
*  **XOMNI.CMS.Backend** project's web config file has **Master API** fields. If you want to access to Master API's, you can send us an email at  [support@xomni.com](mailto:support@xomni.com) 
*  **XOMNI.CMS.FrontEnd** project needs access to the APIs of a XOMNI Cloud Platform Tenant hosted by XOMNI. You can imagine the XOMNI.CMS being a CMS on top of the XOMNI Cloud Platform APIs. With this picture in mind the XOMNI.CMS.Backend project might look confusing. The XOMNI.CMS.Backend project is related to the functionailty explicitly related to the CMS UI. The referred functionalities are not part of the XOMNI Cloud Platform APIs. In order to fully run the XOMNI.CMS you will need a XOMNI Cloud Platform Tenant. You can always get a tenant from [http://xomni.com/](http://xomni.com/). **dev** branch could contain newly added features that aren't currently in production. You can request a staging tenant by sending an email to [support@xomni.com](mailto:support@xomni.com) . 

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
