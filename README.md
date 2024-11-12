# NgMagisErp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Tauri configurations

### Prerequisites

Install rust and Tauri : [https://v2.tauri.app/fr/start/prerequisites/](https://v2.tauri.app/fr/start/prerequisites/)

Install these Ubuntu dependencies : 
- Run `sudo apt-get install libjavascriptcoregtk-4.1-dev`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# NG-MAGIS-ERP

## Best practices (Web Frontend)

### Nomenclatures

#### - Variables

    Variables are written in Camel Case format (eg. firstName)

    Variable names must be informative (eg. showSideMenu, dailyStatementPagination)

    Variable types must be defined (eg. firstName: string; age:number …)

##### Variable initializations:

    String variables: eg. firstName:string = ""

    Boolean type variables: eg. isAgent:boolean = false

    Variables of type number: eg. count:number = 0

    Variables of type {name:string,logo:string | null}:
     eg. company:{name:string,logo:string | null} = {name:'MAGIS BI', logo:null }

    Variables of type []:
     eg. statements: { name:string, logo:string | null}[] = [ ]

    Variables of observable type must have a suffix '$'
    eg. wallet$ = Obervable<{ name:string, logo:string | null } >

#### - Functions

    Function names are written in Camel Case format (eg. ngOnInit(),...)

    Function names must be informative (eg. clickSideMenu(), getDailyStatement(),....)

    Function names start with a conjugated verb eg. getDailyStatement(){....}

    Parameter types must be defined eg. getDailyStatement(id:number){....}

    Return types must be defined
    (eg. getDailyStatement():{ name:string, logo:string | null }[] { })

#### - The Models

- ##### Nomenclature of the files which contains the models: always in lower case; follow the following mode
  #### [name].models.ts.
  eg (merchant.models.ts)
- ##### Nomenclature of interfaces and other types: always capitalized; follow the following mode
  #### [Name][Action]Model ==> Action and optional
  eg:
  - ClientModel: A model that represents a client
  - ClientCreationBodyModel: A model that represents the data necessary for creating a client
  - ClientCreationResponseModel: A model that represents response data when creating a client

### Folder/file organizations

- ##### Folder names must be separated by a hyphen
- ##### File nomenclature: always lowercase; follow the following mode
  #### [file-name].[type].[extension].
- ##### Images must be put in the images subfolder of the public folder
- ##### The icons must be put in the icons subfolder of the public folder
- ##### The sass configurations (colors, fonts, others) must be put in the sass subfolder of the public folder
- ##### The core folder contains everything related to Dexie, Guards, Services, Interceptors
- ##### The Components folder contains all other components for pages
- ##### The Global folder contains all Components, Pipes, Directives, Models which are used everywhere in the project
- ##### The routes folder contains all the routes that are imported into app-routes

### Request authorization before carrying out these actions

- #### Before installing a new package
- #### Modify a global component or a global file or a configuration file

### The minimum necessary for certain functionalities

#### \* Lists

- ##### Importance of data
- ##### Filters and search
- ##### Pagination
- ##### Empty state management
- ##### Refresh and Back

#### \* Details

- ##### Importance of data
- ##### Refresh and Back
- ##### Empty state management

### \* Forms

- ##### Importance of data
- ##### Data verifications
- ##### Empty sensitive data
- ##### Always use form-floating (bootstrap)

### \* Translation

- ##### Good English
- ##### Punctuation
- ##### Manage upper and lower case letters correctly

### \* Images ( img )

- ##### Complete the alt attribute with understandable content
