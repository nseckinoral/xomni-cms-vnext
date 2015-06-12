#How to contribute?

We recommend to take a look at "Issues" before start to prevent you make a duplicated effort.

* Fork it.
* Create a new branch from you want to contribute (see Branch Naming)
* Commit your local changes as logical units with clearly described commit messages
* Complete unit tests for your changes
*	Update your local repository from upstream
*	Run all unit tests and be sure all of them passed
*	Push your local changes. Do not
 *	--force pushes
 *	Modify Git history in any way
* Create a pull request

#Branch Naming
*	No master branch.
*	Dev :
 *	May be unstable, if branch is ahead of the last tag. These branch has pre-release nuget packages with the same tag name.
 *	Being used for next version.
* Staging :
  * Stable. These branch is being used for CI (staging environment).
* Prod:
  * Stable. These branch is being used for CI (production environment). 
*	V[ApiVersion] Branch :
 *	Stable.
 *	These branch has pre-release nuget packages with the same tag name.


 ![](https://cdn.rawgit.com/XomniCloud/xomni-sdk-dotnet/dev/assets/branch_schema.png)
