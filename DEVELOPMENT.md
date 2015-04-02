#Development Guideline

We recommend everyone to take a look at the "CONTRIBUTING.md" document before starting to work on a contribution.

##XOMNI.CMS.Backend
  * Contains navigation and license APIs which is consumed by the FrontEnd project.
  * Requires a MSSQL Database to provide navigation tree. Database generation and sample data script can be found in the **scripts** folder.
  * Requires accessing XOMNI Master APIs to get license details. You need to enter **masterAPIUserName**, **masterAPIPassword**, **masterAPIUri** key values defined in web.config file.
  * Can be simply build with Visual Studio 2013.

##XOMNI.CMS.Backend.Test
  * Contains Backend project unit tests.

##XOMNI.CMS.FrontEnd
  * Contains CMS vNext UI.
  * It is dependent on the Backend project to show license cap and navigation data. (Backend API url configuration can be foun in **src/appSettings.json**)
  * Requires bower packages defined in **bower.json**
  * You can find UI components in **src/components** and **src/pages**.
    * **src/components**
      * This folder contains reusable UI components.
      * Can not be called directly by uri.
      * A component must be contained within a page.
    * **src/pages**
      * This folder contains pages which can be called by their uri.
      * Must follow folder structure conventions shown below to match the url routing.
        * {private/management}/{page name}-page
          * {private/management}/{page-name}-page/{page-name}.html
          * {private/management}/{page-name}-page/{page-name}.ts
        * Defined pages examplified above can be accessed from uri like '#/pages/{private}/{page-name}'
