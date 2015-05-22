# Deployment Guideline
- In order to deploy the Frontend project, you need to go through the steps mentioned in our [development](https://github.com/XomniCloud/xomni-cms-vnext/blob/dev/DEVELOPMENT.md) guideline.
- You need to deploy CMS Frontend project manually. In the future we are planning to provide a gulp file to deploy and bundle required resources. Right now there is an issue [#16](https://github.com/XomniCloud/xomni-cms-vnext/issues/16) related to our gulp file.
- Compile backend project using .NET Framework 4.5.1 and then copy created assemblies to desired folder if required.
- Update **appSettings.json** for API settings and backend service URI.
- Copy frontend project folders to desired location and you're ready to run CMS.
