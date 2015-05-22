# Deployment Guideline
- In order to deploy frontend project, you need to complete steps mentioned in [development](https://github.com/XomniCloud/xomni-cms-vnext/blob/dev/DEVELOPMENT.md) guideline.
- We will provide a gulp file to deploy and bundle required resources in the future. Right now you need to deploy CMS frontend manually. There is an issue [#16](https://github.com/XomniCloud/xomni-cms-vnext/issues/16) related to gulp file.   
- Deploy backend project by publishing project in Visual Studio if required.
- Update **appSettings.json** for API settings and backend service URI.
- Copy frontend project folders to desired location and you're ready to run CMS.