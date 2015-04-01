#Development Guideline

We recommend to take a look at "CONTRIBUTING" document before start.

##XOMNI.CMS.Backend
  * Contains navigation and license APIs which is consumed by FrontEnd project.
  * Requires a MSSQL Database to provide navigation tree. Database generation and sample data script can be found in **scripts** folder.
  * Requires accessing XOMNI Master APIs to provide license details. You need to enter **masterAPIUserName**, **masterAPIPassword**, **masterAPIUri** key values defined in web.config
  * Can be simply build with Visual Studio 2013.

##XOMNI.CMS.Backend.Test
  * Contains Backend project unit tests.

##XOMNI.CMS.FrontEnd
  * Contains CMS vNext UI.
  * Dependent Backend project to show license cap and navigation data. (Backend API url configuration can be foun in **src/appSettings.json**)
  * Requires bower packages defined in **bower.json**
  * You can find UI components in **src/components** and **src/pages**.
    * **src/components**
      * This folder contains reusable ui components.
      * Can not be called directly by uri.
      * A component must be contained by a page.
    * **src/pages**
      * This folder contains pages can be called by uri.
      * Must follow folder conventions like below to match the url routing.
        * {private/management}/{page name}-page
          * {private/management}/{page-name}-page/{page-name}.html
          * {private/management}/{page-name}-page/{page-name}.ts
        * Defined page above can be accessed from uri like '#/pages/{private}/{page-name}'
