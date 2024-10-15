# NgMagisErp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# NG-MAGIS-ERP

## Bonnes pratiques ( Frontend Web )

### Nomenclatures

#### - Les variables

    Les variables  sont écrites sous format Camel Case (eg. firstName)

    Les noms des  variables doivent être informatifs ( eg. showSideMenu,    dailyStatementPagination )

    Les types des variables doivent être définis ( eg. firstName: string; age:number … )

##### Initialisations des variables:

    Les variables de type string:   eg. firstName:string = ""

    Les variables de type boolean:   eg. isAgent:boolean = false

    Les variables de type number:   eg. count:number = 0

    Les variables de type {name:string,logo:string | null} :
     eg. company:{name:string,logo:string | null} = {name:'MAGIS BI' , logo:null }

    Les variables de type []:
     eg. statements: { name:string, logo:string | null}[] = [ ]

    Les variables de type observable  doivent avoir un suffix  '$'
    eg. wallet$  = Obervable<{ name:string, logo:string | null } >

#### - Les Fonctions

    Les noms des fonctions  sont écrites sous format Camel Case (eg. ngOnInit() ,...)

    Les noms des  fonctions doivent être informatifs ( eg. clickSideMenu(),  getDailyStatement() ,.... )

    Les noms des fonctions  commencent par un verbe conjugué eg. getDailyStatement(){....}

    Les types des paramètres doivent être définis eg. getDailyStatement(id:number){....}

    Les types de retour doivent etre définis
    (eg. getDailyStatement():{ name:string, logo:string | null }[] { })

### Organisations des dossiers / fichiers

* ##### Les noms des dossiers doivent être séparés par un trait d'union
* ##### Nomenclature des fichiers: toujours en minuscule; suivre le mode suivant
  #### [nom-du-fichier].[type].[extension].
* ##### Les images doivent être mis dans le sous dossier images du dossier public
* ##### Les icones doivent être mis dans le sous dossier icons du dossier public
* ##### Les configurations sass (colors, fonts, others) doivent être mis dans le sous dossier sass du dossier public
* ##### Le dossier core contient tous ce qui concerne Dexie , Guards , Services , Interceptors
* ##### Le dossier Components contient tous les autres components pour des pages
* ##### Le dossier Global contient tous Components, Pipes, Directives, Models qui sont utilisés partout dans le projet
* ##### Le dossier routes contient toutes les routes qui sont importées dans app-routes

### Permission a demander

* #### Avant d'installer un nouveau package
* #### Modifier un component ou fichier global ou un fichier de configuration
